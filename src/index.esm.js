/**
 * Data Reporter 模块用于向服务器发送数据，支持 Beacon、Image、XHR 和 Fetch 等多种上报方式
 */

/**
 * 将数据发送到服务器的 DataReporter 类
 */
class DataReporter {
  /**
   * 使用 Beacon API 发送数据
   * @param {string} url - 要发送数据的 URL
   * @param {Object|Array} data - 要发送的数据
   * @returns {boolean} - 如果数据发送成功，则返回 true
   */
  sendByBeacon(url, data) {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json; charset=UTF-8' });
      return navigator.sendBeacon(url, blob);
    }
    return false;
  }

  /**
   * 使用 Image API 发送数据（对于非常小的有效负载）
   * @param {string} url - 要发送数据的 URL
   * @param {Object} data - 要发送的数据
   * @returns {boolean} - 如果请求已发起，则返回 true
   */
  sendByImage(url, data) {
    try {
      const img = new Image();
      const params = Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(data[key]))}`)
        .join('&');
      img.src = `${url}?${params}`;
      return true; // 无法确认是否成功，默认认为发起即成功
    } catch (e) {
      console.error('Image beacon 失败:', e);
      return false;
    }
  }

  /**
   * 使用 XMLHttpRequest 发送数据
   * @param {string} url - 要发送数据的 URL
   * @param {Object|Array} data - 要发送的数据
   * @returns {boolean} - 如果请求已发起，则返回 true
   */
  sendByXHR(url, data) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true); // 异步
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      return true; // 异步无法立即确认成功
    } catch (e) {
      console.error('XHR 上报失败:', e);
      return false;
    }
  }

  /**
   * 使用 fetch API 发送数据
   * @param {string} url - 要发送数据的 URL
   * @param {Object|Array} data - 要发送的数据
   * @returns {Promise} - 一个解析为数据发送成功的 Promise
   */
  sendByFetch(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch((e) => {
      console.error('Fetch 上报失败:', e);
      return false;
    });
  }

  /**
   * 主上报方法，尝试不同的上报方式
   * @param {string} url - 要发送数据的 URL
   * @param {Object|Array} data - 要发送的数据
   * @returns {boolean} - 如果数据发送成功，则返回 true
   */
  report(url, data) {
    if (typeof window === 'undefined') {
      console.error('不是浏览器环境，无法上报');
      return false;
    }

    console.log('🟢report上报数据:', data);
    return true;
  }
}

var DataReporter$1 = new DataReporter();

/**
 * Utility functions for the monitoring SDK
 */

/**
 * Check if a value is an object
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is an object
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if a value is a function
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a function
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Check if a value is a string
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a string
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if a value is a number
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a number
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Get browser information
 * @returns {Object} - Browser information
 */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  const browser = {
    userAgent: ua,
    name: 'unknown',
    version: 'unknown',
  };

  // Extract browser name and version
  const browserRegexes = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
    { name: 'Edge', regex: /Edg(e|)\/([0-9.]+)/ },
    { name: 'IE', regex: /Trident.*rv:([0-9.]+)/ },
  ];

  for (const { name, regex } of browserRegexes) {
    const match = ua.match(regex);
    if (match) {
      browser.name = name;
      browser.version = match[1] || match[2] || 'unknown';
      break;
    }
  }

  return browser;
}

/**
 * Get device information
 * @returns {Object} - Device information
 */
function getDeviceInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    platform: navigator.platform,
    language: navigator.language,
  };
}

/**
 * Generate a unique ID
 * @returns {string} - A unique ID
 */
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Throttle a function
 * @param {Function} fn - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Debounce a function
 * @param {Function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Get the current page URL
 * @returns {string} - The current page URL
 */
function getCurrentPageUrl() {
  return window.location.href;
}

/**
 * Get the current page path
 * @returns {string} - The current page path
 */
function getCurrentPagePath() {
  return window.location.pathname;
}

/**
 * Get the current timestamp
 * @returns {number} - The current timestamp
 */
function getTimestamp() {
  return Date.now();
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  debounce: debounce,
  generateUniqueId: generateUniqueId,
  getBrowserInfo: getBrowserInfo,
  getCurrentPagePath: getCurrentPagePath,
  getCurrentPageUrl: getCurrentPageUrl,
  getDeviceInfo: getDeviceInfo,
  getTimestamp: getTimestamp,
  isFunction: isFunction,
  isNumber: isNumber,
  isObject: isObject,
  isString: isString,
  throttle: throttle
});

/**
 * JS 错误监控插件
 * 捕获 JavaScript 运行时错误和未处理的 Promise 拒绝
 */

class JSErrorPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'jsError';
  }

  /**
   * 处理 JS 运行时错误
   * @param {string} message - 错误信息
   * @param {string} filename - 发生错误的文件
   * @param {number} lineno - 行号
   * @param {number} colno - 列号
   * @param {Error} error - 错误对象
   * @returns {boolean} - 返回 true 可以阻止浏览器默认的错误处理
   */
  handleError = (message, filename, lineno, colno, error) => {
    this.monitor.send({
      type: 'error',
      subType: 'js',
      message: message,
      filename: filename,
      lineno: lineno,
      colno: colno,
      stack: error ? error.stack : '未获取到堆栈信息',
      level: 'error',
      startTime: performance.now(),
    });

    // 返回 true 可以阻止浏览器默认的错误处理
    return true;
  };

  /**
   * 处理未捕获的 Promise 拒绝
   * @param {PromiseRejectionEvent} event - Promise 拒绝事件对象
   */
  handleUnhandledRejection = (event) => {
    let reason = event.reason;
    let message = 'Promise 拒绝';
    let stack = '未获取到堆栈信息';

    if (reason instanceof Error) {
      message = reason.message;
      stack = reason.stack;
    } else {
      message = String(reason);
    }

    this.monitor.send({
      type: 'error',
      subType: 'promise',
      message: message,
      stack: stack,
      level: 'error',
      startTime: event.timeStamp,
    });
  };

  /**
   * 初始化插件
   */
  init() {
    // 使用 window.onerror 捕获 JS 错误
    window.onerror = this.handleError;

    // 使用 addEventListener 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  /**
   * 销毁插件，清理事件监听
   */
  destroy() {
    window.onerror = null;
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }
}

/**
 * 资源错误监控插件
 * 捕获资源（图片、脚本、CSS 等）加载失败的错误
 */

class ResourceErrorPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'resourceError';
  }

  /**
   * 处理资源加载错误
   * @param {ErrorEvent} event - 错误事件对象
   */
  handleResourceError = (event) => {
    const target = event.target;
    
    // 检查是否是资源加载错误（具有 src 或 href 属性的元素）
    if (target && (target.src || target.href)) {
      const url = target.src || target.href;
      
      this.monitor.send({
        type: 'error',
        subType: 'resource',
        url: url,
        tagName: target.tagName.toLowerCase(),
        html: target.outerHTML,
        level: 'warning', // 资源错误通常级别较低
        paths: event.path || event.composedPath && event.composedPath(), // 获取事件路径
        startTime: performance.now(),
      });
    }
  };

  /**
   * 初始化插件
   */
  init() {
    // 使用捕获阶段监听 error 事件，以捕获资源加载错误
    window.addEventListener('error', this.handleResourceError, true);
  }

  /**
   * 销毁插件，清理事件监听
   */
  destroy() {
    window.removeEventListener('error', this.handleResourceError, true);
  }
}

/**
 * HTTP 请求错误监控插件
 * 通过重写 XMLHttpRequest 和 fetch 来捕获 HTTP 请求错误
 */

class HttpErrorPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'httpError';
    
    // 保存原始方法
    this.originalXhrOpen = XMLHttpRequest.prototype.open;
    this.originalXhrSend = XMLHttpRequest.prototype.send;
    this.originalFetch = window.fetch;
  }

  /**
   * 重写 XMLHttpRequest 方法
   */
  patchXMLHttpRequest() {
    const monitor = this.monitor;
    const originalOpen = this.originalXhrOpen;
    const originalSend = this.originalXhrSend;

    // 重写 open 方法
    XMLHttpRequest.prototype.open = function(...args) {
      const method = args[0];
      const url = args[1];
      
      // 保存请求信息到 xhr 对象
      this._monitorData = {
        method,
        url,
        startTime: Date.now(),
      };
      
      return originalOpen.apply(this, args);
    };

    // 重写 send 方法
    XMLHttpRequest.prototype.send = function(body) {
      if (this._monitorData) {
        // 保存请求体
        this._monitorData.body = body;
        
        // 监听 load 事件
        this.addEventListener('load', function() {
          const status = this.status;
          const duration = Date.now() - this._monitorData.startTime;
          
          // 只报告错误状态码
          if (status >= 400) {
            monitor.send({
              type: 'error',
              subType: 'http',
              method: this._monitorData.method,
              url: this._monitorData.url,
              status,
              duration,
              response: this.responseText && this.responseText.slice(0, 500), // 限制响应大小
              level: status >= 500 ? 'error' : 'warning',
              startTime: this._monitorData.startTime,
            });
          }
        });

        // 监听 error 事件
        this.addEventListener('error', function() {
          const duration = Date.now() - this._monitorData.startTime;
          
          monitor.send({
            type: 'error',
            subType: 'http',
            method: this._monitorData.method,
            url: this._monitorData.url,
            status: 0, // 网络错误通常没有状态码
            duration,
            level: 'error',
            startTime: this._monitorData.startTime,
            message: '网络请求失败',
          });
        });

        // 监听 timeout 事件
        this.addEventListener('timeout', function() {
          const duration = Date.now() - this._monitorData.startTime;
          
          monitor.send({
            type: 'error',
            subType: 'http',
            method: this._monitorData.method,
            url: this._monitorData.url,
            status: 0,
            duration,
            level: 'error',
            startTime: this._monitorData.startTime,
            message: '请求超时',
          });
        });
      }
      
      return originalSend.apply(this, arguments);
    };
  }

  /**
   * 重写 fetch 方法
   */
  patchFetch() {
    const monitor = this.monitor;
    const originalFetch = this.originalFetch;

    window.fetch = function(input, init) {
      const startTime = Date.now();
      let url = '';
      let method = 'GET';
      
      // 解析请求参数
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof Request) {
        url = input.url;
        method = input.method || 'GET';
      }
      
      if (init && init.method) {
        method = init.method;
      }

      // 调用原始 fetch 并处理结果
      return originalFetch.apply(this, arguments)
        .then(response => {
          const duration = Date.now() - startTime;
          const status = response.status;
          
          // 只报告错误状态码
          if (status >= 400) {
            // 克隆响应以避免消耗原始响应
            const clonedResponse = response.clone();
            
            // 尝试获取响应文本
            clonedResponse.text().then(text => {
              monitor.send({
                type: 'error',
                subType: 'http',
                method,
                url,
                status,
                duration,
                response: text.slice(0, 500), // 限制响应大小
                level: status >= 500 ? 'error' : 'warning',
                startTime,
              });
            }).catch(() => {
              // 如果无法获取响应文本，仍然报告错误
              monitor.send({
                type: 'error',
                subType: 'http',
                method,
                url,
                status,
                duration,
                level: status >= 500 ? 'error' : 'warning',
                startTime,
                message: '无法读取响应内容',
              });
            });
          }
          
          return response;
        })
        .catch(error => {
          const duration = Date.now() - startTime;
          
          monitor.send({
            type: 'error',
            subType: 'http',
            method,
            url,
            status: 0,
            duration,
            level: 'error',
            startTime,
            message: error.message || '网络请求失败',
          });
          
          // 重新抛出错误，不影响原有的错误处理
          throw error;
        });
    };
  }

  /**
   * 初始化插件
   */
  init() {
    this.patchXMLHttpRequest();
    this.patchFetch();
  }

  /**
   * 销毁插件，恢复原始方法
   */
  destroy() {
    // 恢复原始 XMLHttpRequest 方法
    XMLHttpRequest.prototype.open = this.originalXhrOpen;
    XMLHttpRequest.prototype.send = this.originalXhrSend;
    
    // 恢复原始 fetch 方法
    window.fetch = this.originalFetch;
  }
}

/**
 * 框架错误监控插件
 * 用于捕获 Vue、React 等前端框架的错误
 */

class FrameworkErrorPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'frameworkError';
  }

  /**
   * 初始化 Vue 错误处理
   */
  setupVueErrorHandler() {
    // 检查全局 Vue 是否存在
    if (window.Vue) {
      const Vue = window.Vue;
      const monitor = this.monitor;
      
      // Vue 2.x
      if (Vue.config) {
        const originalErrorHandler = Vue.config.errorHandler;
        
        Vue.config.errorHandler = function(error, vm, info) {
          // 报告错误
          monitor.send({
            type: 'error',
            subType: 'vue',
            message: error.message,
            stack: error.stack,
            level: 'error',
            component: vm ? vm.$options.name || vm.$options._componentTag || 'anonymous' : 'unknown',
            info: info,
            startTime: performance.now(),
          });
          
          // 调用原始错误处理器
          if (originalErrorHandler) {
            originalErrorHandler.call(this, error, vm, info);
          } else {
            console.error(error);
          }
        };
      }
      
      // Vue 3.x
      if (Vue.createApp) {
        const originalCreateApp = Vue.createApp;
        
        Vue.createApp = function(...args) {
          const app = originalCreateApp.apply(this, args);
          const originalErrorHandler = app.config.errorHandler;
          
          app.config.errorHandler = function(error, instance, info) {
            // 报告错误
            monitor.send({
              type: 'error',
              subType: 'vue',
              message: error.message,
              stack: error.stack,
              level: 'error',
              component: instance ? instance.type.name || 'anonymous' : 'unknown',
              info: info,
              startTime: performance.now(),
            });
            
            // 调用原始错误处理器
            if (originalErrorHandler) {
              originalErrorHandler.call(this, error, instance, info);
            } else {
              console.error(error);
            }
          };
          
          return app;
        };
      }
    }
  }

  /**
   * 初始化 React 错误处理
   * 注意：React 需要使用 ErrorBoundary 组件捕获错误
   * 这里提供一个辅助方法，用户需要在自己的代码中使用
   */
  setupReactErrorHandler() {
    // 检查全局 React 是否存在
    if (window.React) {
      // 将 reportError 方法暴露给全局，以便 React 错误边界可以调用
      window.__monitorReportReactError = (error, errorInfo) => {
        this.monitor.send({
          type: 'error',
          subType: 'react',
          message: error.message,
          stack: error.stack,
          level: 'error',
          componentStack: errorInfo ? errorInfo.componentStack : null,
          startTime: performance.now(),
        });
      };
      
      // 提供使用说明
      console.info(`
        React 错误监控已启用。请在您的 React 应用中添加错误边界组件：
        
        class ErrorBoundary extends React.Component {
          constructor(props) {
            super(props);
            this.state = { hasError: false };
          }
          
          static getDerivedStateFromError(error) {
            return { hasError: true };
          }
          
          componentDidCatch(error, errorInfo) {
            // 报告错误
            if (window.__monitorReportReactError) {
              window.__monitorReportReactError(error, errorInfo);
            }
          }
          
          render() {
            if (this.state.hasError) {
              return <h1>出错了</h1>;
            }
            return this.props.children;
          }
        }
        
        然后在您的应用中使用：
        <ErrorBoundary>
          <YourComponent />
        </ErrorBoundary>
      `);
    }
  }

  /**
   * 初始化插件
   */
  init() {
    // 设置 Vue 错误处理
    this.setupVueErrorHandler();
    
    // 设置 React 错误处理
    this.setupReactErrorHandler();
  }

  /**
   * 销毁插件
   */
  destroy() {
    // 清理全局方法
    if (window.__monitorReportReactError) {
      delete window.__monitorReportReactError;
    }
    
    // 注意：Vue 的错误处理器无法轻易恢复，因为我们无法保存所有可能的 Vue 实例
  }
}

/**
 * 页面加载性能指标收集插件
 * 收集页面加载相关的性能指标，如 load、DOMContentLoaded 等
 */

class PageLoadPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'pageLoad';
    this.isInitialized = false;
  }

  /**
   * 处理页面显示事件
   * @param {Event} event - 页面显示事件对象
   */
  handlePageShow = (event) => {
    // 使用 requestAnimationFrame 确保在下一帧执行，避免阻塞页面渲染
    requestAnimationFrame(() => {
      // 收集页面加载性能指标
      const navigationTiming = this.getNavigationTiming();

      // 发送性能数据
      this.monitor.send({
        type: 'performance',
        subType: 'page-load',
        ...navigationTiming,
        // 如果是从缓存加载的页面，event.persisted 会为 true
        fromCache: event.persisted,
      });
    });
  };

  /**
   * 获取导航计时数据
   * @returns {Object} - 导航计时数据
   */
  getNavigationTiming() {
    // 使用 Performance API 获取导航计时数据
    const timing = performance.timing || {};
    const navigation = performance.navigation || {};

    // 如果支持 PerformanceNavigationTiming API，优先使用它
    let navigationEntry = null;
    if (typeof PerformanceNavigationTiming !== 'undefined') {
      const entries = performance.getEntriesByType('navigation');
      if (entries && entries.length > 0) {
        navigationEntry = entries[0];
      }
    }

    // 根据可用的 API 构建导航计时数据
    if (navigationEntry) {
      // 使用新的 PerformanceNavigationTiming API
      console.log('使用新的 PerformanceNavigationTiming API');
      return {
        // 页面加载总时间（单位：毫秒）
        loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
        // DOM 解析时间
        domContentLoadedTime: navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
        // 首字节时间 (TTFB)
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        // DNS 解析时间
        dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        // TCP 连接时间
        tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
        // 重定向时间
        redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
        // 请求响应时间
        requestTime: navigationEntry.responseEnd - navigationEntry.requestStart,
        // DOM 解析时间
        domParsingTime: navigationEntry.domInteractive - navigationEntry.responseEnd,
        // 资源加载时间
        resourceTime: navigationEntry.loadEventStart - navigationEntry.domContentLoadedEventEnd,
        // 导航类型
        navigationType: navigationEntry.type,
      };
    } else if (timing.navigationStart) {
      // 使用旧的 Performance Timing API
      return {
        // 页面加载总时间
        loadTime: timing.loadEventEnd - timing.navigationStart,
        // DOM 解析时间
        domContentLoadedTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        // 首字节时间 (TTFB)
        ttfb: timing.responseStart - timing.requestStart,
        // DNS 解析时间
        dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
        // TCP 连接时间
        tcpTime: timing.connectEnd - timing.connectStart,
        // 重定向时间
        redirectTime: timing.redirectEnd - timing.redirectStart,
        // 请求响应时间
        requestTime: timing.responseEnd - timing.requestStart,
        // DOM 解析时间
        domParsingTime: timing.domInteractive - timing.responseEnd,
        // 资源加载时间
        resourceTime: timing.loadEventStart - timing.domContentLoadedEventEnd,
        // 导航类型
        navigationType: navigation.type,
      };
    }

    // 如果都不支持，返回空对象
    return {};
  }

  /**
   * 初始化插件
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    // 监听 pageshow 事件，该事件在页面显示时触发，包括从缓存加载的情况
    window.addEventListener('pageshow', this.handlePageShow);

    this.isInitialized = true;
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    if (this.isInitialized) {
      window.removeEventListener('pageshow', this.handlePageShow);
      this.isInitialized = false;
    }
  }
}

/**
 * 资源加载性能收集插件
 * 使用 PerformanceObserver API 监听资源加载性能
 */

class ResourceLoadPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'resourceLoad';
    this.observer = null;
    this.isInitialized = false;
  }

  /**
   * 处理资源加载条目
   * @param {PerformanceObserverEntryList} list - 性能观察条目列表
   */
  handleEntries = (list) => {
    const entries = list.getEntries();
    
    for (const entry of entries) {
      // 过滤掉非资源类型的条目
      if (entry.entryType !== 'resource') {
        continue;
      }
      
      // 提取资源性能数据
      const resourceData = {
        type: 'performance',
        subType: 'resource',
        name: entry.name, // 资源的 URL
        initiatorType: entry.initiatorType, // 资源类型（如 img, script, css 等）
        startTime: entry.startTime, // 开始加载时间
        duration: entry.duration, // 加载总时间
        // DNS 解析时间
        dnsTime: entry.domainLookupEnd - entry.domainLookupStart,
        // TCP 连接时间
        tcpTime: entry.connectEnd - entry.connectStart,
        // 请求时间
        requestTime: entry.responseStart - entry.requestStart,
        // 响应时间
        responseTime: entry.responseEnd - entry.responseStart,
        // 重定向时间
        redirectTime: entry.redirectEnd - entry.redirectStart,
        // 首字节时间 (TTFB)
        ttfb: entry.responseStart - entry.startTime,
        // 资源大小信息
        decodedBodySize: entry.decodedBodySize, // 解码后的资源大小
        encodedBodySize: entry.encodedBodySize, // 编码后的资源大小
        transferSize: entry.transferSize, // 传输大小（包括头部）
        // 是否使用缓存
        fromCache: entry.transferSize === 0 && entry.decodedBodySize > 0,
      };
      
      // 发送资源性能数据
      this.monitor.send(resourceData);
    }
  };

  /**
   * 初始化插件
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    // 确保浏览器支持 PerformanceObserver
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('当前浏览器不支持 PerformanceObserver API，无法收集资源加载性能指标');
      return;
    }

    try {
      // 创建性能观察器
      this.observer = new PerformanceObserver(this.handleEntries);
      
      // 开始观察 resource 类型的条目
      this.observer.observe({ type: 'resource', buffered: true });
      
      this.isInitialized = true;
    } catch (error) {
      console.error('初始化资源加载性能监控失败:', error);
    }
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    this.isInitialized = false;
  }
}

/**
 * 首次绘制 (FP) 性能指标收集插件
 * 使用 PerformanceObserver API 监听 paint 事件
 */

class FirstPaintPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'firstPaint';
    this.observer = null;
  }

  /**
   * 处理 paint 条目
   * @param {PerformanceObserverEntryList} list - 性能观察条目列表
   */
  handleEntries = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-paint') {
        // 找到 FP 条目后断开观察器
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }

        // 发送性能数据
        this.monitor.send({
          type: 'performance',
          subType: 'first-paint',
          name: entry.name,
          startTime: entry.startTime, // FP时间点：从页面加载开始到首次绘制发生的时间，单位是毫秒
          duration: entry.duration,
          entryType: entry.entryType,
        });
      }
    }
  };

  /**
   * 初始化插件
   */
  init() {
    // 确保浏览器支持 PerformanceObserver
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('当前浏览器不支持 PerformanceObserver API，无法收集 FP 指标');
      return;
    }

    try {
      // 创建性能观察器
      this.observer = new PerformanceObserver(this.handleEntries);

      // 开始观察 paint 类型的条目，buffered: true 确保能捕获到已经发生的事件
      this.observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.error('初始化 FP 性能监控失败:', error);
    }
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * 首次内容绘制 (FCP) 性能指标收集插件
 * 使用 PerformanceObserver API 监听 paint 事件
 */

class FirstContentfulPaintPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'firstContentfulPaint';
    this.observer = null;
  }

  /**
   * 处理 paint 条目
   * @param {PerformanceObserverEntryList} list - 性能观察条目列表
   */
  handleEntries = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        // 找到 FCP 条目后断开观察器
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }

        // 提取性能数据
        entry.toJSON();
        
        // 发送性能数据
        this.monitor.send({
          type: 'performance',
          subType: 'first-contentful-paint',
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration,
          entryType: entry.entryType,
        });
      }
    }
  };

  /**
   * 初始化插件
   */
  init() {
    // 确保浏览器支持 PerformanceObserver
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('当前浏览器不支持 PerformanceObserver API，无法收集 FCP 指标');
      return;
    }

    try {
      // 创建性能观察器
      this.observer = new PerformanceObserver(this.handleEntries);
      
      // 开始观察 paint 类型的条目，buffered: true 确保能捕获到已经发生的事件
      this.observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.error('初始化 FCP 性能监控失败:', error);
    }
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * 最大内容绘制 (LCP) 性能指标收集插件
 * 使用 PerformanceObserver API 监听 largest-contentful-paint 事件
 */

class LargestContentfulPaintPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'largestContentfulPaint';
    this.observer = null;
    this.lastLCP = null;
  }

  /**
   * 处理 LCP 条目
   * @param {PerformanceObserverEntryList} list - 性能观察条目列表
   */
  handleEntries = (list) => {
    // LCP 可能会触发多次，我们需要记录最后一次
    const entries = list.getEntries();
    console.log('entries', entries);
    const lastEntry = entries[entries.length - 1];

    if (lastEntry) {
      this.lastLCP = lastEntry;
      console.log('lastLCP', this.lastLCP);
    }
  };

  /**
   * 上报最终的 LCP 值
   */
  reportFinalLCP = () => {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.lastLCP) {
      // 发送性能数据
      this.monitor.send({
        type: 'performance',
        subType: 'largest-contentful-paint',
        name: this.lastLCP.name,
        startTime: this.lastLCP.startTime,
        duration: this.lastLCP.duration,
        size: this.lastLCP.size,
        entryType: this.lastLCP.entryType,
        element: this.lastLCP.element ? this.getElementPath(this.lastLCP.element) : null,
        outerHtml: this.lastLCP.element ? this.lastLCP.element.outerHTML : null,
      });
    }
  };

  /**
   * 获取元素的选择器路径
   * @param {Element} element - DOM 元素
   * @returns {string} - 元素的选择器路径
   */
  getElementPath(element) {
    if (!element || !element.tagName) return '';

    let path = element.tagName.toLowerCase();
    if (element.id) {
      path += `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      path += `.${element.className.split(' ').join('.')}`;
    }

    return path;
  }

  /**
   * 初始化插件
   */
  init() {
    // 确保浏览器支持 PerformanceObserver
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('当前浏览器不支持 PerformanceObserver API，无法收集 LCP 指标');
      return;
    }

    try {
      // 创建性能观察器
      this.observer = new PerformanceObserver(this.handleEntries);

      // 开始观察 largest-contentful-paint 类型的条目
      this.observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // 在页面卸载前报告最终的 LCP 值
      // 当用户离开页面时，我们需要报告最后记录的 LCP 值
      ['visibilitychange', 'pagehide', 'beforeunload'].forEach((type) => {
        window.addEventListener(type, this.reportFinalLCP, { once: true });
      });
    } catch (error) {
      console.error('初始化 LCP 性能监控失败:', error);
    }
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    ['visibilitychange', 'pagehide', 'beforeunload'].forEach((type) => {
      window.removeEventListener(type, this.reportFinalLCP);
    });
  }
}

