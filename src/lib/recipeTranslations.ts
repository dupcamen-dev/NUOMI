import { Locale } from './translations';

// German names for recipes keyed by recipe id.
export const RECIPE_NAMES: Record<string, Record<Locale, string>> = {
  omelet_veggies: { uk: 'Омлет з овочами', de: 'Gemüse-Omelett' },
  oatmeal_banana: { uk: 'Вівсянка з бананом', de: 'Haferbrei mit Banane' },
  scrambled_eggs: { uk: 'Яйця-млинці', de: 'Rührei-Pfannkuchen' },
  cottage_cheese_bowl: { uk: 'Боул з сиром та ягодами', de: 'Quark-Bowl mit Beeren' },
  avocado_toast: { uk: 'Тост з авокадо та яйцем', de: 'Avocado-Toast mit Ei' },
  yogurt_oats: { uk: 'Йогурт з вівсянкою та мигдалем', de: 'Joghurt mit Haferflocken und Mandeln' },
  pancakes: { uk: 'Млинці з сиром', de: 'Pfannkuchen mit Quark' },
  chicken_rice_veggies: { uk: 'Курка з рисом та овочами', de: 'Hähnchen mit Reis und Gemüse' },
  buckwheat_chicken: { uk: 'Гречка з куркою та овочами', de: 'Buchweizen mit Hähnchen und Gemüse' },
  pasta_turkey: { uk: 'Паста з індичкою та помідорами', de: 'Pasta mit Pute und Tomaten' },
  salmon_quinoa: { uk: 'Лосось з кіноа та шпинатом', de: 'Lachs mit Quinoa und Spinat' },
  lentil_soup: { uk: 'Суп з чечевицею', de: 'Linsensuppe' },
  tuna_salad: { uk: 'Салат з тунцем', de: 'Thunfischsalat' },
  chickpea_bowl: { uk: 'Боул з нутом та овочами', de: 'Kichererbsen-Bowl mit Gemüse' },
  cottage_cheese_fruit: { uk: 'Сир з фруктами', de: 'Quark mit Früchten' },
  apple_peanut_butter: { uk: 'Яблуко з арахісової пастою', de: 'Apfel mit Erdnussbutter' },
  yogurt_nuts: { uk: 'Йогурт з мигдалем', de: 'Joghurt mit Mandeln' },
  banana_smoothie: { uk: 'Смузі з бананом та молоком', de: 'Bananen-Smoothie mit Milch' },
  cheese_crackers: { uk: 'Сир з крекерами', de: 'Käse mit Crackern' },
  hummus_veggies: { uk: 'Хумус з овочами', de: 'Hummus mit Gemüse' },
  berries_yogurt: { uk: 'Йогурт з ягодами', de: 'Joghurt mit Beeren' },
  chicken_veggies_dinner: { uk: 'Курка з овочами на грилі', de: 'Hähnchen mit Gemüse vom Grill' },
  buckwheat_dinner: { uk: 'Гречка з овочами', de: 'Buchweizen mit Gemüse' },
  fish_stew: { uk: 'Тушкована риба з овочами', de: 'Geschmorter Fisch mit Gemüse' },
  omelet_dinner: { uk: 'Овочевий омлет з сиром', de: 'Gemüse-Omelett mit Käse' },
  sweet_potato_chicken: { uk: 'Батат з куркою', de: 'Süßkartoffel mit Hähnchen' },
  egg_salad_dinner: { uk: 'Білковий салат з овочами', de: 'Proteinsalat mit Gemüse' },
  simple_omelet: { uk: 'Простий омлет', de: 'Einfaches Omelett' },
  omelet_cheese: { uk: 'Омлет з сиром', de: 'Omelett mit Käse' },
  omelet_pepper: { uk: 'Омлет з перцем', de: 'Omelett mit Paprika' },
  scrambled_eggs_cheese: { uk: 'Яйця смажені з сиром', de: 'Spiegeleier mit Käse' },
  rice_breakfast: { uk: 'Рисова каша з сиром', de: 'Reisbrei mit Quark' },
  buckwheat_simple: { uk: 'Гречка як гарнір', de: 'Buchweizen als Beilage' },
  buckwheat_cheese: { uk: 'Гречка з сиром', de: 'Buchweizen mit Käse' },
  buckwheat_veggies: { uk: 'Гречка з овочами', de: 'Buchweizen mit Gemüse' },
  pasta_cheese: { uk: 'Паста з сиром', de: 'Pasta mit Käse' },
  pasta_pepper: { uk: 'Паста з перцем', de: 'Pasta mit Paprika' },
  pasta_cheese_pepper: { uk: 'Паста з сиром та перцем', de: 'Pasta mit Käse und Paprika' },
  rice_veggies: { uk: 'Рис з овочами', de: 'Reis mit Gemüse' },
  rice_cheese: { uk: 'Рис з сиром', de: 'Reis mit Käse' },
  egg_rice: { uk: 'Рис з яйцем', de: 'Reis mit Ei' },
  egg_buckwheat: { uk: 'Гречка з яйцем', de: 'Buchweizen mit Ei' },
  cheese_plate: { uk: 'Сирна тарілка', de: 'Käseplatte' },
  egg_snack: { uk: 'Варене яйце', de: 'Gekochtes Ei' },
  carrot_snack: { uk: 'Морква з сиром', de: 'Karotte mit Käse' },
  omelet_dinner_simple: { uk: 'Овочевий омлет', de: 'Gemüse-Omelett' },
  egg_pepper_dinner: { uk: 'Яйця з перцем та сиром', de: 'Eier mit Paprika und Käse' },
  pasta_egg_dinner: { uk: 'Паста з яйцем', de: 'Pasta mit Ei' },
  buckwheat_egg_dinner: { uk: 'Гречка з яйцем та овочами', de: 'Buchweizen mit Ei und Gemüse' },
  rice_cheese_dinner: { uk: 'Рис з сиром та овочами', de: 'Reis mit Käse und Gemüse' },
  pasta_veggie_dinner: { uk: 'Паста з овочами', de: 'Pasta mit Gemüse' },
  egg_veggie_dinner: { uk: 'Яйця з овочами як гарнір', de: 'Eier mit Gemüse als Beilage' },
  buckwheat_pasta_mix: { uk: 'Гречка з макаронами', de: 'Buchweizen mit Nudeln' },
};

export function recipeName(id: string, locale: Locale, fallback: string): string {
  return RECIPE_NAMES[id]?.[locale] || fallback;
}

// Maps the Ukrainian full day name (as stored in menu data) to a locale name.
const DAY_NAMES: Record<Locale, Record<string, string>> = {
  uk: {
    'Понеділок': 'Понеділок',
    'Вівторок': 'Вівторок',
    'Середа': 'Середа',
    'Четвер': 'Четвер',
    "П'ятниця": "П'ятниця",
    'Субота': 'Субота',
    'Неділя': 'Неділя',
  },
  de: {
    'Понеділок': 'Montag',
    'Вівторок': 'Dienstag',
    'Середа': 'Mittwoch',
    'Четвер': 'Donnerstag',
    "П'ятниця": 'Freitag',
    'Субота': 'Samstag',
    'Неділя': 'Sonntag',
  },
};

export function dayName(day: string, locale: Locale): string {
  return DAY_NAMES[locale][day] || day;
}