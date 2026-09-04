import { UserProduct, Recipe, Meal, DayMenu, WeeklyMenu, GeneratorState } from './types';
import { recipesDatabase } from './recipes';
import { productsDatabase } from './products';

const DAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

export const PANTRY_STAPLES = new Set([
  'Оливкова олія',
  'Соняшникова олія',
  'Масло вершкове',
  'Цибуля',
  'Часник',
  'Соєвий соус',
  'Сіль',
  'Перець',
  'Спеції',
  'Мед',
  'Цукор',
  'Сметана',
]);

export const DRY_WEIGHT_PRODUCTS = new Set([
  'Рис', 'Гречка', 'Вівсянка', 'Макарони', 'Кіноа',
  'Булгур', 'Кускус', 'Пшоно', 'Чечевиця', 'Нут', 'Квасоля',
]);

const MEAL_TYPE_MAP: Record<number, { type: string; ratio: number }[]> = {
  3: [
    { type: 'breakfast', ratio: 0.30 },
    { type: 'lunch', ratio: 0.40 },
    { type: 'dinner', ratio: 0.30 },
  ],
  4: [
    { type: 'breakfast', ratio: 0.25 },
    { type: 'lunch', ratio: 0.35 },
    { type: 'snack', ratio: 0.15 },
    { type: 'dinner', ratio: 0.25 },
  ],
  5: [
    { type: 'breakfast', ratio: 0.20 },
    { type: 'snack', ratio: 0.10 },
    { type: 'lunch', ratio: 0.35 },
    { type: 'snack', ratio: 0.10 },
    { type: 'dinner', ratio: 0.25 },
  ],
};

const UNIT_WEIGHTS: Record<string, number> = {
  'Яйця': 60, 'Банани': 120, 'Яблуко': 180,
  'Апельсин': 180, 'Ківі': 75, 'Авокадо': 150,
};

function toGrams(quantity: number, unit: string, productName: string): number {
  if (unit === 'шт') return (UNIT_WEIGHTS[productName] || 100) * quantity;
  if (unit === 'кг') return quantity * 1000;
  return quantity;
}

function getMainIngredients(recipe: Recipe): string[] {
  return recipe.ingredients
    .map(i => i.product_name)
    .filter(name => !PANTRY_STAPLES.has(name));
}

// Compute actual calories from the product database for a recipe's ingredients.
function getRecipeCalories(recipe: Recipe): number {
  let total = 0;
  recipe.ingredients.forEach(ing => {
    const product = productsDatabase.find(p => p.name === ing.product_name);
    if (!product) return;
    total += (product.calories_per_100g * toGrams(ing.quantity, ing.unit, ing.product_name)) / 100;
  });
  return total;
}

function getAvailableRecipes(
  userProducts: UserProduct[]
): Recipe[] {
  const userProductNames = new Set(userProducts.map(p => p.product.name));

  return recipesDatabase.filter(recipe => {
    const mainIngredients = getMainIngredients(recipe);
    const available = mainIngredients.filter(name => userProductNames.has(name));
    return available.length > 0;
  });
}

function scoreRecipe(
  recipe: Recipe,
  userProducts: UserProduct[],
  targetCalories: number,
  mealType: string,
  recentRecipeIds: string[],
  ingredientUsage: Map<string, number>
): number {
  let score = 0;
  const userProductNames = new Set(userProducts.map(p => p.product.name));

  if (recipe.meal_type === mealType) score += 30;

  const calDiff = Math.abs(getRecipeCalories(recipe) - targetCalories);
  score += Math.max(0, 30 - calDiff / 10);

  const mainIngredients = getMainIngredients(recipe);
  let availableCount = 0;
  let missingCount = 0;

  for (const name of mainIngredients) {
    if (userProductNames.has(name)) {
      availableCount++;
    } else {
      missingCount++;
    }
  }

  const availabilityRatio = availableCount / Math.max(mainIngredients.length, 1);
  score += availabilityRatio * 40;
  score -= missingCount * 8;

  const recentCount = recentRecipeIds.filter(id => id === recipe.id).length;
  score -= recentCount * 20;

  recipe.ingredients.forEach(ing => {
    const usage = ingredientUsage.get(ing.product_name) || 0;
    if (usage < 2) score += 2;
  });

  return score;
}

