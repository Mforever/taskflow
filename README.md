# TaskFlow — современный трекер задач

![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6)
![Node.js](https://img.shields.io/badge/Node.js-20-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248)

**Полнофункциональное приложение для управления задачами** с современным дизайном, темной темой, Drag & Drop, статистикой и экспортом данных.

## ✨ Возможности

- ✅ JWT авторизация с httpOnly cookies
- ✅ CRUD операции с задачами
- ✅ Drag & Drop сортировка
- ✅ Приоритеты (Высокий/Средний/Низкий)
- ✅ Дедлайны с календарем
- ✅ Фильтрация и поиск
- ✅ Статистика с графиками
- ✅ Экспорт в CSV/JSON/HTML
- ✅ Темная/Светлая тема
- ✅ Адаптивный мобильный дизайн

## 🛠 Технологии

**Frontend:** React 18, TypeScript, TailwindCSS, Vite, @dnd-kit, Recharts
**Backend:** Node.js, Express, MongoDB, JWT, Bcrypt

## 🚀 Деплой на ONREZA

1. Регистрация на [ONREZA](https://onreza.ru)
2. Создать проект → Из Git-репозитория
3. Подключить GitVerse/GitHub
4. **Настройки:**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Добавить переменную: `VITE_API_URL` = URL вашего API

## 📦 Локальный запуск

```bash
# Бэкенд
cd server
npm install
npm run dev

# Фронтенд (в новом терминале)
cd client
npm install
npm run dev