/**
 * 首屏加载时间计算插件
 * 通过监控页面元素加载情况，计算首屏内容完全呈现的时间
 */

class FirstScreenPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'firstScreen';
    this.isInitialized = false;
    
    // 首屏计算相关属性
    this.startTime = performance.now(); // 开始时间
    this.firstScreenTime = 0; // 首屏时间
    this.observerTimer = null; // 观察计时器
    this.mutationObserver = null; // DOM变化观察器
    this.domUpdateCounter = 0; // DOM更新计数器
    this.lastDomUpdateTime = 0; // 最后一次DOM更新时间
    this.stableTime = 0; // DOM稳定时间
    this.maxMutationCount = 10; // 最大DOM变化次数
    this.domStableTimeout = 1000; // DOM稳定超时时间(ms)
    this.maxWaitTime = 10000; // 最大等待时间(ms)
    this.checkInterval = 500; // 检查间隔(ms)
    this.hasReported = false; // 是否已上报
  }

  /**
   * 处理DOM变化
   * @param {MutationRecord[]} mutations - 变化记录列表
   */
  handleMutations = (mutations) => {
    // 记录DOM变化次数和时间
    this.domUpdateCounter++;
    this.lastDomUpdateTime = performance.now();
    
    // 检查变化的元素是否在首屏内
    let hasVisibleChange = false;
    
    for (const mutation of mutations) {
      // 只关注添加节点和属性变化
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // 检查添加的节点是否在首屏内
        if (mutation.addedNodes && mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && this.isInFirstScreen(node)) {
              hasVisibleChange = true;
              break;
            }
          }
        }
        
        // 检查属性变化的节点是否在首屏内
        if (!hasVisibleChange && mutation.target && mutation.target.nodeType === 1) {
          if (this.isInFirstScreen(mutation.target)) {
            hasVisibleChange = true;
          }
        }
      }
      
      if (hasVisibleChange) break;
    }
    
    // 如果有可见变化，更新首屏时间
    if (hasVisibleChange) {
      this.firstScreenTime = this.lastDomUpdateTime;
    }
  };

  /**
   * 检查元素是否在首屏内
   * @param {Element} element - DOM元素
   * @returns {boolean} - 是否在首屏内
   */
  isInFirstScreen(element) {
    // 忽略不可见元素
    if (!element || !element.getBoundingClientRect || this.isHidden(element)) {
      return false;
    }
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // 元素在视口内，且有一定大小
    return (
      rect.top < viewportHeight &&
      rect.left < viewportWidth &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  /**
   * 检查元素是否隐藏
   * @param {Element} element - DOM元素
   * @returns {boolean} - 是否隐藏
   */
  isHidden(element) {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
  }

  /**
   * 检查DOM是否稳定
   */
  checkDomStable = () => {
    const now = performance.now();
    
    // 如果已经上报过，不再检查
    if (this.hasReported) {
      return;
    }
    
    // 如果DOM已经稳定一段时间，或者超过最大等待时间，上报首屏时间
    if (
      (this.lastDomUpdateTime > 0 && now - this.lastDomUpdateTime > this.domStableTimeout) ||
      now - this.startTime > this.maxWaitTime ||
      this.domUpdateCounter >= this.maxMutationCount
    ) {
      this.reportFirstScreenTime();
    }
  };

  /**
   * 上报首屏时间
   */
  reportFirstScreenTime() {
    if (this.hasReported) {
      return;
    }
    
    // 停止观察
    this.stopObserving();
    
    // 如果没有记录到首屏时间，使用最后一次DOM更新时间或当前时间
    if (this.firstScreenTime === 0) {
      this.firstScreenTime = this.lastDomUpdateTime || performance.now();
    }
    
    // 计算首屏时间（相对于导航开始）
    const firstScreenTimeRelative = this.firstScreenTime - this.startTime;
    
    // 上报首屏时间
    this.monitor.send({
      type: 'performance',
      subType: 'first-screen',
      startTime: this.startTime,
      firstScreenTime: this.firstScreenTime,
      duration: firstScreenTimeRelative,
      domUpdateCount: this.domUpdateCounter,
    });
    
    this.hasReported = true;
  }

  /**
   * 开始观察DOM变化
   */
  startObserving() {
    // 创建MutationObserver
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(this.handleMutations);
      
      // 观察整个文档的变化
      this.mutationObserver.observe(document.documentElement, {
        childList: true, // 观察子节点变化
        subtree: true, // 观察所有后代节点
        attributes: true, // 观察属性变化
        characterData: false, // 不观察文本变化
      });
    }
    
    // 创建定时检查器
    this.observerTimer = setInterval(this.checkDomStable, this.checkInterval);
  }

  /**
   * 停止观察DOM变化
   */
  stopObserving() {
    // 停止MutationObserver
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    
    // 清除定时器
    if (this.observerTimer) {
      clearInterval(this.observerTimer);
      this.observerTimer = null;
    }
  }

  /**
   * 初始化插件
   */
  init() {
    if (this.isInitialized) {
      return;
    }
    
    // 记录开始时间
    this.startTime = performance.now();
    
    // 等待DOM准备好后开始观察
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.startObserving();
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        this.startObserving();
      });
    }
    
    // 页面加载完成后检查一次
    window.addEventListener('load', () => {
      // 如果还没有上报，等待一段时间后上报
      if (!this.hasReported) {
        setTimeout(() => {
          this.reportFirstScreenTime();
        }, this.domStableTimeout);
      }
    });
    
    this.isInitialized = true;
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    this.stopObserving();
    this.isInitialized = false;
  }
}

