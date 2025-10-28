import { test, expect } from '@playwright/test'

const url = 'http://localhost:3000'

test('Check header links and front page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')

  await page.waitForSelector('a:has-text("Home")')
  await page.waitForSelector('a:has-text("About")')
  await page.waitForSelector('a:has-text("People")')

  await page.waitForSelector(
    'div:has-text("email: uaf-snap-data-tools@alaska.edu")'
  )

  await page.waitForSelector(
    'div > p:has-text("The Arctic Data Collaborative (ARDAC) provides highly-curated, relevant Arctic datasets, streamlined data access, processing code examples and visualizations to support research in the North.")'
  )
})

test('Check about page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative")')
  await page.click('a:has-text("About")')
  await expect(page.locator('h2')).toHaveText('ARDAC is a home for alive data')

  await page.waitForSelector(
    'p:has-text("The Arctic Data Collaborative (ARDAC) is a data service that provides access and analysis for Arctic data and interactive tools. ARDAC is not a data archive. Instead of simply serving raw data, it offers vetted and pre-processed datasets to streamline visualization and further processing of data, and allow for faster research discovery.")'
  )

  await page.waitForSelector(
    'p:has-text("Unless otherwise specified by source providers, all data available through this tool are available through the Creative Commons Attribution 4.0 International (CC by 4.0).")'
  )
})

test('Check people page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative")')
  await page.click('a:has-text("People")')
  await expect(page.locator('h2')).toHaveText('People')

  await page.waitForSelector(
    'p:has-text("The Arctic Data Collaborative is increasing access to high quality climate information for the Arctic by partnering with experts committed to accessible data and trans-disciplinary research.")'
  )

  await page.waitForSelector('h4:has-text("Peter Bieniek")')

  await page.waitForSelector(
    'p:has-text("I am an expert in Alaska climatology, climate variability and change, dynamical downscaling, and regional climate.")'
  )
})

test('Check Climate Stripes story page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative")')
  await page.click('div.tagbar > ul > li > a:has-text("Climate")')
  await expect(page.locator('h2')).toHaveText('Climate')

  await page.click('a:has-text("Climate Stripes: What Might the Future Hold?")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Climate Stripes: What Might the Future Hold?'
  )

  await expect(page.locator('figure > img')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#chart > div > div')).toBeVisible()
})

test('Check Climate tag -> Summer Days page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Climate")')
  await expect(page.locator('h2')).toHaveText('Climate')

  await page.click('a:has-text("Summer Days")')

  await expect(page.locator('section > div > h3')).toHaveText('Summer Days')

  await expect(page.locator('#summer_days')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await page.waitForSelector('div > label:has-text("RCP 4.5")')
  await page.waitForSelector('div > label:has-text("RCP 8.5")')

  await expect(page.locator('#chart > div > div')).toBeVisible()
})

test('Check Precipitation tag -> Precipitation Frequency page', async ({
  page,
}) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Precipitation")')
  await expect(page.locator('h2')).toHaveText('Precipitation')

  await page.click('a:has-text("Precipitation Frequency")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Precipitation Frequency'
  )

  await expect(page.locator('#pf')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#duration')).toBeVisible()
  await expect(page.locator('#return-interval')).toBeVisible()
  await expect(page.locator('#chart > div > div')).toBeVisible()
})

test('Check Wildfire tag -> Flammability page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Wildfire")')
  await expect(page.locator('h2')).toHaveText('Wildfire')

  await page.click('a:has-text("Flammability")')

  await expect(page.locator('section > div > h3')).toHaveText('Flammability')

  await expect(page.locator('#flammability')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#chart > div > div')).toBeVisible()
})

test('Check Cryosphere tag -> Sea Ice Concentration page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Cryosphere")')
  await expect(page.locator('h2')).toHaveText('Cryosphere')

  await page.click('a:has-text("Sea Ice Concentration")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Sea Ice Concentration'
  )

  await expect(page.locator('#sea_ice_concentration')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Utq')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#year')).toBeVisible()
  await expect(page.locator('#chart > div > div')).toBeVisible()
})

test('Check Permafrost tag -> Ground Temperature page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Permafrost")')
  await expect(page.locator('h2')).toHaveText('Permafrost')

  await page.click('a:has-text("Ground Temperature")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Ground Temperature'
  )

  await expect(page.locator('#magt')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#magtsurface-chart')).toBeVisible()
  await expect(page.locator('#magt1m-chart')).toBeVisible()
  await expect(page.locator('#magt2m-chart')).toBeVisible()
  await expect(page.locator('#magt3m-chart')).toBeVisible()
  await expect(page.locator('#magt4m-chart')).toBeVisible()
  await expect(page.locator('#magt5m-chart')).toBeVisible()
})

test('Check Hydrology tag -> Evapotranspiration page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li.more')
  await waitForSelector('div.tagbar > ul > li > a:has-text("Hydrology")')

  await page.click('div.tagbar > ul > li > a:has-text("Hydrology")')
  await expect(page.locator('h2')).toHaveText('Hydrology')

  await page.click('a:has-text("Evapotranspiration")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Evapotranspiration'
  )

  await expect(page.locator('#evap')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#month')).toBeVisible()
  await expect(page.locator('#evap-chart')).toBeVisible()
})

