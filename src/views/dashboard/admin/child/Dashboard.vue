<template>
  <div class="flex flex-col h-full overflow-auto bg-gray-100 dark:bg-background p-4 gap-8">
    <h1 class="text-2xl font-bold mb-8">Dữ liệu tổng quan</h1>
    <div class="flex gap-4 w-full">
      <div class="w-1/2 bg-white dark:bg-card p-4 rounded-lg shadow-lg">
        <Chart :options="viettelPostAreaChartOptions" />
      </div>
      <div class="w-1/2 bg-white dark:bg-card p-4 rounded-lg shadow-lg">
        <Chart :options="ghnAreaChartOptions" />
      </div>
    </div>
    <div class="flex gap-4 w-full">
      <div class="w-1/2 bg-white dark:bg-card p-4 rounded-lg shadow-lg">
        <Chart :options="ticketLineChartOptions" />
      </div>
      <div class="w-1/2 bg-white dark:bg-card p-4 rounded-lg shadow-lg">
        <Chart :options="ticketLineChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart } from 'highcharts-vue'
import { onMounted } from 'vue'

const viettelPostAreaChartOptions = {
  chart: {
    type: 'area',
    height: 400,
    backgroundColor: 'transparent',
  },

  lang: {
    decimalPoint: '.', // English format
    thousandsSep: ',', // English format
  },

  title: {
    text: 'Viettel Post - 7 ngày gần nhất',
    align: 'left',
    style: { fontSize: '18px', fontWeight: '600', color: '#1f2937' },
  },

  subtitle: {
    text: 'Trạng thái đơn hàng theo ngày',
    align: 'left',
    style: { color: '#6b7280', fontSize: '13px' },
  },

  xAxis: {
    categories: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2025, 9, 26 + i) // Oct 26 → Nov 1
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    labels: {
      style: { fontSize: '12px', color: '#4b5563' },
    },
  },

  yAxis: {
    title: { text: 'Số lượng đơn hàng' },
    min: 0,
    stackLabels: {
      enabled: true,
      style: { fontWeight: 'bold', color: '#374151' },
    },
  },

  tooltip: {
    shared: true,
    backgroundColor: 'rgba(0,0,0,0.85)',
    style: { color: '#fff' },
    formatter: function () {
      let s = `<b>${this.x}</b><br/>Total: <b>${this.points.reduce((a, b) => a + b.y, 0)}</b><br/>`
      this.points.forEach((p) => {
        s += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b><br/>`
      })
      return s
    },
  },

  plotOptions: {
    area: {
      stacking: 'normal',
      lineWidth: 2,
      marker: { enabled: false },
      fillOpacity: 0.8,
    },
  },

  legend: {
    align: 'right',
    verticalAlign: 'top',
    layout: 'vertical',
  },

  credits: { enabled: false },
  exporting: { enabled: true },

  series: [
    {
      name: 'Đã lấy',
      data: [95, 102, 98, 110, 115, 108, 112],
      color: '#3b82f6',
    },
    {
      name: 'Đang chuyển',
      data: [88, 92, 95, 98, 102, 100, 97],
      color: '#8b5cf6',
    },
    {
      name: 'Đã đến trung tâm',
      data: [75, 78, 80, 82, 85, 83, 80],
      color: '#f59e0b',
    },
    {
      name: 'Đang giao hàng',
      data: [65, 68, 70, 73, 76, 74, 72],
      color: '#f97316',
    },
    {
      name: 'Đã giao',
      data: [120, 125, 130, 135, 138, 142, 145],
      color: '#10b981',
    },
  ],
}

const ghnAreaChartOptions = {
  chart: {
    type: 'area',
    height: 400,
    backgroundColor: 'transparent',
  },

  lang: {
    decimalPoint: '.', // English format
    thousandsSep: ',', // English format
  },

  title: {
    text: 'GHN - 7 ngày gần nhất',
    align: 'left',
    style: { fontSize: '18px', fontWeight: '600', color: '#1f2937' },
  },

  subtitle: {
    text: 'Trạng thái đơn hàng theo ngày',
    align: 'left',
    style: { color: '#6b7280', fontSize: '13px' },
  },

  xAxis: {
    categories: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2025, 9, 26 + i)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    labels: {
      style: { fontSize: '12px', color: '#4b5563' },
    },
  },

  yAxis: {
    title: { text: 'Số lượng đơn hàng' },
    min: 0,
    stackLabels: {
      enabled: true,
      style: { fontWeight: 'bold', color: '#374151' },
    },
  },

  tooltip: {
    shared: true,
    backgroundColor: 'rgba(0,0,0,0.85)',
    style: { color: '#fff' },
    formatter: function () {
      let s = `<b>${this.x}</b><br/>Total: <b>${this.points.reduce((a, b) => a + b.y, 0)}</b><br/>`
      this.points.forEach((p) => {
        s += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b><br/>`
      })
      return s
    },
  },

  plotOptions: {
    area: {
      stacking: 'normal',
      lineWidth: 2,
      marker: { enabled: false },
      fillOpacity: 0.8,
    },
  },

  legend: {
    align: 'right',
    verticalAlign: 'top',
    layout: 'vertical',
  },

  credits: { enabled: false },
  exporting: { enabled: true },

  series: [
    {
      name: 'Đã lấy',
      data: [82, 88, 85, 92, 95, 90, 93],
      color: '#06b6d4',
    },
    {
      name: 'Đang chuyển',
      data: [78, 80, 82, 85, 88, 86, 84],
      color: '#8b5cf6',
    },
    {
      name: 'Đã đến trung tâm',
      data: [68, 70, 72, 74, 76, 75, 73],
      color: '#f59e0b',
    },
    {
      name: 'Đang giao hàng',
      data: [58, 60, 62, 64, 66, 65, 63],
      color: '#f97316',
    },
    {
      name: 'Đã giao',
      data: [105, 108, 112, 115, 118, 120, 122],
      color: '#10b981',
    },
  ],
}

