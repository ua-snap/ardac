import Plotly from 'plotly.js-dist-min'

// Plotly draws charts as SVG with no text alternative. Present each chart to
// assistive technology as a single image named after its title, falling back
// to its axis titles. The image role goes on the plot's SVG rather than the
// chart container so the modebar buttons beside it stay reachable.
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
  const [plot, ...overlays] = chart.querySelectorAll('svg.main-svg')
  if (plot) {
    plot.setAttribute('role', 'img')
    plot.setAttribute(
      'aria-label',
      description ? 'Chart: ' + description : 'Chart'
    )
  }
  // Legend and title text is already covered by the image's name.
  overlays.forEach((svg: Element) => svg.setAttribute('aria-hidden', 'true'))
}

// Plotly's modebar buttons are <a> elements with no href or name, so they
// can't be focused and aren't announced. Name them from their tooltip and
// make them act like buttons.
const activateOnKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}

const labelModebar = (chart: HTMLElement) => {
  chart.querySelectorAll('.modebar-btn').forEach(button => {
    if (button.hasAttribute('role')) return
    button.setAttribute('role', 'button')
    button.setAttribute('tabindex', '0')
    button.setAttribute('aria-label', button.getAttribute('data-title') || '')
    button.addEventListener('keydown', activateOnKey as EventListener)
  })
}

const makeAccessible = (chart: any) => {
  describeChart(chart)
  labelModebar(chart)
}

const newPlot: typeof Plotly.newPlot = async (...args) => {
  const chart = await Plotly.newPlot(...args)
  makeAccessible(chart)
  // Plotly redraws its SVG and modebar on resize and relayout.
  ;(chart as any).on('plotly_afterplot', () => makeAccessible(chart))
  return chart
}

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      Plotly: { ...Plotly, newPlot },
    },
  }
})
