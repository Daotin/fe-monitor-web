import { get, post } from './request';

// 接口返回类型定义
export interface StatsResponse {
  pvCount: number;
  uvCount: number;
  jsErrorCount: number;
  lcpAvg: number;
}

export interface ErrorTrendItem {
  date: string;
  count: number;
}

export interface ErrorItem {
  fingerprint: string;
  message: string;
  type: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  sampleEventId: string;
}

export interface ErrorListResponse {
  items: ErrorItem[];
  total: number;
}

export interface PerformanceSummary {
  lcp: {
    avg: number;
    p75: number;
  };
  fcp: {
    avg: number;
    p75: number;
  };
}

export interface SlowPage {
  url: string;
  value: number;
}

export interface ResourceError {
  eventId: string;
  url: string;
  type: string;
  tagName: string;
  status: number | null;
  timestamp: string;
}

export interface EventDetail {
  id: string;
  appId: string;
  userId: string;
  type: string;
  subType: string;
  timestamp: string;
  payload: {
    message: string;
    stack: string;
    parsedStack?: Array<{
      file: string;
      line: number;
      column: number;
      func: string;
    }>;
    meta: {
      url: string;
      browser: string;
      os: string;
      device: string;
      [key: string]: any;
    };
    behaviorStack?: Array<{
      type: string;
      [key: string]: any;
      timestamp: number;
    }>;
    rrwebData?: Array<{
      type: number;
      data: any;
      timestamp: number;
    }>;
  };
  createdAt: string;
}

// API接口函数

// 获取概览页的核心统计指标
export function getStats(appId: string, startTime: string, endTime: string) {
  return get<StatsResponse>('/stats', { appId, startTime, endTime });
}

// 获取JS错误数量的时间趋势数据
export function getErrorTrend(appId: string, startTime: string, endTime: string, interval: string = 'day') {
  return get<ErrorTrendItem[]>('/stats/error-trend', { appId, startTime, endTime, interval });
}

// 获取聚合后的JS错误列表
export function getErrors(
  appId: string, 
  startTime: string, 
  endTime: string, 
  page: number = 1, 
  limit: number = 20, 
  sortBy: string = 'lastSeen_desc'
) {
  return get<ErrorListResponse>('/errors', { appId, startTime, endTime, page, limit, sortBy });
}

// 获取单个事件实例的详细信息
export function getEventDetail(eventId: string) {
  return get<EventDetail>(`/events/${eventId}`);
}

// 获取核心Web Vitals性能指标概览
export function getPerformanceSummary(appId: string, startTime: string, endTime: string) {
  return get<PerformanceSummary>('/performance/summary', { appId, startTime, endTime });
}

// 获取加载最慢的页面列表
export function getSlowPages(
  appId: string, 
  startTime: string, 
  endTime: string, 
  metric: string = 'lcp', 
  limit: number = 5
) {
  return get<SlowPage[]>('/performance/slow-pages', { appId, startTime, endTime, metric, limit });
}

// 获取资源加载错误列表
export function getResourceErrors(appId: string, startTime: string, endTime: string, limit: number = 20) {
  return get<ResourceError[]>('/performance/resource-errors', { appId, startTime, endTime, limit });
}

// 上传SourceMap文件
export function uploadSourceMap(appId: string, mapFile: File) {
  const formData = new FormData();
  formData.append('mapFile', mapFile);
  
  return post<{ message: string; appId: string; uploadedAt: string }>(`/sourcemaps/${appId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
