# 🥗 ARDAC Explorer

## Initial setup

### Install dependencies

Install nvm on your workstation if you have not already:

https://github.com/nvm-sh/nvm

Then, from this directory, install and use the Node version in `.nvmrc`
(Node 24) and install the packages:

```bash
nvm install
npm install
```

Run `nvm use` in new shells to switch to it again.

### Set environment variables if necessary

The following environment variables can be set to change the API and map service
endpoints:

| Environment variable | Default                                |
| -------------------- | -------------------------------------- |
| GEOSERVER_URL        | https://gs.earthmaps.io/geoserver/wms  |
| RASDAMAN_URL         | https://maps.earthmaps.io/rasdaman/ows |
| SNAP_API_URL         | https://earthmaps.io                   |

## Development

### Run locally in development mode

Serve with hot reload at http://localhost:3000:

```
npm run dev
```

### Type check

The dev server and build don't type check. Run this before opening a PR (CI
runs it too):

```
npm run typecheck
```

### Development notes

#### Adding a new item

Determine a 'slug' for the item. The slug is a unique but human-readable ID for the item that will be visible in the URL.

1. Add the slug for the new item to `types/slugs.d.ts`
2. Add any new tags for the new item to `types/tags.d.ts`
3. Add the item in `assets/items.ts`:
   - `slug`: the slug ID
   - `type`: `'community'` for a dataset built with communities that people can contribute to, `'explainer'` for a story or guide, `'xray'` for a dataset you can explore by place (tag pages list each type in its own section, community datasets first)
   - `title`: the 'headline'
   - `blurb`: **short** text description, single line/paragraph, no HTML please
   - `tags`: array of tags
   - `image`: image filename, corresponds to `public/previews` folder
   - `imageAlt`: alt text for accessibility
   - `people`: optional, the people credited for the item (see below)

The item is now available for use in static layouts and will be included in any pages that display all results for a tag. Static examples:

```html
<!-- display only headline, show primary tag -->
<ItemBrief slug="indicator-ftc" showTag />

<!-- headline + blurb, no tags shown -->
<ItemText slug="sea-ice-concentration" />

<!-- headline, blurb, photo (if present), don't show tags -->
<ItemTextPicture slug="indicator-dw" />
```

To build the actual content for the item, add a Vue component in `components/global` named according to the slug pattern in CamelCase, i.e. `sea-ice-concentration` would become `SeaIceConcentration`. From the command line in the root of the project directory:

```bash
npx nuxi add component global/SeaIceConcentration
```

...which will add a Vue SFC file in the right place. Now, that component can be accessed by clicking on the item you just created.

#### Connecting people / bios

When adding an item, consider if you should tag a person with the bio brief. The guidelines are approximate, but consider doing this when:

- It's a narrative story item
- It's a new thing
- The people you'd tag created the data or tech. (If SNAP techs just do QA/QC and ingest/prep, we would not tag them; same for programmers who worked on features).

List the people in the item's `people` field in `assets/items.ts`, in the order the item credits them:

```ts
people: ['Hajo Eicken', 'Andy Mahoney'],
```

Then show them at the end of the item's content component with the `Bios` component, which reads that list:

`<Bios slug="landfast-sea-ice" />`

The People page builds each person's list of items from the same field, so there's nothing to add there.

When adding someone new:

- add an image to `/public/images/people`
- add them to the `types/people.d.ts`
- add the bio itself in `assets/bios.ts`, with a `role` (job title and organization) if you know it

The People page lists everyone in `assets/bios.ts`, sorted by last name.

## Production

### Enable website hosting on the AWS S3 bucket:

**_The following command should be run only during the initial setup of the S3
bucket. It replaces the bucket's whole website configuration._**

```bash
aws s3 website s3://arcticdatascience.org/ --index-document index.html --error-document index.html
```

### Direct links to pages

The site is a single-page app (`ssr: false`): every page is the same
`index.html` app shell, and the app works out which page to show in the
browser.

So that a direct link to an item or tag page returns 200, `npm run generate`
writes a copy of the shell at each page's path, such as
`item/indicator-su/index.html`. `nuxt.config.ts` builds the list of pages to
generate from `assets/items.ts`. Any other path gets the error document, which
is also `index.html`: the app still loads, but with a 404 status, which keeps
the page out of search results.

The bucket needs no redirection rules. Don't add rules that redirect 404s to
`#!/` URLs: nothing in the app handles them, so those links would open the
home page.

### Build preview

Run the statically built website locally:

```bash
npm run build
npm run preview
```

### Deployment

Set environment variables if necessary, then run:

```bash
npm run generate
aws s3 cp .output/public s3://arcticdatascience.org/ --acl public-read --recursive
```

You will also need to invalidate the CloudFront cache for arcticdatascience.org.
Use the following CLI command:

```bash
aws cloudfront create-invalidation --distribution-id EW659H9IK8XAT --paths "/*"
```
