<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <div ref="chartContainer" class="d3-chart-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'D3Chart',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    chartType: {
      type: String,
      default: 'area'
    }
  },
  data() {
    return {
      svg: null,
      width: 0,
      height: 300,
      margin: { top: 20, right: 30, bottom: 40, left: 50 }
    }
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
    this.createChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      const container = this.$refs.chartContainer
      this.width = container.clientWidth - this.margin.left - this.margin.right
      
      d3.select(container).selectAll('*').remove()
      
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    },
    
    createChart() {
      if (!this.data || this.data.length === 0) return
      
      if (this.chartType === 'area') {
        this.createAreaChart()
      } else if (this.chartType === 'scatter') {
        this.createScatterPlot()
      } else {
        this.createLineChart()
      }
    },
    
    createAreaChart() {
      const xScale = d3.scaleTime()
        .domain(d3.extent(this.data, d => new Date(d.time)))
        .range([0, this.width])
      
      const yScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.value))
        .nice()
        .range([this.height, 0])
      
      const area = d3.area()
        .x(d => xScale(new Date(d.time)))
        .y0(this.height)
        .y1(d => yScale(d.value))
        .curve(d3.curveMonotoneX)
      
      const line = d3.line()
        .x(d => xScale(new Date(d.time)))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX)
      
      // Add gradient
      const gradient = this.svg.append('defs')
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', this.height)
        .attr('x2', 0).attr('y2', 0)
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#3b82f6')
        .attr('stop-opacity', 0.1)
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#3b82f6')
        .attr('stop-opacity', 0.8)
      
      // Add area
      this.svg.append('path')
        .datum(this.data)
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area)
      
      // Add line
      this.svg.append('path')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line)
      
      // Add axes
      this.svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M')))
      
      this.svg.append('g')
        .call(d3.axisLeft(yScale))
      
      // Add dots
      this.svg.selectAll('.dot')
        .data(this.data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(new Date(d.time)))
        .attr('cy', d => yScale(d.value))
        .attr('r', 3)
        .attr('fill', '#3b82f6')
        .on('mouseover', (event, d) => {
          // Tooltip logic
          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
          
          tooltip.transition()
            .duration(200)
            .style('opacity', .9)
          
          tooltip.html(`Time: ${d.time}<br/>Value: ${d.value}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
        })
        .on('mouseout', () => {
          d3.selectAll('.tooltip').remove()
        })
    },
    
    createScatterPlot() {
      const xScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.x))
        .nice()
        .range([0, this.width])
      
      const yScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.y))
        .nice()
        .range([this.height, 0])
      
      // Add dots
      this.svg.selectAll('.dot')
        .data(this.data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#10b981')
        .attr('opacity', 0.7)
      
      // Add axes
      this.svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(xScale))
      
      this.svg.append('g')
        .call(d3.axisLeft(yScale))
    },
    
    createLineChart() {
      const xScale = d3.scaleTime()
        .domain(d3.extent(this.data, d => new Date(d.time)))
        .range([0, this.width])
      
      const yScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.value))
        .nice()
        .range([this.height, 0])
      
      const line = d3.line()
        .x(d => xScale(new Date(d.time)))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX)
      
      // Add line
      this.svg.append('path')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('d', line)
      
      // Add axes
      this.svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M')))
      
      this.svg.append('g')
        .call(d3.axisLeft(yScale))
    },
    
    updateChart() {
      this.svg.selectAll('*').remove()
      this.createChart()
    },
    
    handleResize() {
      this.initChart()
      this.createChart()
    }
  }
}
</script>

<style scoped>
.d3-chart-container {
  width: 100%;
  min-height: 300px;
}

h3 {
  margin-bottom: 1rem;
  color: #1f2937;
  font-weight: 600;
}

:deep(.tooltip) {
  position: absolute;
  text-align: center;
  padding: 8px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  pointer-events: none;
}
</style>