/**
 * 白屏检测插件
 * 通过采样对比和轮询检测机制，检测页面是否处于白屏状态
 */

class WhiteScreenPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'whiteScreen';
    this.isInitialized = false;

    // 白屏检测相关属性
    this.checkInterval = 1000; // 检查间隔(ms)
    this.maxCheckCount = 5; // 最大检查次数
    this.checkCount = 0; // 当前检查次数
    this.whiteScreenThreshold = 0.95; // 白屏阈值，超过95%的采样点为空时判定为白屏
    this.checkTimer = null; // 检查定时器
    this.hasReported = false; // 是否已上报

    // 可配置的采样方案
    this.sampleScheme = {
      light: [
        // 5点
        [0.1, 0.1],
        [0.9, 0.1],
        [0.5, 0.5],
        [0.1, 0.9],
        [0.9, 0.9],
      ],
      normal: [
        // 9点（默认）
        [0.1, 0.1],
        [0.5, 0.1],
        [0.9, 0.1],
        [0.1, 0.5],
        [0.5, 0.5],
        [0.9, 0.5],
        [0.1, 0.9],
        [0.5, 0.9],
        [0.9, 0.9],
      ],
      strict: [
        // 13点
        [0.0, 0.1],
        [0.1, 0.1],
        [0.5, 0.1],
        [0.9, 0.1],
        [1.0, 0.1],
        [0.1, 0.5],
        [0.5, 0.5],
        [0.9, 0.5],
        [0.0, 0.9],
        [0.1, 0.9],
        [0.5, 0.9],
        [0.9, 0.9],
        [1.0, 0.9],
      ],
    };

    this.sampleMode = 'normal'; // 可选: 'light', 'normal', 'strict'
    this.sampleCount = this.sampleScheme[this.sampleMode].length; // 5, 9, 13
  }

  /**
   * 检测页面是否白屏
   * @returns {boolean} - 是否白屏
   */
  checkWhiteScreen() {
    // 如果页面不可见，不进行检测
    if (document.hidden) {
      return false;
    }

    // 获取页面尺寸
    const { innerWidth, innerHeight } = window;

    // 如果页面尺寸为0，不进行检测
    if (innerWidth === 0 || innerHeight === 0) {
      return false;
    }

    // 采样点坐标
    const points = this.sampleScheme[this.sampleMode].map(([x, y]) => [innerWidth * x, innerHeight * y]);

    // 空白点计数
    let emptyCount = 0;

    // 检查每个采样点
    for (const [x, y] of points) {
      const element = document.elementFromPoint(x, y);

      // 如果采样点没有元素，或者是body/html元素，认为是空白
      if (!element || element.tagName === 'HTML' || element.tagName === 'BODY') {
        emptyCount++;
      }
    }

    // 计算空白率
    const emptyRate = emptyCount / this.sampleCount;
    console.log(emptyRate, emptyCount);

    // 如果空白率超过阈值，判定为白屏
    return emptyRate >= this.whiteScreenThreshold;
  }

  /**
   * 定时检查白屏
   */
  startChecking = () => {
    // 如果已经上报过，不再检查
    if (this.hasReported) {
      return;
    }

    // 检查白屏
    const isWhiteScreen = this.checkWhiteScreen();

    console.log('isWhiteScreen', isWhiteScreen);

    // 增加检查次数
    this.checkCount++;

    // 如果检测到白屏，或者达到最大检查次数，上报结果
    if (isWhiteScreen || this.checkCount >= this.maxCheckCount) {
      this.reportWhiteScreen(isWhiteScreen);
    } else {
      // 继续检查
      this.checkTimer = setTimeout(this.startChecking, this.checkInterval);
    }
  };

  /**
   * 上报白屏检测结果
   * @param {boolean} isWhiteScreen - 是否白屏
   */
  reportWhiteScreen(isWhiteScreen) {
    if (this.hasReported) {
      return;
    }

    // 停止检查
    this.stopChecking();

    // 只有在检测到白屏时才上报
    if (isWhiteScreen) {
      // 上报白屏信息
      this.monitor.send({
        type: 'performance',
        subType: 'white-screen',
        isWhiteScreen: true,
        checkCount: this.checkCount,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        url: window.location.href,
        startTime: performance.now(),
        userAgent: navigator.userAgent,
      });
    }

    this.hasReported = true;
  }

  /**
   * 开始检查白屏
   */
  startChecking() {
    // 清除之前的定时器
    this.stopChecking();

    // 重置检查次数
    this.checkCount = 0;

    // 开始定时检查
    this.checkTimer = setTimeout(this.startChecking, this.checkInterval);
  }

  /**
   * 停止检查白屏
   */
  stopChecking() {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * 初始化插件
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    // 等待页面加载完成后开始检查
    if (document.readyState === 'complete') {
      this.startChecking();
    } else {
      window.addEventListener('load', () => {
        // 页面加载完成后等待一段时间再检查，避免正常加载过程中的误判
        setTimeout(() => {
          this.startChecking();
        }, 2000); // 等待2秒后开始检查
      });
    }

    this.isInitialized = true;
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    this.stopChecking();
    this.isInitialized = false;
  }
}

