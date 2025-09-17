# ARDAC (Arctic Data Collaborative) - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- **CRITICAL**: All Node.js/npm commands take 30-60 seconds to complete. NEVER CANCEL builds or long-running commands. Set timeout to 120+ minutes for safety.
- **CRITICAL**: Conda/mamba environment creation may fail due to SSL certificate issues in sandboxed environments. Document this limitation but continue with other validations.
- **VALIDATION SCENARIOS**: Always test the complete user workflow after making changes:
  1. Navigate to homepage at http://localhost:3000
  2. Click on interactive data visualizations (e.g., Climate Stripes)
  3. Test search functionality (may fail due to API access limitations)
  4. Verify responsive layout and navigation

### Explorer Web Application (Primary Component)

- **Install dependencies**: `cd explorer && npm install` -- takes 30-40 seconds. NEVER CANCEL.
- **Development server**: `npm run dev` -- starts in 15-20 seconds at http://localhost:3000
- **Production build**: `npm run build` -- takes 35-40 seconds. NEVER CANCEL. Set timeout to 120+ minutes.
- **Static generation**: `npm run generate` -- takes 35-40 seconds. NEVER CANCEL. Set timeout to 120+ minutes.
- **Preview production build**: `npm run preview` -- serves at http://localhost:3000
- **Code formatting**: `npx prettier --check .` to check format, `npx prettier --write .` to fix
  - Note: 43+ files need formatting, but this is not required for functionality

### Notebooks (JupyterLite)

- **Install dependencies**: `cd notebooks && python3 -m pip install -r requirements.txt` -- takes 40-45 seconds
- **Build JupyterLite**: `jupyter lite build --contents content --output-dir dist` -- takes 3-5 seconds
- **Serve locally**: `cd dist && python3 -m http.server` -- serves at http://localhost:8000
- **GitHub Pages deployment**: Automated via `.github/workflows/deploy.yml` on push to main

### Python/Conda Environments

- **Toolbox environment**: `conda env create -f toolbox/environment.yml`
  - May fail due to SSL certificate issues in sandboxed environments
  - Contains comprehensive geospatial analysis tools (GDAL, GeoPandas, etc.)
- **GIPL environment**: `conda env create -f curation/gipl/environment.yml`
- **Other curation environments**: Available in respective subdirectories

## Validation

- **Always manually validate any new code** by running the complete application
- **ALWAYS run through at least one complete end-to-end scenario** after making changes:
  1. Start dev server: `cd explorer && npm run dev`
  2. Open browser to http://localhost:3000
  3. Navigate through homepage sections
  4. Click on data visualizations and stories
  5. Test interactive features (search may fail due to API limitations)
- **Always run formatting check**: `npx prettier --check .` in explorer directory
- **External API dependencies**: Application connects to https://earthmaps.io for data - may be blocked in sandboxed environments

## Repository Structure

### Key Directories

- **`explorer/`** - Main Nuxt.js web application (Vue 3, TypeScript)
  - Built with Nuxt 3, Vue 3, TypeScript, Bulma CSS
  - Interactive data visualizations using Plotly.js and Leaflet maps
  - Static site generation capability for deployment
- **`notebooks/`** - JupyterLite computational notebooks
  - Auto-deployed to GitHub Pages on main branch push
  - Contains interactive analysis notebooks for climate/environmental data
- **`curation/`** - Python data processing and curation scripts
  - Multiple subdirectories with conda environment files
  - NCAR 12km data, GIPL permafrost, landfast sea ice, degree days
- **`toolbox/`** - General-purpose analysis tools and utilities
  - Comprehensive conda environment for geospatial analysis

### Important Files

- **`explorer/package.json`** - Web app dependencies and scripts
- **`explorer/nuxt.config.ts`** - Nuxt configuration with environment variables
- **`notebooks/requirements.txt`** - JupyterLite Python dependencies
- **`notebooks/.github/workflows/deploy.yml`** - Automated deployment workflow
- **Environment YAML files** - Conda environments in each curation subdirectory

## Common Tasks

### Development Workflow

1. **Start explorer development**: 
   ```bash
   cd explorer
   npm install  # 30-40 seconds
   npm run dev  # Starts at http://localhost:3000
   ```

2. **Build and test production**:
   ```bash
   npm run build     # 35-40 seconds. NEVER CANCEL.
   npm run preview   # Test production build
   ```

3. **Static site generation**:
   ```bash
   npm run generate  # 35-40 seconds. NEVER CANCEL.
   # Outputs to .output/public for static hosting
   ```

4. **Notebook development**:
   ```bash
   cd notebooks
   python3 -m pip install -r requirements.txt  # 40-45 seconds
   jupyter lite build --contents content --output-dir dist  # 3-5 seconds
   cd dist && python3 -m http.server  # Serves at :8000
   ```

### Environment Setup

1. **Install miniforge** (if conda not available):
   ```bash
   curl -L https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh -o miniforge.sh
   bash miniforge.sh -b -p $HOME/miniforge
   source $HOME/miniforge/bin/activate
   ```

2. **Create conda environments** (may fail in sandboxed environments):
   ```bash
   mamba env create -f toolbox/environment.yml
   mamba env create -f curation/gipl/environment.yml
   # etc.
   ```

### Deployment

- **Notebooks**: Automatically deployed to GitHub Pages on main branch push
- **Explorer**: Can be deployed as static site using `npm run generate`
- **AWS S3 Deployment** (explorer):
  ```bash
  npm run generate
  aws s3 cp .output/public s3://arcticdatascience.org/ --acl public-read --recursive
  aws cloudfront create-invalidation --distribution-id EW659H9IK8XAT --paths "/*"
  ```

## Timing Expectations & Timeouts

- **npm install**: 30-40 seconds - Set timeout to 120 minutes minimum
- **npm run dev**: 15-20 seconds startup - Set timeout to 120 minutes minimum  
- **npm run build**: 35-40 seconds - Set timeout to 120 minutes minimum
- **npm run generate**: 35-40 seconds - Set timeout to 120 minutes minimum
- **pip install requirements**: 40-45 seconds - Set timeout to 60 minutes minimum
- **jupyter lite build**: 3-5 seconds - Set timeout to 30 minutes minimum
- **conda env create**: Variable (may fail due to SSL issues)

**NEVER CANCEL**: Always wait for commands to complete. Build processes may appear to hang but are working normally.

## Known Limitations

- **External API access**: https://earthmaps.io may be blocked in sandboxed environments
- **Conda SSL certificates**: May prevent environment creation in sandboxed environments
- **Code formatting**: 43+ files need prettier formatting but this doesn't affect functionality
- **Browser list warnings**: Expected and don't affect functionality

## External Dependencies

- **Runtime APIs**: https://earthmaps.io (SNAP Data API)
- **Map services**: https://gs.earthmaps.io/geoserver/wms, https://maps.earthmaps.io/rasdaman/ows  
- **Analytics**: https://umami.snap.uaf.edu (may be blocked)
- **Fonts**: Google Fonts (may be blocked)

Always test with external dependencies blocked to verify graceful degradation.