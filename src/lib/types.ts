export type Unit = 'г' | 'кг' | 'шт' | 'мл';

export interface Product {
  id: string;
  name: string;
  calories_per_100g: number;
  protein: number;
  fat: number;
  carbs: number;
  default_unit: Unit;
}

export interface UserProduct {
  product: Product;
  quantity: number;
  unit: Unit;
}

export interface RecipeIngredient {
  product_name: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  name_de?: string;
  meal_type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: RecipeIngredient[];
  prep_time: number;
  instructions: string;
  instructions_de?: string;
  required_products: string[];
}

export interface Meal {
  recipe: Recipe;
  actual_calories: number;
  actual_protein: number;
  actual_fat: number;
  actual_carbs: number;
  ingredients_used: { product_name: string; quantity: number; unit: string }[];
}

export interface DayMenu {
  day: string;
  meals: Meal[];
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;
}

export interface WeeklyMenu {
  days: DayMenu[];
  leftovers: { product_name: string; quantity: number; unit: string }[];
  shopping_list: { product_name: string; quantity: number; unit: string }[];
}

export interface GeneratorState {
  products: UserProduct[];
  dailyCalories: number;
  mealCount: number;
}