/**
 * 长任务监控插件
 * 使用 PerformanceObserver API 监控执行时间超过 50ms 的任务
 */

class LongTaskPlugin {
  /**
   * 构造函数
   * @param {Object} monitor - Monitor 实例
   */
  constructor(monitor) {
    this.monitor = monitor;
    this.name = 'longTask';
    this.observer = null;
    this.isInitialized = false;

    // 长任务相关配置
    this.longTaskThreshold = 50; // 长任务阈值，默认为 50ms
    this.reportAllTasks = false; // 是否上报所有长任务，默认只上报超过阈值的任务
    this.maxReportCount = 100; // 最大上报次数，防止上报过多
    this.reportCount = 0; // 当前上报次数
    this.aggregationTime = 5000; // 聚合时间窗口，单位毫秒
    this.aggregatedTasks = []; // 聚合的长任务
    this.aggregationTimer = null; // 聚合定时器
  }

  /**
   * 处理长任务条目
   * @param {PerformanceObserverEntryList} list - 性能观察条目列表
   */
  handleEntries = (list) => {
    const entries = list.getEntries();

    for (const entry of entries) {
      // 只处理 longtask 类型的条目
      if (entry.entryType !== 'longtask') {
        continue;
      }

      // 如果设置了只上报超过阈值的任务，则过滤掉不符合条件的任务
      if (!this.reportAllTasks && entry.duration < this.longTaskThreshold) {
        continue;
      }

      console.log('long entry', entry);

      // 提取长任务信息
      const taskInfo = {
        type: 'performance',
        subType: 'long-task',
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        entryType: entry.entryType,
        // 获取长任务的归因信息
        attribution: this.getAttribution(entry),
        // 获取当前执行的脚本URL
        scriptUrl: this.getCurrentScriptUrl(),
        // 获取当前执行的函数名
        functionName: this.getCurrentFunctionName(),
      };

      // 将长任务添加到聚合列表
      this.aggregatedTasks.push(taskInfo);

      // 如果没有设置聚合定时器，则设置一个
      if (!this.aggregationTimer) {
        this.aggregationTimer = setTimeout(() => {
          this.reportAggregatedTasks();
        }, this.aggregationTime);
      }
    }
  };

