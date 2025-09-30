# 🏭 Web Creator - Production Management System

Система управления производством с возможностями отслеживания производственных единиц, печати этикеток и управления пользователями.

## ✨ Основные возможности

- 🔐 **Аутентификация с ролевой моделью** (Admin, Manager, Worker)
- 📦 **Управление производством** - отслеживание партий и единиц продукции
- 🏷️ **Система маркировки** - создание и печать стартовых и финальных этикеток
- 📊 **Отчетность** - аналитика производства и статистика
- 👥 **Управление пользователями** - администрирование доступа
- 🖨️ **Интеграция с принтерами** - печать этикеток через Print Agent
- 📱 **Адаптивный дизайн** - работа на всех устройствах
- 🖨️ **Печать отчетов** - оптимизированные стили для печати

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонирование репозитория
git clone https://github.com/33hpS/web-creator.git
cd web-creator

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Приложение будет доступно по адресу http://localhost:3000
```

### Тестовые учетные записи

- **Администратор**: `admin` / `admin123`
- **Менеджер**: `manager` / `manager123` 
- **Работник**: `worker` / `worker123`

## 🏗️ Сборка и деплой

### Локальная сборка

```bash
# Производственная сборка
npm run build

# Предварительный просмотр сборки
npm run preview
```

### Деплой на Cloudflare Pages

1. **Подготовка репозитория:**
   ```bash
   git add .
   git commit -m "feat: ready for Cloudflare Pages deploy"
   git push origin main
   ```

2. **Настройка Cloudflare Pages:**
   - Откройте [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages → Create a project → Connect to Git
   - Выберите репозиторий `web-creator`
   - **Build command**: `node scripts/build.mjs --production`
   - **Build output directory**: `dist`
   - **Production branch**: `main`

3. **Переменные окружения:**
   ```
   NODE_ENV=production
   VITE_APP_NAME=Web Creator
   VITE_APP_VERSION=1.0.0
   ```

4. **Deploy!** 🚀

Подробная инструкция: [cf-pages.md](./cf-pages.md)

## 🛠️ Технологический стек

- **Frontend**: React 18 + TypeScript
- **Сборка**: Custom esbuild + Tailwind CSS
- **UI Framework**: shadcn/ui + Radix UI
- **Маршрутизация**: React Router v7
- **Стили**: Tailwind CSS
- **Иконки**: Lucide React
- **Деплой**: Cloudflare Pages
- **Хранение данных**: localStorage (demo режим)

## 📁 Структура проекта

```
web-creator/
├── public/                 # Статические файлы
├── scripts/               # Скрипты сборки
├── src/
│   ├── components/        # React компоненты
│   │   ├── ui/           # UI компоненты (shadcn/ui)
│   │   ├── dashboard/    # Компоненты панели управления
│   │   └── print/        # Компоненты печати
│   ├── contexts/         # React контексты
│   ├── hooks/           # Пользовательские хуки
│   ├── pages/           # Страницы приложения
│   ├── services/        # Сервисы для работы с данными
│   ├── styles/          # CSS стили
│   └── types/           # TypeScript типы
├── _redirects           # Конфигурация SPA маршрутизации
├── wrangler.toml        # Конфигурация Cloudflare
└── tailwind.config.js   # Конфигурация Tailwind CSS
```

---

**🎉 Готов к деплою на Cloudflare Pages!** Смотрите [cf-pages.md](./cf-pages.md) и [deploy-checklist.md](./deploy-checklist.md) для подробных инструкций.