const ticketLineChartOptions = {
  chart: {
    type: 'line',
    height: 420,
    backgroundColor: 'transparent',
  },

  lang: {
    decimalPoint: '.', // English format
    thousandsSep: ',', // English format
  },

  title: {
    text: 'Ticket - 7 ngày gần nhất',
    align: 'left',
    style: { fontSize: '18px', fontWeight: '600', color: '#1f2937' },
  },

  subtitle: {
    text: 'Trạng thái ticket',
    align: 'left',
    style: { color: '#6b7280', fontSize: '13px' },
  },

  xAxis: {
    categories: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2025, 9, 26 + i)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    labels: { style: { fontSize: '12px', color: '#4b5563' } },
  },

  yAxis: {
    title: { text: 'Số lượng ticket', style: { color: '#4b5563', fontWeight: '500' } },
    min: 0,
    gridLineColor: '#e5e7eb',
  },

  tooltip: {
    shared: true,
    backgroundColor: 'rgba(0,0,0,0.85)',
    style: { color: '#fff' },
    borderRadius: 6,
    formatter: function () {
      let s = `<b>${this.x}</b><br/>`
      this.points.forEach((p) => {
        s += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b><br/>`
      })
      return s
    },
  },

  plotOptions: {
    line: {
      lineWidth: 3,
      marker: { enabled: false },
      states: { hover: { lineWidthPlus: 2 } },
    },
  },

  legend: {
    align: 'right',
    verticalAlign: 'top',
    layout: 'vertical',
    itemStyle: { fontWeight: '500', color: '#374151' },
  },

  credits: { enabled: false },
  exporting: { enabled: true },

  series: [
    {
      name: 'Mới tạo',
      data: [28, 32, 30, 35, 38, 33, 31],
      color: '#3b82f6',
      marker: { symbol: 'circle' },
    },
    {
      name: 'Đang xử lý',
      data: [25, 28, 27, 30, 32, 29, 27],
      color: '#f59e0b',
      marker: { symbol: 'square' },
    },
    {
      name: 'Hết hạn',
      data: [3, 4, 5, 6, 7, 6, 5],
      color: '#ef4444',
      dashStyle: 'ShortDash',
      marker: { symbol: 'triangle-down' },
    },
    {
      name: 'Hoàn thành',
      data: [20, 23, 26, 29, 32, 34, 36],
      color: '#10b981',
      marker: { symbol: 'diamond' },
    },
  ],
}
</script>