  /**
   * 获取长任务的归因信息
   * @param {PerformanceEntry} entry - 性能条目
   * @returns {Object} - 归因信息
   */
  getAttribution(entry) {
    // attribution 属性包含了长任务的归因信息
    if (entry.attribution && entry.attribution.length > 0) {
      const attribution = entry.attribution[0];
      return {
        name: attribution.name,
        entryType: attribution.entryType,
        startTime: attribution.startTime,
        duration: attribution.duration,
        containerType: attribution.containerType,
        containerName: attribution.containerName,
        containerId: attribution.containerId,
        containerSrc: attribution.containerSrc,
      };
    }

    return null;
  }

  /**
   * 获取当前执行的脚本URL
   * @returns {string} - 当前脚本URL
   */
  getCurrentScriptUrl() {
    try {
      // 尝试获取当前执行的脚本
      const currentScript = document.currentScript;
      return currentScript ? currentScript.src : '';
    } catch (error) {
      return '';
    }
  }

  /**
   * 获取当前执行的函数名
   * @returns {string} - 当前函数名
   */
  getCurrentFunctionName() {
    try {
      // 尝试获取当前执行的函数名
      // 这是一个简单的实现，可能不适用于所有情况
      const error = new Error();
      const stackLines = error.stack.split('\n');

      // 跳过前两行（Error 和当前函数）
      if (stackLines.length > 2) {
        const callerLine = stackLines[2].trim();
        const functionNameMatch = callerLine.match(/at\s+([^\s]+)\s+/);

        if (functionNameMatch && functionNameMatch[1]) {
          return functionNameMatch[1];
        }
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  /**
   * 上报聚合的长任务
   */
  reportAggregatedTasks() {
    // 清除聚合定时器
    if (this.aggregationTimer) {
      clearTimeout(this.aggregationTimer);
      this.aggregationTimer = null;
    }

    // 如果没有聚合的任务，则不上报
    if (this.aggregatedTasks.length === 0) {
      return;
    }

    // 计算聚合统计信息
    const stats = this.calculateStats(this.aggregatedTasks);

    // 上报聚合统计信息
    this.monitor.send({
      type: 'performance',
      subType: 'long-task-summary',
      count: this.aggregatedTasks.length,
      totalDuration: stats.totalDuration,
      averageDuration: stats.averageDuration,
      maxDuration: stats.maxDuration,
      minDuration: stats.minDuration,
      timeRange: [stats.startTime, stats.endTime],
      tasks: this.aggregatedTasks.slice(0, 10), // 只包含前10个任务详情
    });

    // 增加上报次数
    this.reportCount++;

    // 清空聚合列表
    this.aggregatedTasks = [];

    // 如果达到最大上报次数，则停止观察
    if (this.reportCount >= this.maxReportCount) {
      this.stopObserving();
    }
  }

  /**
   * 计算聚合统计信息
   * @param {Array} tasks - 长任务列表
   * @returns {Object} - 统计信息
   */
  calculateStats(tasks) {
    if (tasks.length === 0) {
      return {
        totalDuration: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        startTime: 0,
        endTime: 0,
      };
    }

    let totalDuration = 0;
    let maxDuration = -Infinity;
    let minDuration = Infinity;
    let startTime = Infinity;
    let endTime = -Infinity;

    for (const task of tasks) {
      totalDuration += task.duration;
      maxDuration = Math.max(maxDuration, task.duration);
      minDuration = Math.min(minDuration, task.duration);
      startTime = Math.min(startTime, task.startTime);
      endTime = Math.max(endTime, task.startTime + task.duration);
    }

    return {
      totalDuration,
      averageDuration: totalDuration / tasks.length,
      maxDuration,
      minDuration,
      startTime,
      endTime,
    };
  }

  /**
   * 开始观察长任务
   */
  startObserving() {
    // 确保浏览器支持 PerformanceObserver 和 longtask
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('当前浏览器不支持 PerformanceObserver API，无法监控长任务');
      return;
    }

    try {
      // 创建性能观察器
      this.observer = new PerformanceObserver(this.handleEntries);

      // 开始观察 longtask 类型的条目
      this.observer.observe({ entryTypes: ['longtask'] });

      console.log('长任务监控已启动');
    } catch (error) {
      console.error('初始化长任务监控失败:', error);
    }
  }

  /**
   * 停止观察长任务
   */
  stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // 上报剩余的聚合任务
    if (this.aggregatedTasks.length > 0) {
      this.reportAggregatedTasks();
    }

    // 清除聚合定时器
    if (this.aggregationTimer) {
      clearTimeout(this.aggregationTimer);
      this.aggregationTimer = null;
    }
  }

  /**
   * 初始化插件
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    // 开始观察长任务
    this.startObserving();

    // 页面卸载前上报剩余的聚合任务
    window.addEventListener('beforeunload', () => {
      this.reportAggregatedTasks();
    });

    this.isInitialized = true;
  }

  /**
   * 销毁插件，清理资源
   */
  destroy() {
    this.stopObserving();

    window.removeEventListener('beforeunload', this.reportAggregatedTasks);

    this.isInitialized = false;
  }
}

/**
 * 点击行为监控插件
 * 用于收集用户点击行为数据
 */


class ClickPlugin {
	/**
	 * 构造函数
	 * @param {Object} monitor - Monitor 实例
	 */
	constructor(monitor) {
		this.monitor = monitor;
		this.name = 'click';
		this.options = {
			// 默认配置
			ignoreClasses: ['monitor-ignore'], // 忽略带有这些类的元素
			maxElementContentLength: 50, // 收集元素内容的最大长度
			collectTextContent: true, // 是否收集元素的文本内容
		};
	}

	/**
	 * 处理点击事件
	 * @param {Event} event - 点击事件对象
	 */
	handleClick = event => {
		const target = event.target;

		// 如果目标元素带有忽略类，则不收集
		if (this.shouldIgnoreElement(target)) {
			return
		}

		// 获取元素路径
		const path = this.getElementPath(target);

		// 获取元素内容
		let textContent = '';
		if (this.options.collectTextContent) {
			textContent = this.getElementContent(target);
		}

		// 收集点击数据
		this.monitor.send({
			type: 'behavior',
			subType: 'click',
			target: target.tagName.toLowerCase(),
			path: path,
			pageUrl: getCurrentPageUrl(),
			content: textContent,
			position: {
				x: event.clientX,
				y: event.clientY,
			},
			elementInfo: {
				id: target.id || '',
				className: target.className || '',
				name: target.name || '',
				type: target.type || '',
				value: target.type === 'password' ? '******' : target.value || '',
				width: target.offsetWidth,
				height: target.offsetHeight,
			},
			timestamp: new Date().getTime(),
			startTime: event.timeStamp,
			uuid: generateUniqueId(),
		});
	}

	/**
	 * 判断是否应该忽略该元素
	 * @param {HTMLElement} element - 要检查的元素
	 * @returns {boolean} - 是否应该忽略
	 */
	shouldIgnoreElement(element) {
		// 检查元素是否包含忽略类
		if (element.classList) {
			for (const ignoreClass of this.options.ignoreClasses) {
				if (element.classList.contains(ignoreClass)) {
					return true
				}
			}
		}

		// 检查元素是否有 data-monitor-ignore 属性
		if (element.hasAttribute && element.hasAttribute('data-monitor-ignore')) {
			return true
		}

		return false
	}