// Build a meal at FULL portion size (no capping by fridge stock), scaled toward
// the meal calorie target so the user gets a complete, filling portion. Missing
// ingredients are later filled via the shopping list.
function buildMeal(recipe: Recipe, targetCalories: number): Meal {
  // Compute base calories from actual product database values (not the
  // hardcoded recipe.calories) so the scale factor is accurate.
  const baseCalories = getRecipeCalories(recipe);

  // Scale to target but never exceed it — daily total stays ≤ dailyCalories.
  const factor = baseCalories > 0 ? Math.min(targetCalories / baseCalories, 1.0) : 1;

  const ingredientsUsed: { product_name: string; quantity: number; unit: string }[] = [];
  let actualProtein = 0;
  let actualFat = 0;
  let actualCarbs = 0;
  let actualCalories = 0;

  recipe.ingredients.forEach(ing => {
    const product = productsDatabase.find(p => p.name === ing.product_name);
    // Pantry-only names (Сіль, Спеції…) have no product nutrition entry
    if (!product) return;

    const neededGrams = toGrams(ing.quantity, ing.unit, ing.product_name) * factor;

    // Convert back to original unit for display
    let displayQty: number;
    if (ing.unit === 'шт') {
      const unitWeight = UNIT_WEIGHTS[ing.product_name] || 100;
      displayQty = Math.round(neededGrams / unitWeight);
      if (displayQty < 1 && neededGrams > 0) displayQty = 1;
    } else {
      displayQty = Math.round(neededGrams);
    }

    if (displayQty > 0) {
      ingredientsUsed.push({
        product_name: ing.product_name,
        quantity: displayQty,
        unit: ing.unit,
      });

      actualCalories += (product.calories_per_100g * neededGrams) / 100;
      actualProtein += (product.protein * neededGrams) / 100;
      actualFat += (product.fat * neededGrams) / 100;
      actualCarbs += (product.carbs * neededGrams) / 100;
    }
  });

  return {
    recipe,
    actual_calories: Math.round(actualCalories),
    actual_protein: Math.round(actualProtein),
    actual_fat: Math.round(actualFat),
    actual_carbs: Math.round(actualCarbs),
    ingredients_used: ingredientsUsed,
  };
}

// Convert a shortfall/leftover amount in grams back to a display-friendly
// quantity + unit for the product.
function gramsToDisplay(
  name: string,
  grams: number
): { quantity: number; unit: string } {
  const product = productsDatabase.find(p => p.name === name);
  const unit = product ? product.default_unit : 'г';

  let qty: number;
  if (unit === 'шт') {
    const uw = UNIT_WEIGHTS[name] || 100;
    qty = Math.max(1, Math.round(grams / uw));
  } else if (unit === 'кг') {
    qty = Math.round((grams / 1000) * 10) / 10;
  } else {
    qty = Math.round(grams);
  }
  return { quantity: qty, unit };
}

