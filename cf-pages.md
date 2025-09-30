# 🚀 Инструкция по деплою на Cloudflare Pages

## 📋 Требования к имени проекта:
- Только строчные буквы (a-z), цифры (0-9) и дефисы (-)
- Не может начинаться или заканчиваться дефисом
- Длина: 1-58 символов
- Примеры допустимых имен: `webcreator`, `web-creator-prod`, `supim-system`

## 🔧 Шаги для деплоя:

### 1. **Подготовка репозитория GitHub**
```bash
# Инициализация Git (если не сделано)
git init
git add .
git commit -m "feat: initial commit for Cloudflare Pages"

# Создание основной ветки
git branch -M main
git remote add origin https://github.com/33hpS/web-creator.git
git push -u origin main
```

### 2. **Настройка Cloudflare Pages:**
1. Войдите в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Pages** → **Create a project** → **Connect to Git**
3. Выберите ваш GitHub репозиторий `web-creator`
4. **Настройки сборки:**
   - **Project name**: `web-creator` (уже существует)
   - **Production branch**: `main`
   - **Build command**: `node scripts/build.mjs --production`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (оставить пустым)

### 3. **Переменные окружения (Environment Variables):**
```
NODE_ENV=production
VITE_APP_NAME=Web Creator
VITE_APP_VERSION=1.0.0
```

### 4. **Нажмите "Save and Deploy"** 🚀

## 📁 Файлы конфигурации (уже включены):
- ✅ `_redirects` - для SPA маршрутизации
- ✅ `public/_routes.json` - правила маршрутизации Cloudflare
- ✅ `scripts/build.mjs` - кастомная сборка с esbuild
- ✅ `wrangler.toml` - конфигурация Cloudflare

## 🌐 После успешного деплоя:
- **Production URL**: `https://web-creator.pages.dev`
- **Preview URL**: автоматически для каждого PR
- **Custom Domain**: можно подключить свой домен в настройках

## ⚡ Оптимизация производительности:
- Автоматическое сжатие статических файлов
- CDN распределение по всему миру
- Кэширование на уровне Edge
- Поддержка HTTP/3 и Brotli сжатие

## 🔍 Мониторинг и отладка:
- **Analytics**: доступна в разделе Pages
- **Function logs**: для отладки
- **Real User Monitoring**: опционально

## 🆘 Возможные проблемы:
1. **Ошибка сборки**: проверьте `node scripts/build.mjs` локально
2. **404 на маршрутах**: убедитесь что `_redirects` в корне `dist/`
3. **Медленная загрузка**: включите минификацию в production режиме
