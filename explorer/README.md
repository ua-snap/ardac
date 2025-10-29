# 🥗 ARDAC Explorer

## Initial setup

### Install dependencies

Install nvm on your workstation if you have not already:

https://github.com/nvm-sh/nvm

Then run:

```bash
nvm use lts/hydrogen
npm install
```

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

### Development notes

#### Adding a new item

Determine a 'slug' for the item.  The slug is a unique but human-readable ID for the item that will be visible in the URL.

1. Add the slug for the new item to `types/slugs.d.ts`
2. Add any new tags for the new item to `types/tags.d.ts`
3. Add the item in `assets/items.ts`:
    * `slug`: the slug ID
    * `title`: the 'headline'
    * `blurb`: **short** text description, single line/paragraph, no HTML please
    * `tags`: array of tags
    * `image`: image filename, corresponds to `public/previews` folder
    * `imageAlt`: alt text for accessibility

The item is now available for use in static layouts and will be included in any pages that display all results for a tag.  Static examples:

```html
<!-- display only headline, show primary tag -->
<ItemBrief slug="indicator-ftc" showTag />

<!-- headline + blurb, no tags shown -->
<ItemText slug="sea-ice-concentration" />

<!-- headline, blurb, photo (if present), don't show tags -->
<ItemTextPicture slug="indicator-dw" />
````

To build the actual content for the item, add a Vue component in `components/global` named according to the slug pattern in CamelCase, i.e. `map-permafrost` would become `MapPermafrost`. From the command line in the root of the project directory:

```bash
npx nuxi add component global/MapPermafrost
```

...which will add a Vue SFC file in the right place. Now, that component can be accessed by clicking on the item you just created.

#### Connecting people / bios

When adding an item, consider if you should tag a person with the bio brief. The guidelines are approximate, but consider doing this when:

- It's a narrative story item
- It's a new thing
- The people you'd tag created the data or tech. (If SNAP techs just do QA/QC and ingest/prep, we would not tag them; same for programmers who worked on features).

Use the `Bios` component, for example,

`<Bios :people="['Hajo Eicken', 'Scott Rupp']" />`

When adding someone new:

- add an image to `/public/images/people`
- add them to the `types/people.d.ts`
- add the bio itself in `assets/bios.ts`
- add the person to the `/people` page

#### Converting Jupyter notebooks to items

Follow the pattern used in the `global/NotebookPermObsTemp` component. To transform the HTML before copy/pasting it into the slot, activate a Conda environment with Jupyter and `nbconvert` and `tidy` (probably already installed in MacOS) then:

```bash
jupyter nbconvert --to html --template basic notebook.ipynb
tidy -i -m notebook.html
sed -i '' 's/class\=\"input\"//' notebook.html
```

This does a bit of cleanup and removes one class that will clash with Bulma. Finally, copy paste everything in the `<body>` tag of the cleaned HTML into the `<slot>` in the `NotebookTemplate` component.

## Production

### Enable website hosting on the AWS S3 bucket:

**_The following command should be run only during the initial setup of the S3
bucket. Do not run this command again or it will wipe out the S3 website
redirection rules._**

```bash
aws s3 website s3://arcticdatascience.org/ --index-document index.html --error-document index.html
```

### Add website redirection rules to S3 bucket

Website redirection rules need to be added to the S3 bucket for data to hydrate
properly when a report is referenced directly by its URL (permalink).

From the AWS web interface for the S3 bucket, go to:

Properties → Static website hosting → Edit

In the "Redirection rules" text area, add the following:

```
[
    {
        "Condition": {
            "HttpErrorCodeReturnedEquals": "404"
        },
        "Redirect": {
            "HostName": "arcticdatascience.org",
            "Protocol": "http",
            "ReplaceKeyPrefixWith": "#!/"
        }
    },
    {
        "Condition": {
            "HttpErrorCodeReturnedEquals": "403"
        },
        "Redirect": {
            "HostName": "arcticdatascience.org",
            "Protocol": "http",
            "ReplaceKeyPrefixWith": "#!/"
        }
    }
]
```

Code in `app.vue` catches and routes these redirects into fully hydrated report pages.

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