	/**
	 * 获取元素的选择器路径
	 * @param {HTMLElement} element - 要获取路径的元素
	 * @returns {string} - 元素的选择器路径
	 */
	getElementPath(element) {
		if (!element || element === document.body) {
			return 'body'
		}

		let path = '';
		let currentElement = element;
		const maxDepth = 5; // 限制路径深度以避免路径过长
		let depth = 0;

		while (currentElement && currentElement !== document.body && depth < maxDepth) {
			let selector = currentElement.tagName.toLowerCase();

			// 添加 ID
			if (currentElement.id) {
				selector += `#${currentElement.id}`;
			}
			// 添加类名（最多取前两个类）
			else if (currentElement.className && typeof currentElement.className === 'string') {
				const classes = currentElement.className.split(' ').filter(c => c);
				if (classes.length) {
					selector += `.${classes.slice(0, 2).join('.')}`;
				}
			}

			// 添加到路径
			path = path ? `${selector} > ${path}` : selector;

			// 移动到父元素
			currentElement = currentElement.parentElement;
			depth++;
		}

		return path
	}

	/**
	 * 获取元素的文本内容
	 * @param {HTMLElement} element - 要获取内容的元素
	 * @returns {string} - 元素的文本内容
	 */
	getElementContent(element) {
		let content = '';

		// 对于表单元素，获取其值
		if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
			// 对于密码输入框，不获取实际值
			if (element.type === 'password') {
				content = '******';
			} else {
				content = element.value || '';
			}
		}
		// 对于其他元素，获取文本内容
		else {
			content = element.textContent || element.innerText || '';
		}

		// 裁剪内容长度
		if (content && content.length > this.options.maxElementContentLength) {
			content = content.substring(0, this.options.maxElementContentLength) + '...';
		}

		// 去除多余空白字符
		return content.trim().replace(/\s+/g, ' ')
	}

	/**
	 * 初始化插件
	 * @param {Object} options - 插件配置选项
	 */
	init(options = {}) {
		// 合并配置
		this.options = { ...this.options, ...options };

		// 监听点击事件
		document.addEventListener('click', this.handleClick, true);

		// 监听触摸事件（移动端）
		document.addEventListener('touchstart', this.handleClick, true);
	}

	/**
	 * 销毁插件，清理事件监听
	 */
	destroy() {
		document.removeEventListener('click', this.handleClick, true);
		document.removeEventListener('touchstart', this.handleClick, true);
	}
}

/**
 * 页面跳转监控插件
 * 用于收集页面路由变化数据
 */


class PageChangePlugin {
	/**
	 * 构造函数
	 * @param {Object} monitor - Monitor 实例
	 */
	constructor(monitor) {
		this.monitor = monitor;
		this.name = 'pageChange';
		this.currentUrl = window.location.href;
	}

	/**
	 * 处理 hash 变化事件
	 * @param {HashChangeEvent} event - hash 变化事件对象
	 */
	handleHashChange = event => {
		const from = event.oldURL || this.currentUrl;
		const to = event.newURL || window.location.href;

		this.reportPageChange('hashchange', from, to, event.timeStamp);
		this.currentUrl = to;
	}

	/**
	 * 处理 popstate 事件（历史记录变化）
	 * @param {PopStateEvent} event - popstate 事件对象
	 */
	handlePopState = event => {
		const from = this.currentUrl;
		const to = window.location.href;

		// 如果 URL 没有变化，则不记录
		if (from === to) {
			return
		}

		this.reportPageChange('popstate', from, to, event.timeStamp);
		this.currentUrl = to;
	}

	/**
	 * 监听 history API 的调用
	 */
	patchHistoryAPI() {
		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;
		const plugin = this;

		// 重写 pushState 方法
		window.history.pushState = function (...args) {
			const from = plugin.currentUrl;

			// 调用原始方法
			const result = originalPushState.apply(this, args);

			const to = window.location.href;
			// 如果 URL 没有变化，则不记录
			if (from !== to) {
				plugin.reportPageChange('pushState', from, to, performance.now());
				plugin.currentUrl = to;
			}

			return result
		};

		// 重写 replaceState 方法
		window.history.replaceState = function (...args) {
			const from = plugin.currentUrl;

			// 调用原始方法
			const result = originalReplaceState.apply(this, args);

			const to = window.location.href;
			// 如果 URL 没有变化，则不记录
			if (from !== to) {
				plugin.reportPageChange('replaceState', from, to, performance.now());
				plugin.currentUrl = to;
			}

			return result
		};
	}

	/**
	 * 报告页面变化事件
	 * @param {string} changeType - 变化类型（hashchange/popstate/pushState/replaceState）
	 * @param {string} from - 来源 URL
	 * @param {string} to - 目标 URL
	 * @param {number} timestamp - 事件时间戳
	 */
	reportPageChange(changeType, from, to, timestamp) {
		// 提取路径部分
		const fromPath = this.extractPath(from);
		const toPath = this.extractPath(to);

		this.monitor.send({
			type: 'behavior',
			subType: 'pageChange',
			changeType: changeType,
			from: from,
			to: to,
			fromPath: fromPath,
			toPath: toPath,
			timestamp: new Date().getTime(),
			startTime: timestamp,
			uuid: generateUniqueId(),
		});
	}

	/**
	 * 从 URL 中提取路径部分
	 * @param {string} url - 完整 URL
	 * @returns {string} - URL 的路径部分
	 */
	extractPath(url) {
		try {
			const urlObj = new URL(url);
			return urlObj.pathname + urlObj.search + urlObj.hash
		} catch (error) {
			console.error('解析 URL 失败:', error);
			return url
		}
	}

	/**
	 * 初始化插件
	 */
	init() {
		// 监听 hash 变化
		window.addEventListener('hashchange', this.handleHashChange);

		// 监听 popstate 事件
		window.addEventListener('popstate', this.handlePopState);

		// 重写 history API
		this.patchHistoryAPI();

		// 记录初始 URL
		this.currentUrl = window.location.href;
	}

	/**
	 * 销毁插件，清理事件监听
	 */
	destroy() {
		window.removeEventListener('hashchange', this.handleHashChange);
		window.removeEventListener('popstate', this.handlePopState);

		// 注意：我们无法轻易恢复被重写的 history API
		// 在实际应用中，这通常不是问题，因为监控通常在页面的整个生命周期内有效
	}
}

/**
 * 页面浏览量（Page View）监控插件
 * 用于收集页面浏览量数据
 */


class PVPlugin {
	/**
	 * 构造函数
	 * @param {Object} monitor - Monitor 实例
	 */
	constructor(monitor) {
		this.monitor = monitor;
		this.name = 'pv';
		this.pageUrl = '';
		this.referrer = '';
	}

	/**
	 * 记录页面浏览量
	 */
	recordPV = () => {
		// 获取当前页面URL和来源页面
		this.pageUrl = getCurrentPageUrl();
		this.referrer = document.referrer;

		// 发送PV数据
		this.monitor.send({
			type: 'behavior',
			subType: 'pv',
			pageUrl: this.pageUrl,
			referrer: this.referrer,
			uuid: generateUniqueId(),
			startTime: performance.now(),
		});
	}

	/**
	 * 初始化插件
	 */
	init() {
		// 页面加载完成后记录PV
		if (document.readyState === 'complete') {
			this.recordPV();
		} else {
			window.addEventListener('load', this.recordPV);
		}

		// 监听页面显示事件，处理从浏览器缓存加载的情况
		// 在网页的 文档被加载并显示到浏览器窗口中时触发，即无论是首次加载页面，还是从浏览器的缓存中重新加载页面（比如使用前进/后退按钮导航）时，都会触发这个事件。
		window.addEventListener('pageshow', event => {
			// 如果是从缓存加载的页面，重新记录PV
			if (event.persisted) {
				this.recordPV();
			}
		});
	}

	/**
	 * 销毁插件，清理事件监听
	 */
	destroy() {
		window.removeEventListener('load', this.recordPV);
		window.removeEventListener('pageshow', this.recordPV);
	}
}

/**
 * 独立访客量（Unique Visitor）监控插件
 * 用于收集独立访客量数据
 */


class UVPlugin {
	/**
	 * 构造函数
	 * @param {Object} monitor - Monitor 实例
	 */
	constructor(monitor) {
		this.monitor = monitor;
		this.name = 'uv';
		this.storageKey = 'monitor_user_id';
		this.expirationKey = 'monitor_user_expiration';
		this.expirationTime = 24 * 60 * 60 * 1000; // 24小时过期时间，可根据需求调整
	}

	/**
	 * 获取或生成用户唯一标识
	 * @returns {string} 用户唯一标识
	 */
	getUserId() {
		// 尝试从 localStorage 获取现有的用户ID
		let userId = localStorage.getItem(this.storageKey);
		let expiration = localStorage.getItem(this.expirationKey);
		const now = new Date().getTime();

		// 如果没有用户ID或者已过期，生成新的ID
		if (!userId || !expiration || now > parseInt(expiration)) {
			userId = generateUniqueId();
			expiration = now + this.expirationTime;

			// 存储新的用户ID和过期时间
			try {
				localStorage.setItem(this.storageKey, userId);
				localStorage.setItem(this.expirationKey, expiration.toString());
				return { userId, isNew: true }
			} catch (error) {
				console.error('存储用户ID失败:', error);
				return { userId, isNew: true }
			}
		}

		return { userId, isNew: false }
	}

	/**
	 * 记录独立访客量
	 */
	recordUV() {
		const { userId, isNew } = this.getUserId();

		// 只有当用户是新用户时才记录UV
		if (isNew) {
			this.monitor.send({
				type: 'behavior',
				subType: 'uv',
				pageUrl: getCurrentPageUrl(),
				referrer: document.referrer,
				userId: userId,
				timestamp: new Date().getTime(),
				startTime: performance.now(),
			});
		}

		return userId
	}

