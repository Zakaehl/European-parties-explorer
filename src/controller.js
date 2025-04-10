import ScatterPlot from './views/scatterPlot.js'
import LineChart from './views/lineChart.js'
import ParallelCoordinates from './views/parallelCoordinates.js'
import BoxPlot from './views/boxPlot.js'
import createFilters from './views/filters.js'
import { countries, factions } from './utils.js'
import * as d3 from 'd3'

// Handles charts and interaction
export default class Controller {
  constructor (dataset) {
    // Default filters - not needed but keeping them here for debugging
    this.year = 2024
    this.countries = countries
    this.factions = factions

    this.scatterPlot = new ScatterPlot(document.getElementById('scatter-container'), dataset, this)
    this.lineChart = new LineChart(document.getElementById('line-container'), dataset, this)
    this.parallelCoordinates = new ParallelCoordinates(document.getElementById('parallel-container'), dataset, this)
    this.boxPlot = new BoxPlot(document.getElementById('boxplots-container'), dataset, this)

    this.brushFromScatter = new Set() // Data selected on the scatter plot
    this.brushFromParallel = new Set() // Data selected on the parallel coordinates

    this.scatterPlot.initialize()
    this.lineChart.initialize()
    this.parallelCoordinates.initialize()
    this.boxPlot.initialize()
    createFilters(document.getElementById('filters-container'), this)
  }

  // Handle filters
  updateYear (year) {
    this.year = year
    this.scatterPlot.updateYear(year)
    this.lineChart.updateYear(year)
    this.parallelCoordinates.updateYear(year)
    this.boxPlot.updateYear(year)
    // console.log('Year set to', this.year)
    this.applyBrush() // Mantain brushed elements when redrawing
  }

  addCountry (id, name) {
    this.countries[id] = name
    this.scatterPlot.addCountry(id, name)
    this.lineChart.addCountry(id, name)
    this.parallelCoordinates.addCountry(id, name)
    this.boxPlot.addCountry(id, name)
    // console.log('Added country', id, name, '- Current countries:', this.countries)
    this.applyBrush() // Mantain brushed elements when redrawing
  }

  removeCountry (id) {
    delete this.countries[id]
    this.scatterPlot.removeCountry(id)
    this.lineChart.removeCountry(id)
    this.parallelCoordinates.removeCountry(id)
    this.boxPlot.removeCountry(id)
    // console.log('Removed country', id, '- Current countries:', this.countries)
    this.applyBrush() // Mantain brushed elements when redrawing
  }

  addFaction (id, name) {
    this.factions[id] = name
    this.scatterPlot.addFaction(id, name)
    this.lineChart.addFaction(id, name)
    this.parallelCoordinates.addFaction(id, name)
    this.boxPlot.addFaction(id, name)
    // console.log('Added faction', id, name, '- Current factions:', this.factions)
    this.applyBrush() // Mantain brushed elements when redrawing
  }

  removeFaction (id) {
    delete this.factions[id]
    this.scatterPlot.removeFaction(id)
    this.lineChart.removeFaction(id)
    this.parallelCoordinates.removeFaction(id)
    this.boxPlot.removeFaction(id)
    // console.log('Removed faction', id, '- Current factions:', this.factions)
    this.applyBrush() // Mantain brushed elements when redrawing
  }

  // Handle brushes
  applyBrushFromScatter (data) { // Scatter plot was brushed
    this.brushFromScatter = new Set(data)
    this.applyBrush()
  }

  applyBrushFromParallel (data) { // Parallel coordinates were brushed
    this.brushFromParallel = new Set(data)
    this.applyBrush()
  }

  resetBrush () {
    this.brushFromScatter = new Set()
    this.brushFromParallel = new Set()

    this.scatterPlot.svg.select('.brushArea').call(d3.brush().move, null)
    this.parallelCoordinates.svg.selectAll('.axis').call(d3.brush().move, null)

    this.applyBrush()
  }

  applyBrush () {
    const scatterHasBrush = this.brushFromScatter.size > 0
    const parallelHasBrush = this.brushFromParallel.size > 0
    let selection

    if (scatterHasBrush && parallelHasBrush) {
      selection = new Set([...this.brushFromScatter].filter(party => this.brushFromParallel.has(party))) // Intersection
    } else if (scatterHasBrush) {
      selection = this.brushFromScatter
    } else if (parallelHasBrush) {
      selection = this.brushFromParallel
    } else {
      selection = null
    }

    // Color the charts
    this.scatterPlot.applyBrush(selection)
    this.lineChart.applyBrush(selection)
    this.parallelCoordinates.applyBrush(selection)
    this.boxPlot.applyBrush(selection)
  }

  applyHover (id) {
    this.scatterPlot.applyHover(id)
    this.lineChart.applyHover(id)
    this.parallelCoordinates.applyHover(id)
  }

  clearHover (id) {
    this.scatterPlot.clearHover(id)
    this.lineChart.clearHover(id)
    this.parallelCoordinates.clearHover(id)
  }
}
