<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { formatDate } from '../../utils';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer
]);

// 定义组件属性
interface Props {
  data: Array<{
    date: string;
    count: number;
  }>;
  loading?: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: '350px'
});

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null);
// 图表实例
let chartInstance: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);
  
  // 设置图表配置
  updateChart();
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', handleResize);
};

// 更新图表数据和配置
const updateChart = () => {
  if (!chartInstance) return;
  
  // 处理数据
  const xAxisData = props.data.map(item => item.date);
  const seriesData = props.data.map(item => item.count);
  
  // 设置图表配置
  const option = {
    title: {
      text: 'JS错误趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const data = params[0];
        return `${data.name}<br/>${data.seriesName}: ${data.value}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        formatter: (value: string) => {
          return formatDate(value, 'MM-DD');
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '错误数',
      nameTextStyle: {
        padding: [0, 0, 0, 40]
      }
    },
    series: [
      {
        name: '错误数',
        type: 'line',
        data: seriesData,
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#E6A23C'
        },
        itemStyle: {
          color: '#E6A23C'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(230, 162, 60, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(230, 162, 60, 0.1)'
            }
          ])
        }
      }
    ]
  };
  
  // 设置加载状态
  if (props.loading) {
    chartInstance.showLoading({
      text: '加载中...',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14
    });
  } else {
    chartInstance.hideLoading();
    // 更新图表
    chartInstance.setOption(option);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize();
};

// 监听数据变化
watch(() => props.data, updateChart, { deep: true });
watch(() => props.loading, updateChart);

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <el-card class="error-trend-chart" shadow="hover">
    <div ref="chartRef" :style="{ height, width: '100%' }"></div>
  </el-card>
</template>

<style scoped>
.error-trend-chart {
  width: 100%;
}
</style>
