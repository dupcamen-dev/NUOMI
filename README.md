This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Адмін-панель (/admin)

Вхід за паролем (з `env`: `ADMIN_PASSWORD`, за замовчуванням `nouri2026`).
Дашборд показує: активні відвідувачі зараз (heartbeat 15 хв), всього переглядів,
унікальні відвідувачі та розбивка по сторінках. Оновлюється кожні 30 секунд.

## Налаштування бази даних Postgres (Neon, виробнича статистика)

Без бази даних сервіс працює у **memory fallback** (одна інстанція — підходить
тільки для локального тесту). Для реальної крос-пристрійної статистики потрібен
**PostgreSQL**. Необхідні таблиці створюються автоматично при першому використанні.

### 1. Підключити базу у Vercel
1. У [vercel.com](https://vercel.com) відкрий свій проєкт Nouri.
2. **Storage → Connect Database → Neon → Create/Connect.**
3. Vercel автоматично додасть у env-змінні проєкту, зокрема `DATABASE_URL` (pooled).
4. Потрібно **Re-deploy** (або Vercel запропонує сам), щоб проєкт отримав змінні.

### 2. Задати пароль і секрет адміна
1. У проєкті: **Settings → Environment Variables**.
2. Додай (Production **і** Preview):
   - `ADMIN_PASSWORD` = пароль для `/admin`
   - `ADMIN_SECRET` = будь-який довгий випадковий рядок (для підпису cookie)
3. **Re-deploy** після зміни змінних середовища.
4. `/admin` тепер показує реальну статистику (таблиці створюються автоматично).

### Локальний тест
1. Скопіюй `DATABASE_URL` (pooled) у `.env.local` (або встанови як змінну середовища).
2. `npm run dev` → відкрий `/admin`, увійди, перевір статистику.

### Перевірка, яке сховище використовується
На дашборді `/admin` у шапці показано бейдж: `postgres` або `memory`.

## Змінні середовища

| Змінна | Опис |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (pooled, Neon) |
| `ADMIN_PASSWORD` | Пароль /admin (default `nouri2026`) |
| `ADMIN_SECRET` | Секрет для підпису сесійного cookie адміна |



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
