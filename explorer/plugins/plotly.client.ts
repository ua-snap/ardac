import Plotly from 'plotly.js-dist-min'

// Plotly draws charts as SVG with no text alternative. Present each chart to
// assistive technology as a single image named after its title, falling back
// to its axis titles.
const describeChart = (chart: any) => {
  const text = (title: any) =>
    (typeof title === 'string' ? title : title?.text || '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .trim()
  const layout = chart.layout || {}
  const axes = [text(layout.yaxis?.title), text(layout.xaxis?.title)]
    .filter(axis => axis)
    .join(' by ')
  const description = text(layout.title) || axes
  chart.setAttribute('role', 'img')
  chart.setAttribute(
    'aria-label',
    description ? 'Chart: ' + description : 'Chart'
  )
}

const newPlot: typeof Plotly.newPlot = async (...args) => {
  const chart = await Plotly.newPlot(...args)
  describeChart(chart)
  return chart
}

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      Plotly: { ...Plotly, newPlot },
    },
  }
})
