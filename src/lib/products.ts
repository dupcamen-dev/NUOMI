import { Product } from './types';

export const productsDatabase: Product[] = [
  // М'ясо та птиця
  { id: 'chicken_breast', name: 'Куряче філе', calories_per_100g: 113, protein: 23.6, fat: 1.9, carbs: 0, default_unit: 'г' },
  { id: 'chicken_thigh', name: 'Куряче стегно', calories_per_100g: 185, protein: 19.5, fat: 11, carbs: 0, default_unit: 'г' },
  { id: 'chicken_whole', name: 'Курка ціла', calories_per_100g: 165, protein: 19, fat: 9.5, carbs: 0, default_unit: 'г' },
  { id: 'turkey', name: 'Індичка', calories_per_100g: 104, protein: 21.6, fat: 1.6, carbs: 0, default_unit: 'г' },
  { id: 'pork_tenderloin', name: 'Свиняча вирізка', calories_per_100g: 143, protein: 21, fat: 6.5, carbs: 0, default_unit: 'г' },

  // Риба та морепродукти
  { id: 'salmon', name: 'Лосось', calories_per_100g: 208, protein: 20, fat: 13, carbs: 0, default_unit: 'г' },
  { id: 'tuna', name: 'Тунець', calories_per_100g: 130, protein: 29, fat: 1, carbs: 0, default_unit: 'г' },
  { id: 'cod', name: 'Треска', calories_per_100g: 82, protein: 17.8, fat: 0.7, carbs: 0, default_unit: 'г' },
  { id: 'shrimp', name: 'Креветки', calories_per_100g: 95, protein: 18.9, fat: 2.2, carbs: 0, default_unit: 'г' },

  // Молочні продукти
  { id: 'milk', name: 'Молоко', calories_per_100g: 42, protein: 2.8, fat: 1, carbs: 4.8, default_unit: 'мл' },
  { id: 'kefir', name: 'Кефір', calories_per_100g: 40, protein: 3, fat: 1, carbs: 4, default_unit: 'мл' },
  { id: 'cottage_cheese', name: 'Сир (творог)', calories_per_100g: 121, protein: 18, fat: 5, carbs: 1.8, default_unit: 'г' },
  { id: 'hard_cheese', name: 'Твердий сир', calories_per_100g: 350, protein: 26, fat: 27, carbs: 0, default_unit: 'г' },
  { id: 'cream_cheese', name: 'Сир кремовий', calories_per_100g: 342, protein: 6, fat: 34, carbs: 4, default_unit: 'г' },
  { id: 'yogurt', name: 'Йогурт', calories_per_100g: 59, protein: 3.5, fat: 1.5, carbs: 6.5, default_unit: 'г' },
  { id: 'butter', name: 'Масло вершкове', calories_per_100g: 717, protein: 0.9, fat: 81, carbs: 0.1, default_unit: 'г' },
  { id: 'sour_cream', name: 'Сметана', calories_per_100g: 193, protein: 2.6, fat: 19, carbs: 3, default_unit: 'г' },

  // Яйця
  { id: 'eggs', name: 'Яйця', calories_per_100g: 155, protein: 12.6, fat: 10.6, carbs: 1.1, default_unit: 'шт' },

  // Крупи та зернові
  { id: 'rice', name: 'Рис', calories_per_100g: 130, protein: 2.7, fat: 0.3, carbs: 28.2, default_unit: 'г' },
  { id: 'buckwheat', name: 'Гречка', calories_per_100g: 132, protein: 4.5, fat: 1.3, carbs: 25, default_unit: 'г' },
  { id: 'oatmeal', name: 'Вівсянка', calories_per_100g: 88, protein: 3, fat: 1.7, carbs: 15, default_unit: 'г' },
  { id: 'pasta', name: 'Макарони', calories_per_100g: 131, protein: 5, fat: 0.6, carbs: 27, default_unit: 'г' },
  { id: 'quinoa', name: 'Кіноа', calories_per_100g: 120, protein: 4.4, fat: 1.9, carbs: 21.3, default_unit: 'г' },
  { id: 'bulgur', name: 'Булгур', calories_per_100g: 83, protein: 3, fat: 0.2, carbs: 18.6, default_unit: 'г' },
  { id: 'couscous', name: 'Кускус', calories_per_100g: 112, protein: 3.8, fat: 0.2, carbs: 23.2, default_unit: 'г' },
  { id: 'millet', name: 'Пшоно', calories_per_100g: 119, protein: 3.5, fat: 1, carbs: 23, default_unit: 'г' },

  // Бобові
  { id: 'lentils', name: 'Чечевиця', calories_per_100g: 116, protein: 9, fat: 0.4, carbs: 20, default_unit: 'г' },
  { id: 'chickpeas', name: 'Нут', calories_per_100g: 164, protein: 8.9, fat: 2.6, carbs: 27.4, default_unit: 'г' },
  { id: 'beans', name: 'Квасоля', calories_per_100g: 127, protein: 8.7, fat: 0.5, carbs: 22.8, default_unit: 'г' },

  // Овочі
  { id: 'potato', name: 'Картопля', calories_per_100g: 77, protein: 2, fat: 0.1, carbs: 17, default_unit: 'г' },
  { id: 'sweet_potato', name: 'Батат', calories_per_100g: 86, protein: 1.6, fat: 0.1, carbs: 20, default_unit: 'г' },
  { id: 'tomato', name: 'Помідори', calories_per_100g: 18, protein: 0.9, fat: 0.2, carbs: 3.9, default_unit: 'г' },
  { id: 'cucumber', name: 'Огірки', calories_per_100g: 15, protein: 0.7, fat: 0.1, carbs: 3.6, default_unit: 'г' },
  { id: 'carrot', name: 'Морква', calories_per_100g: 41, protein: 0.9, fat: 0.2, carbs: 9.6, default_unit: 'г' },
  { id: 'onion', name: 'Цибуля', calories_per_100g: 40, protein: 1.1, fat: 0.1, carbs: 9.3, default_unit: 'г' },
  { id: 'garlic', name: 'Часник', calories_per_100g: 149, protein: 6.4, fat: 0.5, carbs: 33, default_unit: 'г' },
  { id: 'broccoli', name: 'Броколі', calories_per_100g: 34, protein: 2.8, fat: 0.4, carbs: 7, default_unit: 'г' },
  { id: 'cauliflower', name: 'Цвітна капуста', calories_per_100g: 25, protein: 1.9, fat: 0.3, carbs: 5, default_unit: 'г' },
  { id: 'cabbage', name: 'Капуста', calories_per_100g: 25, protein: 1.3, fat: 0.1, carbs: 5.8, default_unit: 'г' },
  { id: 'bell_pepper', name: 'Болгарський перець', calories_per_100g: 27, protein: 1, fat: 0.2, carbs: 5.3, default_unit: 'г' },
  { id: 'zucchini', name: 'Кабачок', calories_per_100g: 17, protein: 1.2, fat: 0.3, carbs: 3.1, default_unit: 'г' },
  { id: 'eggplant', name: 'Баклажан', calories_per_100g: 25, protein: 1, fat: 0.2, carbs: 6, default_unit: 'г' },
  { id: 'spinach', name: 'Шпинат', calories_per_100g: 23, protein: 2.9, fat: 0.4, carbs: 3.6, default_unit: 'г' },
  { id: 'lettuce', name: 'Салат (листи)', calories_per_100g: 15, protein: 1.4, fat: 0.2, carbs: 2.9, default_unit: 'г' },
  { id: 'corn', name: 'Кукурудза', calories_per_100g: 86, protein: 3.2, fat: 1.2, carbs: 19, default_unit: 'г' },
  { id: 'peas', name: 'Горошок', calories_per_100g: 81, protein: 5.4, fat: 0.4, carbs: 14.5, default_unit: 'г' },

  // Фрукти
  { id: 'banana', name: 'Банани', calories_per_100g: 89, protein: 1.1, fat: 0.3, carbs: 23, default_unit: 'шт' },
  { id: 'apple', name: 'Яблуко', calories_per_100g: 52, protein: 0.3, fat: 0.2, carbs: 14, default_unit: 'шт' },
  { id: 'orange', name: 'Апельсин', calories_per_100g: 47, protein: 0.9, fat: 0.1, carbs: 12, default_unit: 'шт' },
  { id: 'avocado', name: 'Авокадо', calories_per_100g: 160, protein: 2, fat: 15, carbs: 9, default_unit: 'шт' },
  { id: 'grapes', name: 'Виноград', calories_per_100g: 69, protein: 0.7, fat: 0.2, carbs: 18, default_unit: 'г' },
  { id: 'strawberry', name: 'Полуниця', calories_per_100g: 32, protein: 0.7, fat: 0.3, carbs: 7.7, default_unit: 'г' },
  { id: 'blueberry', name: 'Чорниця', calories_per_100g: 57, protein: 0.7, fat: 0.3, carbs: 14.5, default_unit: 'г' },
  { id: 'kiwi', name: 'Ківі', calories_per_100g: 61, protein: 1.1, fat: 0.5, carbs: 15, default_unit: 'шт' },

  // Горіхи та насіння
  { id: 'almonds', name: 'Миндаль', calories_per_100g: 579, protein: 21, fat: 50, carbs: 22, default_unit: 'г' },
  { id: 'walnuts', name: 'Горіхи волоські', calories_per_100g: 654, protein: 15, fat: 65, carbs: 14, default_unit: 'г' },
  { id: 'peanuts', name: 'Арахіс', calories_per_100g: 567, protein: 26, fat: 49, carbs: 16, default_unit: 'г' },
  { id: 'sunflower_seeds', name: 'Насіння соняшника', calories_per_100g: 584, protein: 21, fat: 51, carbs: 20, default_unit: 'г' },
  { id: 'chia_seeds', name: 'Насіння чіа', calories_per_100g: 486, protein: 17, fat: 31, carbs: 42, default_unit: 'г' },
  { id: 'flaxseeds', name: 'Насіння льону', calories_per_100g: 534, protein: 18, fat: 42, carbs: 29, default_unit: 'г' },
  { id: 'hemp_seeds', name: 'Насіння конопель', calories_per_100g: 553, protein: 32, fat: 49, carbs: 9, default_unit: 'г' },

  // Хліб та випічка
  { id: 'bread_white', name: 'Хліб білий', calories_per_100g: 265, protein: 9, fat: 3.2, carbs: 49, default_unit: 'г' },
  { id: 'bread_whole', name: 'Хліб цільнозерновий', calories_per_100g: 247, protein: 10, fat: 3.5, carbs: 43, default_unit: 'г' },
  { id: 'tortilla', name: 'Лаваш', calories_per_100g: 236, protein: 7.9, fat: 1.5, carbs: 48, default_unit: 'г' },
  { id: 'oat_bread', name: 'Хліб вівсяний', calories_per_100g: 210, protein: 8, fat: 2.5, carbs: 40, default_unit: 'г' },

  // Готові продукти та соуси
  { id: 'olive_oil', name: 'Оливкова олія', calories_per_100g: 884, protein: 0, fat: 100, carbs: 0, default_unit: 'мл' },
  { id: 'sunflower_oil', name: 'Соняшникова олія', calories_per_100g: 884, protein: 0, fat: 100, carbs: 0, default_unit: 'мл' },
  { id: 'soy_sauce', name: 'Соєвий соус', calories_per_100g: 53, protein: 5.5, fat: 0.1, carbs: 4.9, default_unit: 'мл' },
  { id: 'honey', name: 'Мед', calories_per_100g: 304, protein: 0.3, fat: 0, carbs: 82, default_unit: 'г' },
  { id: 'sugar', name: 'Цукор', calories_per_100g: 387, protein: 0, fat: 0, carbs: 100, default_unit: 'г' },
  { id: 'peanut_butter', name: 'Арахісова паста', calories_per_100g: 588, protein: 25, fat: 50, carbs: 20, default_unit: 'г' },

  // Напої
  { id: 'juice_orange', name: 'Сік апельсиновий', calories_per_100g: 45, protein: 0.7, fat: 0.2, carbs: 10.4, default_unit: 'мл' },
  { id: 'green_tea', name: 'Зелений чай', calories_per_100g: 1, protein: 0, fat: 0, carbs: 0, default_unit: 'мл' },
  { id: 'coffee', name: 'Кава', calories_per_100g: 2, protein: 0.1, fat: 0, carbs: 0, default_unit: 'мл' },

  // Заморожені
  { id: 'frozen_vegetables', name: 'Заморожені овочі', calories_per_100g: 65, protein: 2.5, fat: 0.5, carbs: 13, default_unit: 'г' },
  { id: 'frozen_berries', name: 'Заморожені ягоди', calories_per_100g: 45, protein: 0.8, fat: 0.4, carbs: 11, default_unit: 'г' },
];

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return productsDatabase.filter(p =>
    p.name.toLowerCase().includes(lower)
  ).slice(0, 8);
}
