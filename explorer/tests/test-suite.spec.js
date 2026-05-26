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
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('a:has-text("About")')
  await page.waitForSelector('h2:has-text("ARDAC is a home for alive data")')

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
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('a:has-text("People")')
  await page.waitForSelector('h2:has-text("People")')

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
  await page.waitForTimeout(500)
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

test('Check 1989 Cold Snap story page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative")')
  await page.click('div.tagbar > ul > li > a:has-text("Climate")')
  await page.waitForTimeout(500)
  await expect(page.locator('h2')).toHaveText('Climate')

  await page.click('a:has-text("1989 Alaska Cold Snap")')

  await expect(page.locator('section > div > h3')).toHaveText(
    '1989 Alaska Cold Snap'
  )

  await expect(page.locator('figure > img').first()).toBeVisible()

  await expect(page.locator('table >> text=Nome')).toBeVisible()
  await expect(page.locator('table >> text=-54°F')).toBeVisible()

  await page.waitForSelector('#cold-snap-tanana > div > div', {
    timeout: 60000,
  })
  await expect(page.locator('#cold-snap-tanana > div > div')).toBeVisible()
})

test('Check Climate tag -> Summer Days page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.click('div.tagbar > ul > li > a:has-text("Climate")')
  await page.waitForTimeout(500)
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
  await page.waitForTimeout(500)
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
  await page.waitForTimeout(500)
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
  await page.waitForTimeout(500)
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
  await page.waitForTimeout(500)
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
  await page.locator('div.tagbar > ul > li.more').click({ noWaitAfter: true })
  await page.waitForSelector('div.tagbar > ul > li > a:has-text("Hydrology")')

  await page.click('div.tagbar > ul > li > a:has-text("Hydrology")')
  await page.waitForTimeout(500)
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
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.locator('div.tagbar > ul > li.more').click({ noWaitAfter: true })
  await page.waitForSelector('div.tagbar > ul > li > a:has-text("Terrestrial")')

  await page.click('div.tagbar > ul > li > a:has-text("Terrestrial")')
  await page.waitForTimeout(500)
  await expect(page.locator('h2')).toHaveText('Terrestrial')

  await page.click('a:has-text("Climate Protection from Spruce Beetles")')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Climate Protection from Spruce Beetles'
  )

  await expect(page.locator('#beetles')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#snowpack')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('table')).toBeVisible()
})

test('Check Programming tag -> Heating Degree Days page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.locator('div.tagbar > ul > li.more').click({ noWaitAfter: true })
  await page.waitForSelector('div.tagbar > ul > li > a:has-text("Programming")')

  await page.click('div.tagbar > ul > li > a:has-text("Programming")')
  await page.waitForTimeout(500)
  await expect(page.locator('h2')).toHaveText('Programming')

  await page.click(
    'a:has-text("Heating Degree Days by Alaska Native Corporation")'
  )

  await page.waitForSelector(
    'h1:has-text("Projected Change in Heating Degree Days by Alaska Native Corporation")'
  )

  await page.waitForSelector(
    'div > p:has-text("This notebook demonstrates how to query the SNAP Data API")'
  )

  await page.waitForSelector('pre:has-text("from ardac_utils import *")')

  await page.waitForSelector(
    'pre:has-text("index id_left              name_left")'
  )

  await page.waitForSelector(
    'pre:has-text("total_pop = sum(nc_dd_mean_pop[\'pop\'])")'
  )
})

test('Check Temperature tag -> Temperature, CMIP6 page', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page
    .locator('div.tagbar > ul:nth-child(1) > li.more')
    .click({ noWaitAfter: true })
  await page.waitForSelector('div.tagbar > ul > li > a:has-text("Temperature")')

  await page.click('div.tagbar > ul > li > a:has-text("Temperature")')
  await page.waitForTimeout(500)
  await expect(page.locator('h2')).toHaveText('Temperature')

  await page.click('a:has(h3:text-is("Temperature, CMIP6"))')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Temperature, CMIP6'
  )

  await expect(page.locator('#tas')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
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
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')
  await page.locator('div.tagbar > ul > li.more').click({ noWaitAfter: true })
  await page.waitForSelector('div.tagbar > ul > li > a:has-text("CMIP6")')

  await page.click('div.tagbar > ul > li > a:has-text("CMIP6")')
  await page.waitForTimeout(500)
  await expect(page.locator('h2')).toHaveText('CMIP6')

  await page.click('a:has(h3:text-is("Precipitation, CMIP6"))')

  await expect(page.locator('section > div > h3')).toHaveText(
    'Precipitation, CMIP6'
  )

  await expect(page.locator('#snow_melt')).toBeVisible()

  await expect(page.locator('#gimme')).toBeVisible()
  await page.fill('#gimme', 'Fairbanks')
  await page.click('#autoComplete_result_0')
  await page.waitForSelector('button:has-text("Pick a new place")')
  await expect(page.locator('#model')).toBeVisible()
  await expect(page.locator('#scenario')).toBeVisible()
  await expect(page.locator('#month')).toBeVisible()
  await expect(page.locator('#pr-chart')).toBeVisible()
})

test('Check footer', async ({ page }) => {
  await page.goto(url)
  await page.setViewportSize({ width: 1728, height: 1078 })
  await page.waitForSelector('h1:has-text("Arctic Data Collaborative.")')

  await page.waitForSelector(
    'div > footer > div > p:has-text("Made by the Scenarios Network for Alaska + Arctic Planning located at the International Arctic Research Center.")'
  )

  await page.waitForSelector(
    'div > footer > div > p:has-text("Funding & guidance provided by the Data Management Program, Climate and Environmental Sciences Division, US Department of Energy and the USGS Alaska Climate Adaptation Science Center.")'
  )
  await page.waitForSelector(
    'div > footer > div > p.lighter:has-text("Please contact uaf-snap-data-tools@alaska.edu with questions or comments.")'
  )

  const currentYear = new Date().getFullYear().toString()
  await page.waitForSelector(
    `div > footer > div > p:nth-child(4):has-text("Copyright © ${currentYear} University of Alaska Fairbanks. All rights reserved. The University of Alaska is an Equal Opportunity/Equal Access Employer and Educational Institution. The University is committed to a policy of non-discrimination against individuals on the basis of any legally protected status.")`
  )
})