export function generateWeeklyMenu(state: GeneratorState): WeeklyMenu {
  const { products, dailyCalories, mealCount } = state;
  const mealDistribution = MEAL_TYPE_MAP[mealCount] || MEAL_TYPE_MAP[3];
  const availableRecipes = getAvailableRecipes(products);

  // Available stock in grams (fixed for the whole week)
  const availableGrams = new Map<string, number>();
  products.forEach(up => {
    availableGrams.set(up.product.name, toGrams(up.quantity, up.unit, up.product.name));
  });

  // Total needed grams per product across the whole week (full portions)
  const totalNeededGrams = new Map<string, number>();

  const weeklyMenu: DayMenu[] = [];
  const recentRecipeIds: string[] = [];
  const ingredientUsage = new Map<string, number>();

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayMeals: Meal[] = [];

    for (const mealType of mealDistribution) {
      const targetMealCalories = Math.round(dailyCalories * mealType.ratio);

      let scoredRecipes = availableRecipes
        .filter(r => r.meal_type === mealType.type)
        .map(r => ({
          recipe: r,
          score: scoreRecipe(r, products, targetMealCalories, mealType.type, recentRecipeIds, ingredientUsage),
        }))
        .sort((a, b) => b.score - a.score);

      if (scoredRecipes.length === 0) {
        scoredRecipes = availableRecipes
          .map(r => ({
            recipe: r,
            score: scoreRecipe(r, products, targetMealCalories, mealType.type, recentRecipeIds, ingredientUsage) - 15,
          }))
          .sort((a, b) => b.score - a.score);
      }

      if (scoredRecipes.length === 0) continue;

      const best = scoredRecipes[0];
      const meal = buildMeal(best.recipe, targetMealCalories);

      // Track total needed grams for the week
      meal.ingredients_used.forEach(ing => {
        const grams = toGrams(ing.quantity, ing.unit, ing.product_name);
        totalNeededGrams.set(ing.product_name, (totalNeededGrams.get(ing.product_name) || 0) + grams);
      });

      meal.ingredients_used.forEach(ing => {
        ingredientUsage.set(ing.product_name, (ingredientUsage.get(ing.product_name) || 0) + 1);
      });

      dayMeals.push(meal);
      recentRecipeIds.push(best.recipe.id);
    }

    weeklyMenu.push({
      day: DAYS[dayIndex],
      meals: dayMeals,
      total_calories: dayMeals.reduce((sum, m) => sum + m.actual_calories, 0),
      total_protein: Math.round(dayMeals.reduce((sum, m) => sum + m.actual_protein, 0)),
      total_fat: Math.round(dayMeals.reduce((sum, m) => sum + m.actual_fat, 0)),
      total_carbs: Math.round(dayMeals.reduce((sum, m) => sum + m.actual_carbs, 0)),
    });
  }

  // Shopping list = every ingredient needed for the week minus what's in stock,
  // so the swap covers the FULL required quantity of each product.
  const shopping = new Map<string, { quantity: number; unit: string }>();
  totalNeededGrams.forEach((needed, name) => {
    const avail = availableGrams.get(name) || 0;
    const shortfall = needed - avail;
    if (shortfall <= 0) return;
    const display = gramsToDisplay(name, shortfall);
    shopping.set(name, { quantity: display.quantity, unit: display.unit });
  });
  const shopping_list = Array.from(shopping.entries()).map(([name, data]) => ({
    product_name: name,
    quantity: data.quantity,
    unit: data.unit,
  }));

  // Leftovers from remaining stock
  const leftovers: { product_name: string; quantity: number; unit: string }[] = [];
  availableGrams.forEach((avail, name) => {
    const needed = totalNeededGrams.get(name) || 0;
    const leftGrams = avail - needed;
    if (leftGrams > 10) {
      const display = gramsToDisplay(name, leftGrams);
      if (display.quantity > 0) {
        leftovers.push({ product_name: name, quantity: display.quantity, unit: display.unit });
      }
    }
  });

  return { days: weeklyMenu, leftovers, shopping_list };
}

export function generateDemoMenu(): WeeklyMenu {
  const demoState: GeneratorState = {
    products: [
      { product: productsDatabase.find(p => p.id === 'chicken_breast')!, quantity: 1000, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'eggs')!, quantity: 10, unit: 'шт' },
      { product: productsDatabase.find(p => p.id === 'rice')!, quantity: 500, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'buckwheat')!, quantity: 400, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'tomato')!, quantity: 1000, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'cucumber')!, quantity: 500, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'cottage_cheese')!, quantity: 400, unit: 'г' },
      { product: productsDatabase.find(p => p.id === 'banana')!, quantity: 7, unit: 'шт' },
    ],
    dailyCalories: 2200,
    mealCount: 4,
  };
  return generateWeeklyMenu(demoState);
}
