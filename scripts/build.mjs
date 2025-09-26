/**
 * Build script for Web Creator using esbuild + Tailwind.
 * Produces a production-ready bundle in /dist for Cloudflare Pages.
 * - Bundles JS from src/main.tsx (fallbacks: main.jsx/main.ts/main.js)
 * - Builds CSS via Tailwind CLI if src/index.css exists
 * - Generates dist/index.html with #app root node
 * - Copies ./public into dist
 * - Ensures SPA redirects via dist/_redirects
 *
 * Usage:
 *   node scripts/build.mjs
 *   node scripts/build.mjs --production
 */

import { build } from 'esbuild'
import { existsSync, mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

/** Absolute path to current file */
const __filename = fileURLToPath(import.meta.url)
/** Absolute path to current directory */
const __dirname = path.dirname(__filename)

/** Absolute path to project root directory */
const ROOT = path.resolve(__dirname, '..')
/** Absolute path to output directory */
const OUT_DIR = path.resolve(ROOT, 'dist')
/** Absolute path to assets directory in output */
const ASSETS_DIR = path.join(OUT_DIR, 'assets')

/** Is production build */
const isProd = process.argv.includes('--production') || process.env.NODE_ENV === 'production'

/**
 * Ensure a directory exists (mkdir -p).
 * @param {string} p Absolute or relative path
 */
function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true })
}

/**
 * Execute a shell command in project root and inherit stdio.
 * Throws on non-zero exit.
 * @param {string} cmd Command line string
 */
function sh(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT })
}

/**
 * Try to locate a valid entry point from a list of candidates.
 * @param {string[]} candidates Relative paths to check
 * @returns {string | null} Absolute path or null
 */
function findEntry(candidates) {
  for (const rel of candidates) {
    const abs = path.resolve(ROOT, rel)
    if (existsSync(abs)) return abs
  }
  return null
}

/**
 * Create a minimal index.html in dist that loads compiled JS and CSS.
 * @param {Object} opts Options
 * @param {boolean} opts.hasCss Whether CSS exists (link tag will be added)
 * @param {boolean} opts.hasFavicon Whether favicon exists in public/
 */
function writeIndexHtml({ hasCss, hasFavicon }) {
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Creator - Production Management System</title>
  ${hasCss ? '<link rel="stylesheet" href="./assets/index.css">' : ''}
  ${hasFavicon ? '<link rel="icon" href="./favicon.ico">' : ''}
</head>
<body>
  <!-- Root node must match the app mounting id used in source -->
  <div id="app"></div>
  <script type="module" src="./assets/index.js"></script>
</body>
</html>`
  writeFileSync(path.join(OUT_DIR, 'index.html'), html)
}

/**
 * Copy ./public into dist (if exists).
 */
function copyPublic() {
  const pubDir = path.resolve(ROOT, 'public')
  if (existsSync(pubDir)) {
    console.log('• Copying public assets...')
    cpSync(pubDir, OUT_DIR, { recursive: true })
  }
}

/**
 * Ensure SPA fallback for client-side routing.
 * Creates dist/_redirects with /* -> /index.html.
 */
function ensureSpaRedirects() {
  const redirectsPath = path.join(OUT_DIR, '_redirects')
  if (!existsSync(redirectsPath)) {
    writeFileSync(redirectsPath, '/*    /index.html   200\n')
  }
}

/**
 * Main build pipeline.
 */
async function run() {
  console.log('• Cleaning output...')
  rmSync(OUT_DIR, { recursive: true, force: true })
  ensureDir(ASSETS_DIR)

  const entry = findEntry(['src/main.tsx', 'src/main.jsx', 'src/main.ts', 'src/main.js'])
  if (!entry) {
    console.error('✘ No entry file found (looked for src/main.tsx|.jsx|.ts|.js).')
    process.exit(1)
  }

  console.log(`• Bundling JS from ${path.relative(ROOT, entry)}...`)
  await build({
    entryPoints: [entry],
    outfile: path.join(ASSETS_DIR, 'index.js'),
    bundle: true,
    minify: isProd,
    sourcemap: false,
    jsx: 'automatic',
    target: ['es2018'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    loader: {
      '.svg': 'dataurl',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.png': 'file',
      '.webp': 'file',
    },
  })

  // Tailwind CSS build if src/index.css exists
  const cssIn = path.resolve(ROOT, 'src/index.css')
  const cssOut = path.join(ASSETS_DIR, 'index.css')
  let hasCss = false
  if (existsSync(cssIn)) {
    console.log('• Building CSS via Tailwind CLI...')
    const cfgJs = path.resolve(ROOT, 'tailwind.config.js')
    const cfgCjs = path.resolve(ROOT, 'tailwind.config.cjs')
    const cfg = existsSync(cfgJs) ? ` --config tailwind.config.js` : (existsSync(cfgCjs) ? ` --config tailwind.config.cjs` : '')
    sh(`npx tailwindcss -i "${cssIn}" -o "${cssOut}" --minify${cfg}`)
    hasCss = existsSync(cssOut)
  } else {
    console.log('• No src/index.css found, skipping Tailwind CSS build.')
  }

  // Create HTML
  console.log('• Creating index.html...')
  const hasFavicon = existsSync(path.resolve(ROOT, 'public/favicon.ico'))
  writeIndexHtml({ hasCss, hasFavicon })

  // Copy public assets and SPA redirects
  copyPublic()
  ensureSpaRedirects()

  console.log('Finished')
}

run().catch((err) => {
  console.error('✘ Build failed:', err)
  process.exit(1)
})
