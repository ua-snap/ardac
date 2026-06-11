<script setup lang="ts">
const endpoint = 'https://earthmaps.io/permafrost/point/gipl/63.0628/-146.1627'

// Default selections
const modelKey = '5ModelAvg'
const scenarioKey = 'RCP 8.5'

const extractTimeSeriesData = async () => {
  try {
    console.log('Fetching data from:', endpoint)
    const payload = await $fetch<any>(endpoint)

    // Validate the data structure
    if (!payload || !payload[modelKey]) {
      throw new Error('Unexpected data structure from Earthmaps API')
    }

    const modelSeries = payload[modelKey] as Record<string, Record<string, any>>

    // Arrays to hold time series data
    const years: number[] = []
    const permafrosttopSeries: number[] = []
    const permafrostbaseSeries: number[] = []

    // Extract yearly data for the selected scenario
    Object.keys(modelSeries)
      .map(year => Number(year))
      .filter(year => Number.isFinite(year))
      .sort((a, b) => a - b)
      .forEach(year => {
        const values = modelSeries[String(year)]?.[scenarioKey]
        const top = Number(values?.permafrosttop)
        const base = Number(values?.permafrostbase)

        if (Number.isFinite(top) && Number.isFinite(base)) {
          years.push(year)
          permafrosttopSeries.push(top)
          permafrostbaseSeries.push(base)
        }
      })

    // Print to console
    console.log('\n=== PERMAFROST TIME SERIES DATA ===')
    console.log(`Model: ${modelKey}`)
    console.log(`Scenario: ${scenarioKey}`)
    console.log(`Data points: ${years.length}`)
    console.log(`Year range: ${years[0]} - ${years[years.length - 1]}`)
    console.log('\n--- Years Array ---')
    console.log(years)
    console.log('\n--- Permafrost Top Array (meters) ---')
    console.log(permafrosttopSeries)
    console.log('\n--- Permafrost Base Array (meters) ---')
    console.log(permafrostbaseSeries)

    // Print a sample table for first 10 and last 10 years
    console.log('\n--- Sample Data Table (first 10 years) ---')
    console.table(
      years.slice(0, 10).map((year, i) => ({
        Year: year,
        'Top (m)': permafrosttopSeries[i].toFixed(2),
        'Base (m)': permafrostbaseSeries[i].toFixed(2),
        'Thickness (m)': (
          permafrostbaseSeries[i] - permafrosttopSeries[i]
        ).toFixed(2),
      }))
    )

    console.log('\n--- Sample Data Table (last 10 years) ---')
    const lastIndex = years.length - 10
    console.table(
      years.slice(lastIndex).map((year, i) => ({
        Year: year,
        'Top (m)': permafrosttopSeries[lastIndex + i].toFixed(2),
        'Base (m)': permafrostbaseSeries[lastIndex + i].toFixed(2),
        'Thickness (m)': (
          permafrostbaseSeries[lastIndex + i] -
          permafrosttopSeries[lastIndex + i]
        ).toFixed(2),
      }))
    )

    // Calculate and print statistics
    const avgTop =
      permafrosttopSeries.reduce((a, b) => a + b, 0) /
      permafrosttopSeries.length
    const avgBase =
      permafrostbaseSeries.reduce((a, b) => a + b, 0) /
      permafrostbaseSeries.length
    const minTop = Math.min(...permafrosttopSeries)
    const maxTop = Math.max(...permafrosttopSeries)
    const minBase = Math.min(...permafrostbaseSeries)
    const maxBase = Math.max(...permafrostbaseSeries)

    console.log('\n--- Summary Statistics ---')
    console.log('Permafrost Top:')
    console.log(`  Average: ${avgTop.toFixed(2)} m`)
    console.log(`  Min: ${minTop.toFixed(2)} m`)
    console.log(`  Max: ${maxTop.toFixed(2)} m`)
    console.log('Permafrost Base:')
    console.log(`  Average: ${avgBase.toFixed(2)} m`)
    console.log(`  Min: ${minBase.toFixed(2)} m`)
    console.log(`  Max: ${maxBase.toFixed(2)} m`)
    console.log('===================================\n')

    return {
      years,
      permafrosttopSeries,
      permafrostbaseSeries,
    }
  } catch (error) {
    console.error('Error fetching permafrost data:', error)
    throw error
  }
}

onMounted(async () => {
  await extractTimeSeriesData()
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Permafrost Time Series Data Extraction</h3>
      <p>
        This component downloads permafrost data from
        <a :href="endpoint" target="_blank" rel="noopener noreferrer"
          >Earthmaps GIPL model</a
        >
        for coordinates 63.0628°N, 146.1627°W and extracts the
        <code>permafrosttop</code> and <code>permafrostbase</code> variables
        into time series arrays.
      </p>
      <p>
        <strong>Check your browser's developer console</strong> (F12 or
        Cmd+Option+I) to see the extracted data arrays and statistics.
      </p>
      <div class="notification is-info">
        <strong>Data extracted for:</strong>
        <ul>
          <li>Model: {{ modelKey }}</li>
          <li>Scenario: {{ scenarioKey }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
