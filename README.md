# TaskFlow — современный трекер задач

![Версия](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6)
![Node.js](https://img.shields.io/badge/Node.js-20-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248)
![Лицензия](https://img.shields.io/badge/license-MIT-green)

**Полнофункциональное приложение для управления задачами** с современным дизайном, темной темой, Drag & Drop, статистикой и экспортом данных. Полностью адаптировано для мобильных устройств.

## 🚀 Деплой

Проект успешно развернут на российских серверах для стабильной работы:

- **Frontend:** [ONREZA](https://onreza.ru) — российский аналог Vercel
- **Backend:** [Jino VPS](https://jino.ru) или другой хостинг в РФ
- **База данных:** MongoDB Atlas или локальный сервер

## ✨ Возможности

- ✅ **JWT авторизация** с httpOnly cookies
- ✅ **CRUD операции** с задачами
- ✅ **Drag & Drop** перетаскивание для сортировки
- ✅ **Приоритеты** (Высокий / Средний / Низкий) с цветовой индикацией
- ✅ **Дедлайны** с выбором даты
- ✅ **Фильтрация** задач (Все / Активные / Выполненные)
- ✅ **Поиск** по названию задачи
- ✅ **Статистика** с интерактивными графиками (Recharts)
- ✅ **Экспорт данных** в 3 форматах: CSV, JSON, HTML-отчёт
- ✅ **Тёмная / Светлая тема** (сохраняется в localStorage)
- ✅ **Адаптивный дизайн** — удобно на телефоне, планшете и ПК
- ✅ **Анимации** и плавные переходы
- ✅ **Умные подсказки** по продуктивности

## 🛠 Технологии

**Frontend:**
- React 18 + TypeScript
- TailwindCSS
- React Router v6
- React Hook Form + Zod
- @dnd-kit (Drag & Drop)
- Recharts (Графики)
- Lucide React (Иконки)
- Sonner (Уведомления)
- Vite

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcryptjs
- Express Validator

## 📦 Локальный запуск

### Требования
- Node.js 18+
- MongoDB (локально или MongoDB Atlas)

### Установка

```bash
# Клонирование репозитория
git clone https://gitverse.ru/Mforever/taskflow.git
cd taskflow

# Бэкенд
cd server
npm install
cp .env.example .env  # настройте переменные
npm run dev

# Фронтенд (в новом терминале)
cd ../client
npm install
cp .env.example .env  # настройте переменные
npm run dev
