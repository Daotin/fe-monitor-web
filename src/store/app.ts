import { defineStore } from 'pinia';

// 定义时间范围类型
export type TimeRange = 'today' | 'yesterday' | '7days' | '30days' | '90days';

// 定义应用状态接口
interface AppState {
  appId: string;
  timeRange: TimeRange;
  startTime: string;
  endTime: string;
}

// 创建应用状态
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    appId: 'default-app-id', // 默认应用ID
    timeRange: '7days', // 默认时间范围
    startTime: '', // 开始时间，由timeRange计算得出
    endTime: '' // 结束时间，默认为当前时间
  }),
  
  getters: {
    getAppId: (state) => state.appId,
    getTimeRange: (state) => state.timeRange,
    getStartTime: (state) => state.startTime,
    getEndTime: (state) => state.endTime
  },
  
  actions: {
    // 设置应用ID
    setAppId(appId: string) {
      this.appId = appId;
    },
    
    // 设置时间范围
    setTimeRange(timeRange: TimeRange) {
      this.timeRange = timeRange;
      this.updateTimeRange();
    },
    
    // 更新时间范围
    updateTimeRange() {
      const now = new Date();
      const endTime = new Date(now);
      let startTime = new Date(now);
      
      // 根据选择的时间范围计算开始时间
      switch (this.timeRange) {
        case 'today':
          startTime.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startTime.setDate(startTime.getDate() - 1);
          startTime.setHours(0, 0, 0, 0);
          endTime.setDate(endTime.getDate() - 1);
          endTime.setHours(23, 59, 59, 999);
          break;
        case '7days':
          startTime.setDate(startTime.getDate() - 7);
          break;
        case '30days':
          startTime.setDate(startTime.getDate() - 30);
          break;
        case '90days':
          startTime.setDate(startTime.getDate() - 90);
          break;
        default:
          startTime.setDate(startTime.getDate() - 7);
      }
      
      // 更新状态
      this.startTime = startTime.toISOString();
      this.endTime = endTime.toISOString();
      
      console.log('时间范围已更新:', {
        timeRange: this.timeRange,
        startTime: this.startTime,
        endTime: this.endTime
      });
    }
  }
});
