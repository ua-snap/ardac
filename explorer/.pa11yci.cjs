// pa11y-ci config. Run `pa11y-ci` from explorer/ with the dev server up.
//
// The URL list is built from assets/items.ts so new items and tags are
// scanned without editing this file. Environment overrides:
//   PA11Y_BASE_URL  server to scan (default http://localhost:3000)
//   PA11Y_PATHS     comma-separated paths to scan instead of the whole site,
//                   e.g. PA11Y_PATHS=/item/story-cold-snap-1989,/about
const fs = require('fs')
const path = require('path')

const baseUrl = (process.env.PA11Y_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
)

const sitePaths = () => {
  const items = fs.readFileSync(
    path.join(__dirname, 'assets/items.ts'),
    'utf-8'
  )
  const slugs = [...items.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1])
  const tags = new Set(
    [...items.matchAll(/tags:\s*\[([^\]]*)\]/g)].flatMap(m =>
      [...m[1].matchAll(/'([^']+)'/g)].map(t => t[1])
    )
  )
  return [
    '/',
    '/about',
    '/people',
    ...[...tags].sort().map(tag => '/tag/' + encodeURIComponent(tag)),
    ...slugs.map(slug => '/item/' + slug),
  ]
}

const paths = process.env.PA11Y_PATHS
  ? process.env.PA11Y_PATHS.split(',').map(p => p.trim())
  : sitePaths()

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    // Item pages load data and draw charts after the page loads.
    timeout: 60000,
  },
  urls: paths.map(p => baseUrl + p),
}
