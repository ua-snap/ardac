<script setup lang="ts">
let endpoint = 'https://earthmaps.io/permafrost/point/gipl/63.0628/-146.1627'

// Default selections
let modelKey = '5ModelAvg'
let scenarioKey = 'RCP 8.5'

let years: number[] = []
let permafrosttopSeries: number[] = []
let permafrostbaseSeries: number[] = []

const extractTimeSeriesData = async () => {
  try {
    console.log('Fetching data from:', endpoint)
    let payload = await $fetch<any>(endpoint)

    // Validate the data structure
    if (!payload || !payload[modelKey]) {
      throw new Error('Unexpected data structure from Earthmaps API')
    }

    let modelSeries = payload[modelKey] as Record<string, Record<string, any>>

    // Clear and populate the outer scope arrays
    years = []
    permafrosttopSeries = []
    permafrostbaseSeries = []

    // Extract yearly data for the selected scenario
    Object.keys(modelSeries)
      .map(year => Number(year))
      .filter(year => Number.isFinite(year))
      .sort((a, b) => a - b)
      .forEach(year => {
        let values = modelSeries[String(year)]?.[scenarioKey]
        let top = Number(values?.permafrosttop)
        let base = Number(values?.permafrostbase)

        if (Number.isFinite(top) && Number.isFinite(base)) {
          years.push(year)
          permafrosttopSeries.push(top)
          permafrostbaseSeries.push(base)
        }
      })

    console.log('Data extracted:', years.length, 'years')
  } catch (error) {
    console.error('Error fetching permafrost data:', error)
    throw error
  }
}

const buildChart = () => {
  console.log('Building chart with data:')
  console.log('Years:', years)
  console.log('Permafrost Top Series:', permafrosttopSeries)
  console.log('Permafrost Base Series:', permafrostbaseSeries)
}

onMounted(async () => {
  await extractTimeSeriesData()
  buildChart()
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