test('Check Terrestrial tag -> Spruce Beetles page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector(
    'div > div.container.is-fullhd > section:nth-child(1) > div > h1'
  )
  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(1) > li.more'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(2) > a'
    )
  ).toHaveText('Terrestrial')

  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(2) > a'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > section:nth-child(3) > div > h2'
    )
  ).toHaveText('Terrestrial')

  await page.click(
    'div > div.container.is-fullhd > section:nth-child(3) > div > div > div > div:nth-child(1) > div > a'
  )

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > h3'
    )
  ).toHaveText('Climate Protection from Spruce Beetles')

  await expect(page.locator('#beetles')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.my-3 > div.selected-place > div > p > button'
    )
  ).toBeVisible()
  await expect(page.locator('#snowpack')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div.content.is-size-5 > div:nth-child(8) > table'
    )
  ).toBeVisible()
})

test('Check Programming tag -> Heating Degree Days page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector(
    'div > div.container.is-fullhd > section:nth-child(1) > div > h1'
  )
  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(1) > li.more'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(3) > a'
    )
  ).toHaveText('Programming')

  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(3) > a'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > section:nth-child(3) > div > h2'
    )
  ).toHaveText('Programming')

  await page.click(
    'div > div.container.is-fullhd > section:nth-child(3) > div > div > div > div:nth-child(1) > div > a'
  )

  await expect(
    page.locator(
      '#Projected-Change-in-Heating-Degree-Days-by-Alaska-Native-Corporation'
    )
  ).toBeVisible()

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(2) > div.inner_cell > div > p:nth-child(2)'
    )
  ).toHaveText(
    'This notebook demonstrates how to query the SNAP Data API for Alaska Native Corporation polygons, Alaska communities, and modeled heating degree days. In this example, we use ARDAC helper functions from the ardac_utils.py module to quickly fetch and summarize these datasets.'
  )

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(4) > div > div.inner_cell > div > div'
    )
  ).toBeVisible()

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(8) > div.output_wrapper > div > div > div.output_subarea.output_stream.output_stdout.output_text'
    )
  ).toBeVisible()

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(20) > div.output_wrapper > div > div > div.output_png.output_subarea > img'
    )
  ).toBeVisible()

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(22) > div:nth-child(1) > div.inner_cell > div > div'
    )
  ).toBeVisible()

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.column.is-three-quarters.notebook.content.is-size-5 > div:nth-child(22) > div.output_wrapper > div > div > div.output_png.output_subarea > img'
    )
  ).toBeVisible()
})

test('Check Temperature tag -> Temperature, CMIP6 page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector(
    'div > div.container.is-fullhd > section:nth-child(1) > div > h1'
  )
  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(1) > li.more'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(4) > a'
    )
  ).toHaveText('Temperature')

  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(4) > a'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > section:nth-child(3) > div > h2'
    )
  ).toHaveText('Temperature')

  await page.click(
    'div > div.container.is-fullhd > section:nth-child(3) > div > div > div > div:nth-child(2) > div > a'
  )

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > h3'
    )
  ).toHaveText('Temperature, CMIP6')

  await expect(page.locator('#tas')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.my-3 > div.selected-place > div > p > button'
    )
  ).toBeVisible()
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#month')).toBeVisible()
  await expect(page.locator('#tas-chart')).toBeVisible()
  await expect(page.locator('#tasmax-chart')).toBeVisible()
  await expect(page.locator('#tasmin-chart')).toBeVisible()
})

test('Check CMIP6 tag -> Precipitation, CMIP6 page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector(
    'div > div.container.is-fullhd > section:nth-child(1) > div > h1'
  )
  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(1) > li.more'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(6) > a'
    )
  ).toHaveText('CMIP6')

  await page.click(
    'div > div.container.is-fullhd > div.tagbar > ul:nth-child(2) > li:nth-child(6) > a'
  )
  await expect(
    page.locator(
      'div > div.container.is-fullhd > section:nth-child(3) > div > h2'
    )
  ).toHaveText('CMIP6')

  await page.click(
    'div > div.container.is-fullhd > section:nth-child(3) > div > div > div > div:nth-child(4) > div > a'
  )

  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > h3'
    )
  ).toHaveText('Precipitation, CMIP6')

  await expect(page.locator('#snow_melt')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await expect(
    page.locator(
      'div > div.container.is-fullhd > div:nth-child(3) > section > div > div.my-3 > div.selected-place > div > p > button'
    )
  ).toBeVisible()
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#month')).toBeVisible()
  await expect(page.locator('#pr-chart')).toBeVisible()
})

test('Check footer', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector(
    'div > div.container.is-fullhd > section:nth-child(1) > div > h1'
  )

  await expect(page.locator('div > footer > div > p.bolder')).toHaveText(
    'Made by the Scenarios Network for Alaska + Arctic Planning located at the International Arctic Research Center.'
  )

  await expect(page.locator('div > footer > div > p:nth-child(2)')).toHaveText(
    'Funding provided by the Data Management Program, Climate and Environmental Sciences Division, US Department of Energy.'
  )

  await expect(page.locator('div > footer > div > p.lighter')).toHaveText(
    'Please contact uaf-snap-data-tools@alaska.edu with questions or comments.'
  )

  const currentYear = new Date().getFullYear().toString()
  await expect(page.locator('div > footer > div > p:nth-child(4)')).toHaveText(
    `Copyright © ${currentYear} University of Alaska Fairbanks. All rights reserved. The University of Alaska is an Equal Opportunity/Equal Access Employer and Educational Institution. The University is committed to a policy of non-discrimination against individuals on the basis of any legally protected status.`
  )
})