	/**
	 * 初始化插件
	 */
	init() {
		// 页面加载后记录UV
		if (document.readyState === 'complete') {
			this.recordUV();
		} else {
			window.addEventListener('load', () => this.recordUV());
		}
	}

	/**
	 * 销毁插件
	 */
	destroy() {
		window.removeEventListener('load', () => this.recordUV());
	}
}

/**
 * 用户行为栈插件
 * 用于记录用户的操作历史，帮助复现错误
 */


class BehaviorStackPlugin {
	/**
	 * 构造函数
	 * @param {Object} monitor - Monitor 实例
	 */
	constructor(monitor) {
		this.monitor = monitor;
		this.name = 'behaviorStack';

		// 默认配置
		this.options = {
			maxStackSize: 30, // 行为栈最大长度
			includeTypes: ['click', 'pageChange', 'http', 'error', 'custom'], // 要记录的行为类型
			debounceTime: 300, // 防抖时间(毫秒)
			reportWithError: true, // 是否在错误发生时上报行为栈
			reportInterval: 0, // 定时上报间隔(毫秒)，0表示不定时上报
			maskSensitiveData: true, // 是否遮罩敏感数据
			sensitiveKeys: ['password', 'token', 'credit', 'card'], // 敏感数据关键词
		};

		// 行为栈
		this.stack = [];

		// 事件监听器
		this.behaviorListener = this.handleBehavior.bind(this);
		this.errorListener = this.handleError.bind(this);

		// 上报定时器
		this.reportTimer = null;

		// 防抖处理的行为记录函数
		this.debouncedRecordBehavior = null;
	}

	/**
	 * 合并配置
	 * @param {Object} userOptions - 用户提供的配置
	 */
	mergeOptions(userOptions) {
		if (userOptions && typeof userOptions === 'object') {
			this.options = {
				...this.options,
				...userOptions,
				// 合并敏感关键词
				sensitiveKeys: [...this.options.sensitiveKeys, ...(userOptions.sensitiveKeys || [])],
			};
		}

		// 创建防抖处理的行为记录函数
		this.debouncedRecordBehavior = debounce(this.recordBehavior.bind(this), this.options.debounceTime);

		console.log('用户行为栈插件配置:', this.options);
	}

	/**
	 * 处理行为事件
	 * @param {Object} data - 行为数据
	 */
	handleBehavior(data) {
		// 检查是否应该记录该类型的行为
		if (!this.shouldRecordBehavior(data)) {
			return
		}

		console.log('on监听事件');

		// 对某些高频事件进行防抖处理
		if (data.type === 'scroll' || data.type === 'mousemove') {
			this.debouncedRecordBehavior(data);
		} else {
			this.recordBehavior(data);
		}
	}

	/**
	 * 检查是否应该记录该行为
	 * @param {Object} data - 行为数据
	 * @returns {boolean} - 是否应该记录
	 */
	shouldRecordBehavior(data) {
		// 检查行为类型是否在包含列表中
		return (
			this.options.includeTypes.includes('*') ||
			this.options.includeTypes.includes(data.type) ||
			(data.subType && this.options.includeTypes.includes(data.subType))
		)
	}

	/**
	 * 记录行为到栈中
	 * @param {Object} data - 行为数据
	 */
	recordBehavior(data) {
		// 处理敏感数据
		const processedData = this.options.maskSensitiveData ? this.maskSensitiveData(data) : data;

		// 创建行为记录
		const behavior = {
			id: generateUniqueId(),
			timestamp: Date.now(),
			pageUrl: getCurrentPageUrl(),
			type: data.type,
			subType: data.subType,
			data: processedData,
		};

		// 添加到栈顶
		this.stack.push(behavior);

		// 如果超过最大长度，移除最早的行为
		if (this.stack.length > this.options.maxStackSize) {
			this.stack.shift();
		}

		console.log(`记录用户行为: ${behavior.type}${behavior.subType ? '/' + behavior.subType : ''}`);
	}

	/**
	 * 遮罩敏感数据
	 * @param {Object} data - 原始数据
	 * @returns {Object} - 处理后的数据
	 */
	maskSensitiveData(data) {
		if (!data || typeof data !== 'object') {
			return data
		}

		// 创建数据副本
		const maskedData = JSON.parse(JSON.stringify(data));

		// 递归处理对象
		const maskObject = obj => {
			if (!obj || typeof obj !== 'object') {
				return
			}

			Object.keys(obj).forEach(key => {
				// 检查键名是否包含敏感关键词
				const isSensitive = this.options.sensitiveKeys.some(sensitiveKey =>
					key.toLowerCase().includes(sensitiveKey.toLowerCase()),
				);

				if (isSensitive && typeof obj[key] === 'string') {
					// 遮罩敏感字符串
					obj[key] = '******';
				} else if (typeof obj[key] === 'object' && obj[key] !== null) {
					// 递归处理嵌套对象
					maskObject(obj[key]);
				}
			});
		};

		maskObject(maskedData);
		return maskedData
	}

	/**
	 * 处理错误事件
	 * @param {Object} errorData - 错误数据
	 */
	handleError(errorData) {
		console.log('⭐errorData==>', errorData);
		if (this.options.reportWithError && this.stack.length > 0) {
			this.reportBehaviorStack(errorData);
		}
	}

	/**
	 * 上报行为栈
	 * @param {Object} errorData - 关联的错误数据(可选)
	 */
	reportBehaviorStack(errorData = null) {
		if (this.stack.length === 0) {
			return
		}

		const stackData = {
			type: 'behavior',
			subType: 'stack',
			stackId: generateUniqueId(),
			errorId: errorData ? errorData.id || generateUniqueId() : null,
			actions: [...this.stack], // 创建栈的副本
			count: this.stack.length,
			timestamp: Date.now(),
		};

		console.log(`上报用户行为栈: ${stackData.count}个行为记录`);

		// 发送行为栈数据
		this.monitor.send(stackData);
	}

	/**
	 * 开始定时上报
	 */
	startReportingCycle() {
		if (this.options.reportInterval <= 0 || this.reportTimer) {
			return
		}

		this.reportTimer = setInterval(() => {
			if (this.stack.length > 0) {
				this.reportBehaviorStack();
			}
		}, this.options.reportInterval);
	}

	/**
	 * 停止定时上报
	 */
	stopReportingCycle() {
		if (this.reportTimer) {
			clearInterval(this.reportTimer);
			this.reportTimer = null;
		}
	}

	/**
	 * 初始化插件
	 * @param {Object} options - 插件配置选项
	 */
	init(options) {
		// 合并配置
		this.mergeOptions(options);

		// 监听行为事件
		this.monitor.on('behavior', this.behaviorListener);
		this.monitor.on('error', this.errorListener);

		// 如果配置了定时上报，启动定时器
		if (this.options.reportInterval > 0) {
			this.startReportingCycle();
		}

		console.log('用户行为栈插件已初始化');
	}

	/**
	 * 销毁插件，清理资源
	 */
	destroy() {
		// 停止定时上报
		this.stopReportingCycle();

		// 移除事件监听
		this.monitor.off('behavior', this.behaviorListener);
		this.monitor.off('error', this.errorListener);

		// 清空行为栈
		this.stack = [];

		console.log('用户行为栈插件已销毁');
	}

	/**
	 * 手动获取当前行为栈
	 * @returns {Array} - 当前行为栈
	 */
	getStack() {
		return [...this.stack]
	}

	/**
	 * 手动清空行为栈
	 */
	clearStack() {
		this.stack = [];
		console.log('行为栈已清空');
	}
}

/**
 * 插件注册表
 * 用于注册和管理监控 SDK 的插件
 */


// 插件注册表对象
const PluginRegistry = {
	// 错误监控插件
	jsError: JSErrorPlugin,
	resourceError: ResourceErrorPlugin,
	httpError: HttpErrorPlugin,
	frameworkError: FrameworkErrorPlugin,

	// 性能监控插件
	pageLoad: PageLoadPlugin,
	resourceLoad: ResourceLoadPlugin,
	firstPaint: FirstPaintPlugin,
	firstContentfulPaint: FirstContentfulPaintPlugin,
	largestContentfulPaint: LargestContentfulPaintPlugin,
	firstScreen: FirstScreenPlugin,
	whiteScreen: WhiteScreenPlugin,
	longTask: LongTaskPlugin,

	// 用户行为监控插件
	click: ClickPlugin,
	pageChange: PageChangePlugin,
	pv: PVPlugin,
	uv: UVPlugin,
	// rrweb: RRWebPlugin,
	behaviorStack: BehaviorStackPlugin,

	// 其他插件将在这里添加
};

/**
 * 根据名称获取插件构造函数
 * @param {string} name - 插件名称
 * @returns {Function|undefined} - 插件构造函数，如果未找到则返回 undefined
 */
function getPlugin(name) {
	return PluginRegistry[name]
}

/**
 * 获取所有已注册的插件
 * @returns {Object} - 包含所有已注册插件的对象
 */
function getAllPlugins() {
	return { ...PluginRegistry }
}

/**
 * 初始化所有插件
 * @param {Object} monitor - Monitor 实例
 * @returns {Object} - 包含所有已初始化插件实例的对象
 */
