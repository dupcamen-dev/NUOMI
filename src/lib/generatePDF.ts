import { WeeklyMenu, UserProduct } from './types';

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  snack: 'Перекус',
  dinner: 'Вечеря',
};

function buildMenuHTML(menu: WeeklyMenu, dailyCalories: number, userProducts: UserProduct[]): string {
  const avgCalories = Math.round(menu.days.reduce((s, d) => s + d.total_calories, 0) / 7);

  let html = `
    <div style="font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; padding: 40px; color: #171717; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">Nouri — Твоє меню</h1>
      <p style="text-align: center; font-size: 14px; color: #737373; margin: 0 0 30px 0;">7 днів · ~${dailyCalories} kcal / день · середня: ${avgCalories} kcal</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 24px 0;">
  `;

  html += `<h2 style="font-size: 16px; margin: 0 0 12px 0;">Твої продукти</h2>`;
  html += `<div style="margin-bottom: 24px; font-size: 13px; color: #555;">`;
  userProducts.forEach(p => {
    html += `<span style="display: inline-block; background: #f5f5f5; border-radius: 6px; padding: 4px 10px; margin: 0 6px 6px 0;">${p.product.name} — ${p.quantity} ${p.unit}</span>`;
  });
  html += `</div>`;

  menu.days.forEach(day => {
    html += `
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0 16px 0;">
      <h2 style="font-size: 16px; margin: 0 0 12px 0; font-weight: 700;">${day.day}</h2>
    `;
    day.meals.forEach(meal => {
      const label = MEAL_TYPE_LABELS[meal.recipe.meal_type] || meal.recipe.meal_type;
      html += `
        <div style="margin-bottom: 14px; padding: 12px 14px; background: #fafafa; border-radius: 10px; border: 1px solid #e5e5e5;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #737373;">${label}</span>
            <span style="font-size: 13px; font-weight: 600;">${meal.actual_calories} kcal</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${meal.recipe.name}</div>
          <div style="font-size: 11px; color: #737373;">
            ${meal.ingredients_used.map(i => `${i.product_name} ${i.quantity}${i.unit}`).join(' · ')}
          </div>
          <div style="font-size: 11px; color: #999; margin-top: 4px;">
            Білок ${meal.actual_protein}г · Жири ${meal.actual_fat}г · Вуглеводи ${meal.actual_carbs}г
          </div>
        </div>
      `;
    });
    html += `
      <div style="text-align: right; font-size: 12px; font-weight: 600; color: #737373; margin-top: 8px;">
        Разом: ${day.total_calories} kcal · Білок ${day.total_protein}г · Жири ${day.total_fat}г · Вуглеводи ${day.total_carbs}г
      </div>
    `;
  });

  if (menu.shopping_list.length > 0) {
    html += `
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0 16px 0;">
      <h2 style="font-size: 16px; margin: 0 0 12px 0;">Що докупити</h2>
    `;
    menu.shopping_list.forEach(item => {
      html += `
        <div style="display: flex; justify-content: space-between; padding: 6px 12px; background: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; margin-bottom: 6px; font-size: 13px;">
          <span>${item.product_name}</span>
          <span style="color: #92400e;">${item.quantity} ${item.unit}</span>
        </div>
      `;
    });
  }

  html += `
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0 16px 0;">
    <p style="text-align: center; font-size: 10px; color: #aaa; font-style: italic;">
      Харчова цінність є приблизною і залежить від конкретних продуктів та способу приготування.
    </p>
  </div>`;

  return html;
}

export async function downloadMenuPDF(
  menu: WeeklyMenu,
  dailyCalories: number,
  userProducts: UserProduct[]
) {
  const html2pdf = (await import('html2pdf.js')).default;

  const html = buildMenuHTML(menu, dailyCalories, userProducts);
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  await html2pdf()
    .set({
      margin: 10,
      filename: 'nouri-menu.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    })
    .from(container)
    .save();

  document.body.removeChild(container);
}
