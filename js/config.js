/**
 * 配置管理模块
 * 负责加载和管理应用程序配置
 */

// 配置对象（从 config.json 导出的数据）
const appConfig = {
  map: {
    initialView: {
      center: [20, 0],
      zoom: 2,
    },
    zoom: {
      min: 2,
      max: 19,
    },
    tileLayer: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  geoJson: {
    url: "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json",
  },
  search: {
    timeout: 3000,
    limit: 8,
    citySearch: {
      url: "https://nominatim.openstreetmap.org/search",
      limit: 5,
    },
  },
  countries: {
    smallCountryThreshold: 0.5,
    smallCountryDefaultZoom: 10,
    normalCountryPadding: [30, 30],
  },
  colors: {
    country: {
      default: {
        fillColor: "#95a5a6",
        borderColor: "white",
        fillOpacity: 0.7,
        weight: 1,
      },
      hover: {
        borderColor: "#3498db",
        fillOpacity: 0.9,
        weight: 2,
      },
      selected: {
        fillColor: "#e74c3c",
        borderColor: "#c0392b",
        fillOpacity: 0.9,
        weight: 2,
      },
    },
    marker: {
      default: {
        fillColor: "#3498db",
        borderColor: "#2980b9",
        fillOpacity: 0.3,
        weight: 2,
      },
      hover: {
        fillColor: "#e74c3c",
        fillOpacity: 0.6,
        weight: 3,
      },
      selected: {
        fillColor: "#3ce764",
        borderColor: "#c02b8c",
        fillOpacity: 0.7,
        weight: 3,
      },
    },
    search: {
      searchingColor: "#3498db",
      errorColor: "#e74c3c",
      warningColor: "#e67e22",
    },
    loadingControl: {
      backgroundColor: "white",
      shadowColor: "rgba(0, 0, 0, 0.2)",
    },
  },
  ui: {
    title: "交互式世界地图",
    searchPlaceholder: "输入城市或国家名称（支持中文/英文），按回车搜索...",
    searchButtonText: "搜索",
    searchingText: "搜索中...",
    searchButtonDisabledText: "搜索",
    timeoutText: "请求超时，请重试",
    loadingText: "⏳ 正在加载国家数据...",
    loadingErrorText: "❌ 加载国家数据失败，请刷新重试",
    dataLoadingText: "⏳ 边界数据正在加载中，请稍后再试...",
    noResultsText: "未找到匹配的地点",
    networkErrorText: "网络连接失败，请检查网络后重试",
    currentCountryDefaultText: "暂无，请点击地图选择",
    infoBoxInstructions: "鼠标悬停可预览，点击后变为红色高亮。",
    infoBoxTip: "加载边界数据可能需要几秒钟，请稍候。",
  },
};

/**
 * 获取配置值
 * @param {string} path - 配置路径（如 "map.zoom.max"）
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值
 */
function get(path, defaultValue = null) {
  if (!appConfig) {
    console.warn("配置未加载，使用默认值");
    return defaultValue;
  }

  const keys = path.split(".");
  let value = appConfig;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
}

/**
 * 获取完整配置对象
 * @returns {Object} 配置对象
 */
function getAll() {
  return appConfig || {};
}

/**
 * 设置配置值（运行时修改）
 * @param {string} path - 配置路径
 * @param {*} value - 要设置的值
 */
function set(path, value) {
  if (!appConfig) {
    appConfig = {};
  }

  const keys = path.split(".");
  let obj = appConfig;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in obj) || typeof obj[key] !== "object") {
      obj[key] = {};
    }
    obj = obj[key];
  }

  obj[keys[keys.length - 1]] = value;
  console.log(`配置已更新: ${path} =`, value);
}
