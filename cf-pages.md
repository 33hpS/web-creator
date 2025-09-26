# Инструкция по деплою на Cloudflare Pages

## Требования к имени проекта:
- Только строчные буквы (a-z), цифры (0-9) и дефисы (-)
- Не может начинаться или заканчиваться дефисом
- Длина: 1-58 символов
- Примеры допустимых имен: `webcreator`, `production-system`, `label-manager`

## Шаги для деплоя:

1. **Создайте GitHub репозиторий**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M production
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin production
   ```

2. **Настройка Cloudflare Pages:**
   - Войдите в Cloudflare Dashboard
   - Pages → Create a project → Connect to Git
   - Выберите ваш репозиторий
   - Настройки сборки:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Branch: `production`

3. **Нажмите "Save and Deploy"**

## Файлы конфигурации уже включены:
- `_redirects` - для SPA маршрутизации
- `public/_routes.json` - правила маршрутизации Cloudflare
- Настроенный `scripts/build.mjs` для сборки

## После деплоя:
Приложение будет доступно по адресу: `https://your-project-name.pages.dev`