function initPlugins(monitor) {
	const plugins = {};

	// 获取配置中启用的插件
	const enabledPlugins = monitor.config.plugins || [];

	// 初始化每个启用的插件
	enabledPlugins.forEach(pluginName => {
		const PluginConstructor = PluginRegistry[pluginName];

		if (PluginConstructor) {
			try {
				// 创建插件实例
				const plugin = new PluginConstructor(monitor);

				// 获取插件配置
				const pluginConfig = monitor.config.pluginsConfig && monitor.config.pluginsConfig[pluginName];

				// 初始化插件，传入插件配置
				if (typeof plugin.init === 'function') {
					plugin.init(pluginConfig);
				}

				// 保存插件实例
				plugins[pluginName] = plugin;
			} catch (error) {
				console.error(`初始化插件 ${pluginName} 失败:`, error);
			}
		} else {
			console.warn(`未找到插件: ${pluginName}`);
		}
	});

	return plugins
}

/**
 * 监控 SDK 的核心 Monitor 类
 */


/**
 * Monitor 的默认配置
 */
const DEFAULT_CONFIG = {
	appId: '',
	reportUrl: '',
	userId: null,
	sampling: 1, // 100% 采样
	plugins: [], // 启用的插件名称列表。如 ['jsError', 'resourceError', 'pv']
	maxQueueSize: 10, // 队列满时自动发送的最大项目数
	reportInterval: 0, // 报告间隔（毫秒） 0表示不定时发送
	pluginsConfig: {}, // 插件配置
};

/**
 * Monitor 类 - 监控 SDK 的核心
 */
class Monitor {
	/**
	 * 创建新的 Monitor 实例
	 * @param {Object} config - 配置对象
	 */
	constructor(config) {
		if (!isObject(config)) {
			throw new Error('Monitor 配置必须是一个对象')
		}

		if (!isString(config.appId) || !config.appId) {
			throw new Error('appId 是必需的，并且必须是非空字符串')
		}

		if (!isString(config.reportUrl) || !config.reportUrl) {
			throw new Error('reportUrl 是必需的，并且必须是非空字符串')
		}

		// 将默认配置与用户配置合并
		this.config = { ...DEFAULT_CONFIG, ...config };

		// 验证采样率
		if (!isNumber(this.config.sampling) || this.config.sampling < 0 || this.config.sampling > 1) {
			this.config.sampling = 1; // 如果无效，默认为 100%
			console.warn('无效的采样率。使用默认值 (1)。');
		}

		// 初始化状态
		this.plugins = {}; // 已加载的插件
		this.queue = []; // 数据批处理队列
		this.initialized = false; // SDK 是否已初始化
		this.sessionId = generateUniqueId(); // 生成唯一会话 ID
		this.eventListeners = {}; // 事件监听器
	}

	/**
	 * 初始化 Monitor
	 * @returns {Monitor} - 用于链式调用的 Monitor 实例
	 */
	init() {
		if (this.initialized) {
			console.warn('Monitor 已经初始化');
			return this
		}

		console.log('正在初始化 Monitor SDK:', this.config);

		// 加载插件
		this.loadPlugins();

		// 启动报告周期
		if (isNumber(this.config.reportInterval) && this.config.reportInterval > 0) {
			this.startReportingCycle();
		}

		// 设置页面卸载处理程序
		if (typeof window !== 'undefined') {
			// 确保在用户离开页面之前，将队列中所有待发送的监控数据都发送出去，防止数据丢失
			window.addEventListener('beforeunload', this.flushQueue.bind(this));
		}

		this.initialized = true;
		return this
	}

	/**
	 * 加载配置中指定的插件
	 * @private
	 */
	loadPlugins() {
		// 初始化插件
		this.plugins = initPlugins(this);

		console.log('已加载插件:', Object.keys(this.plugins));
	}

	/**
	 * 启动报告周期
	 * @private
	 */
	startReportingCycle() {
		if (typeof window !== 'undefined') {
			this.reportingInterval = setInterval(() => {
				this.flushQueue();
			}, this.config.reportInterval);
		}
	}

	/**
	 * 将数据发送到服务器
	 * @param {Object} data - 要发送的数据
	 * @returns {boolean} - 数据是否被接受发送
	 */
	send(data) {
		// 应用采样
		if (Math.random() >= this.config.sampling) {
			return false // 由于采样而丢弃
		}

		// 添加公共字段
		const reportData = {
			id: generateUniqueId(), // 添加唯一ID
			appId: this.config.appId,
			userId: this.config.userId,
			sessionId: this.sessionId,
			timestamp: getTimestamp(),
			pageUrl: getCurrentPageUrl(),
			userAgent: navigator.userAgent,
			...getBrowserInfo(),
			...getDeviceInfo(),
			...data,
		};

		// 添加到队列
		this.queue.push(reportData);

		console.log('捕获数据已入队:', this.queue.length, reportData.type, reportData.subType);

		// 触发相应类型的事件
		if (reportData.type) {
			this.emit(reportData.type, reportData);

			// 如果有子类型，也触发子类型事件
			if (reportData.subType) {
				this.emit(`${reportData.type}:${reportData.subType}`, reportData);
			}
		}

		// 如果队列已满，自动刷新
		if (this.queue.length >= this.config.maxQueueSize) {
			this.flushQueue();
		}

		return true
	}

	/**
	 * 刷新队列并将数据发送到服务器
	 * @returns {boolean} - 是否尝试了刷新
	 */
	flushQueue() {
		if (this.queue.length === 0) {
			return false
		}

		const dataToSend = this.queue.slice();
		this.queue = [];

		// 将数据发送到服务器
		DataReporter$1.report(this.config.reportUrl, dataToSend);
		return true
	}

	/**
	 * 手动报告错误
	 * @param {Error|string} error - 要报告的错误
	 * @param {Object} extraInfo - 要包含在错误中的额外信息
	 * @returns {boolean} - 是否报告了错误
	 */
	reportError(error, extraInfo = {}) {
		let errorData = {
			type: 'error',
			subType: 'manual',
			level: 'error',
			...extraInfo,
		};

		if (error instanceof Error) {
			errorData = {
				...errorData,
				message: error.message,
				stack: error.stack,
				name: error.name,
			};
		} else {
			errorData.message = String(error);
		}

		// 先触发错误事件，让录屏等插件有机会处理
		this.emit('error', errorData);

		// 然后发送错误数据
		const result = this.send(errorData);

		// 错误立即刷新
		if (result) {
			this.flushQueue();
		}

		return result
	}

	/**
	 * 报告自定义事件
	 * @param {string} eventName - 事件名称
	 * @param {Object} eventData - 事件数据
	 * @returns {boolean} - 是否报告了事件
	 */
	reportEvent(eventName, eventData = {}) {
		return this.send({
			type: 'custom_event',
			name: eventName,
			data: eventData,
		})
	}

	/**
	 * 设置用户信息
	 * @param {string} userId - 用户 ID
	 * @param {Object} userInfo - 额外的用户信息
	 */
	setUser(userId, userInfo = {}) {
		this.config.userId = userId;

		// 报告用户更新事件
		this.reportEvent('user_update', { userId, ...userInfo });
	}

	/**
	 * 注册事件监听器
	 * @param {string} eventType - 事件类型
	 * @param {Function} listener - 监听器函数
	 */
	on(eventType, listener) {
		if (!isString(eventType) || !isFunction(listener)) {
			console.error('事件类型必须是字符串，监听器必须是函数');
			return
		}

		if (!this.eventListeners[eventType]) {
			this.eventListeners[eventType] = [];
		}

		this.eventListeners[eventType].push(listener);
		console.log(`已注册 ${eventType} 事件监听器`);
	}

	/**
	 * 移除事件监听器
	 * @param {string} eventType - 事件类型
	 * @param {Function} listener - 要移除的监听器函数
	 */
	off(eventType, listener) {
		if (!isString(eventType) || !this.eventListeners[eventType]) {
			return
		}

		if (!listener) {
			// 如果没有提供特定的监听器，移除所有该类型的监听器
			delete this.eventListeners[eventType];
			return
		}

		// 移除特定的监听器
		this.eventListeners[eventType] = this.eventListeners[eventType].filter(
			registeredListener => registeredListener !== listener,
		);
	}

	/**
	 * 触发事件
	 * @param {string} eventType - 事件类型
	 * @param {Object} data - 事件数据
	 */
	emit(eventType, data) {
		if (!isString(eventType) || !this.eventListeners[eventType]) {
			return
		}

		console.log('emit 触发事件:', eventType, data);
		// 调用所有注册的监听器
		this.eventListeners[eventType].forEach(listener => {
			try {
				listener(data);
			} catch (error) {
				console.error(`执行 ${eventType} 事件监听器时出错:`, error);
			}
		});
	}

	/**
	 * 销毁监控实例并清理资源
	 */
	destroy() {
		// 刷新任何剩余数据
		this.flushQueue();

		// 清除报告间隔
		if (this.reportingInterval) {
			clearInterval(this.reportingInterval);
		}

		// 移除事件监听器
		if (typeof window !== 'undefined') {
			window.removeEventListener('beforeunload', this.flushQueue.bind(this));
		}

		// 清空所有事件监听器
		this.eventListeners = {};

		// 标记为未初始化
		this.initialized = false;

		console.log('Monitor SDK 已销毁');
	}
}

/**
 * 前端监控 SDK 的主入口文件
 */


const VERSION = '0.1.0';

export { DataReporter$1 as DataReporter, Monitor, index as Utils, VERSION, Monitor as default, getAllPlugins, getPlugin };
