# 技术文档 / Technical Documentation

本文档提供项目的详细技术说明，包括配置系统、模块架构、API 参考、开发指南等内容。

This document provides detailed technical documentation including configuration system, module architecture, API reference, and development guidelines.

---

## 配置系统 / Configuration System

### 配置文件位置 / Config File Location

配置定义在 `js/config.js` 文件中，通过 `<script>` 标签同步加载，无需 fetch，避免了 CORS 问题。

Configuration is defined in `js/config.js` and loaded synchronously via script tag, avoiding CORS issues.

### 配置文件结构 / Configuration Structure

```javascript
// js/config.js 中的配置对象结构：
const appConfig = {
  map: {
    initialView: { "center": [20, 0], "zoom": 2 },
    zoom: { "min": 2, "max": 19 },
    tileLayer: { "url": "...", "attribution": "..." }
  },
  geoJson: { "url": "..." },
  search: {
    "timeout": 3000,
    "limit": 8,
    "citySearch": { "url": "...", "limit": 5 }
  },
  countries: {
    "smallCountryThreshold": 0.5,
    "smallCountryDefaultZoom": 10,
    "normalCountryPadding": [30, 30]
  },
  manualCountries: { "defaultMarkerRadius": 15, "defaultMarkerColor": "#e74c3c", "defaultBorderColor": "#c0392b" },
  ui: {
    "title": "交互式世界地图",
    "searchPlaceholder": "输入城市或国家名称...",
    "searchButtonText": "搜索",
    ...
  }
};
```

### 配置项说明 / Configuration Options

| 配置节 / Section    | 配置项 / Key              | 默认值 / Default | 说明 / Description |
| :------------------ | :------------------------ | :--------------- | :----------------- |
| **map**             | `initialView.center`      | `[20, 0]`        | 地图初始中心坐标   |
|                     | `initialView.zoom`        | `2`              | 初始缩放级别       |
|                     | `zoom.min`                | `2`              | 最小缩放级别       |
|                     | `zoom.max`                | `19`             | 最大缩放级别       |
|                     | `tileLayer.url`           | OSM URL          | 地图瓦片模板       |
|                     | `tileLayer.attribution`   | ODbL             | 地图署名           |
| **geoJson**         | `url`                     | GitHub URL       | GeoJSON 数据源地址 |
| **search**          | `timeout`                 | `3000`          | 搜索超时（毫秒）   |
|                     | `limit`                   | `8`              | 搜索结果数量       |
|                     | `citySearch.url`          | Nominatim        | 城市搜索 API 地址  |
|                     | `citySearch.limit`        | `5`              | 城市搜索结果数量   |
| **countries**       | `smallCountryThreshold`   | `0.5`            | 小国家面积阈值     |
|                     | `smallCountryDefaultZoom` | `10`             | 小国家默认缩放级别 |
|                     | `normalCountryPadding`    | `[30, 30]`       | 正常国家内边距     |
| **manualCountries** | `defaultMarkerRadius`     | `15`             | 标记半径           |
|                     | `defaultMarkerColor`      | `#e74c3c`        | 选中色             |
|                     | `defaultBorderColor`      | `#c0392b`        | 边框色             |
| **ui**              | `title`                   | 交互式世界地图   | 页面标题           |
|                     | `searchPlaceholder`       | 输入城市或...    | 搜索框占位符       |
|                     | `searchButtonText`        | 搜索             | 搜索按钮文本       |
|                     | `searchingText`          | 搜索中...        | 搜索进行中提示文本   |
|                     | `timeoutText`            | 请求超时，请重试 | 搜索超时提示文本   |
|                     | `loadingText`            | ⏳ 加载中...    | 加载提示文本       |
|                     | `noResultsText`          | 未找到匹配       | 无结果文本         |
|                     | `networkErrorText`       | 网络连接失败     | 网络错误文本       |

### 配置 API / Configuration API

#### `get(path, defaultValue)`
获取配置值，带默认值支持。

```javascript
// 获取单个配置值
const timeout = get("search.timeout", 3000);
const title = get("ui.title", "默认标题");

// 支持嵌套路径
const minZoom = get("map.zoom.min", 2);
```

#### `getAll()`
获取完整配置对象。

```javascript
const config = getAll();
console.log(config.map.initialView);
```

#### `set(path, value)`
运行时更新配置值。

```javascript
// 更新配置
set("search.timeout", 3000);
set("map.tileLayer.url", "https://new-tiles.example.com/{z}/{x}/{y}.png");
```

### 配置修改方式 / How to Modify Configuration

编辑 `js/config.js` 文件中的 `appConfig` 对象即可：

```javascript
const appConfig = {
  "geoJson": {
    "url": "https://your-custom-source/data.json"
  },
  "search": {
    "timeout": 3000
  }
};
```

---

## 项目结构 / Project Structure

```
map/
├── index.html                 # Main HTML entry point / 主入口文件
├── styles.css                # Application styles / 应用样式
├── data/                    # Data modules / 数据模块
│   ├── country-names.js       # English-Chinese name mappings / 英中名称映射
│   ├── manual-countries.js   # Manually defined small countries / 手动定义的小国
│   └── country-codes.js      # Country code to name mappings / 国家代码映射
└── js/                      # Application modules / 应用模块
    ├── config.js             # Configuration module / 配置模块
    ├── map.js               # Map initialization / 地图初始化
    ├── countries.js         # Country interaction logic / 国家交互逻辑
    ├── small-countries.js   # Small country markers / 小国标记
    └── search.js           # Search functionality / 搜索功能
```

---

## 模块详解 / Module Details

### Data Modules (`data/`)

#### `data/country-names.js`
- **功能**：英中国家名称映射 / English-Chinese name mappings
- **导出**：
  - `countryNameMap` - 英文名到中文名的映射对象
  - `chineseToEnglishMap` - 中文名到英文名的反向映射
  - `getBilingualName(englishName)` - 获取双语名称的函数
- **依赖**：无
- **数据量**：180+ 国家/地区名称映射

#### `data/manual-countries.js`
- **功能**：GeoJSON 中缺失的小国手动定义 / Manually defined countries not in GeoJSON
- **导出**：`manualCountries` 对象，每个国家包含：
  - `name` - 英文名称
  - `chineseName` - 中文名称
  - `center` - `[lat, lon]` 中心坐标
  - `zoom` - 推荐缩放级别
  - `type` - `"country"` 或 `"region"`
- **依赖**：无
- **包含国家**：新加坡、摩纳哥、梵蒂冈、马耳他、巴林、卡塔尔等 40+ 个小国

#### `data/country-codes.js`
- **功能**：ISO 国家代码到英文名映射 / ISO country code mappings
- **导出**：`countryCodeToName` 对象
- **用途**：将 Nominatim API 返回的国家代码（如 `CN`、`US`）映射到英文名称
- **依赖**：无

### Application Modules (`js/`)

#### `js/config.js`
**配置加载模块，提供以下功能：** / Configuration loader module

| 函数 / Function | 说明 / Description |
|----------------|-------------------|
| `get(path, defaultValue)` | 获取配置值（带默认值） |
| `getAll()` | 获取完整配置对象 |
| `set(path, value)` | 运行时更新配置 |

**加载顺序**：必须在其他所有模块之前加载，因为其他模块依赖它。

**加载方式**：同步加载（`<script>` 标签），避免 CORS 问题。

#### `js/map.js`
**地图初始化模块** / Map initialization module

| 函数 / Function | 说明 / Description |
|----------------|-------------------|
| `initMap()` | 初始化地图实例，设置初始视图和底图 |
| `getMap()` | 获取地图实例的引用 |
| `createLoadingControl()` | 创建加载指示器控件 |

**使用的配置**：
- `map.initialView.center` - 初始中心坐标
- `map.initialView.zoom` - 初始缩放级别
- `map.zoom.min/max` - 缩放级别范围
- `map.tileLayer.url` - 底图瓦片 URL
- `ui.loadingText` - 加载提示文本

**依赖**：`js/config.js`

#### `js/countries.js`
**国家交互模块** / Country interaction module

| 函数 / Function | 说明 / Description |
|----------------|-------------------|
| `loadCountryData(onSuccess, onError)` | 加载 GeoJSON 数据并创建国家图层 |
| `selectCountry(layer)` | 选中一个国家并高亮显示 |
| `highlightCountryByName(englishName, chineseName)` | 根据名称查找并高亮国家 |
| `getCurrentlyHighlighted()` | 获取当前高亮的国家图层 |
| `getCountriesLayer()` | 获取国家图层引用 |
| `resetPreviousHighlight()` | 恢复之前高亮国家的样式 |
| `updateInfoBox(text)` | 更新信息框内容 |
| `syncSmallCountryMarker(layer, isSelected)` | 同步小国家标记的样式 |

**使用的配置**：
- `geoJson.url` - GeoJSON 数据源地址
- `countries.smallCountryThreshold` - 小国家面积阈值
- `countries.smallCountryDefaultZoom` - 小国家默认缩放级别
- `countries.normalCountryPadding` - 正常国家内边距
- `ui.loadingErrorText` - 加载错误文本

**依赖**：`js/config.js`, `js/map.js`, `data/country-names.js`

#### `js/small-countries.js`
**小国家标记模块** / Small country markers module

| 函数 / Function | 说明 / Description |
|----------------|-------------------|
| `addSmallCountryMarkers(countriesLayer)` | 为 GeoJSON 中的小国家添加圆形标记 |
| `showManualCountryMarkers()` | 显示手动定义的国家标记 |
| `zoomToManualCountry(englishName, chineseName)` | 缩放到手动定义的国家 |

**使用的配置**：
- `manualCountries.defaultMarkerRadius` - 标记半径
- `manualCountries.defaultMarkerColor` - 选中色
- `manualCountries.defaultBorderColor` - 边框色

**依赖**：`js/config.js`, `js/map.js`, `js/countries.js`, `data/country-names.js`, `data/manual-countries.js`

#### `js/search.js`
**搜索功能模块** / Search functionality module

| 函数 / Function | 说明 / Description |
|----------------|-------------------|
| `searchLocation(query)` | 搜索位置（国家或城市） |
| `searchCountries(query)` | 搜索国家名称（支持中英文） |
| `displayCountryResults(results)` | 显示国家搜索结果 |
| `displayCityResults(results)` | 显示城市搜索结果（Nominatim API） |
| `selectCountryResult(englishName, chineseName)` | 选中国家搜索结果 |
| `selectCityResult(lat, lon, name, country, countryCode)` | 选中城市搜索结果 |
| `highlightCountryAtLocation(lat, lon, countryName, countryCode)` | 在指定位置高亮国家 |
| `setupSearchEvents()` | 绑定搜索事件监听器 |
| `updateSelection()` | 更新选中项的显示 |
| `selectCurrentItem()` | 处理选中项的点击 |
| `finishSearch()` | 完成搜索，恢复按钮状态 |

**使用的配置**：
- `search.timeout` - 搜索超时时间
- `search.limit` - 搜索结果数量
- `search.citySearch.url` - 城市搜索 API 地址
- `search.citySearch.limit` - 城市搜索结果数量
- `ui.*` - 所有 UI 文本（占位符、按钮文本、提示信息等）

**依赖**：`js/config.js`, `js/map.js`, `js/countries.js`, `data/country-names.js`, `data/manual-countries.js`, `data/country-codes.js`

**特性**：
- 支持搜索超时取消和请求中止
- 新搜索会自动取消之前的请求（使用 AbortController）
- 超时时正确显示超时提示并恢复按钮状态
- 键盘导航支持（上下箭头、Enter、Escape）
- 先匹配国家，后搜索城市
- 城市搜索通过 Nominatim API

---

## 样式系统 / Styling System

### 国家状态样式 / Country State Styles

| 状态 / State    | 填充色 / fillColor | 边框粗细 / weight | 边框色 / color | 透明度 / fillOpacity |
| :-------------- | :----------------- | :---------------- | :------------- | :------------------- |
| 默认 / Default  | `#95a5a6`          | `1`               | `white` (白色) | `0.7`                |
| 悬停 / Hover    | `#95a5a6`          | `2`               | `#3498db`      | `0.9`                |
| 选中 / Selected | `#e74c3c`          | `2`               | `#c0392b`      | `0.9`                |

### 搜索结果样式 / Search Result Styles

```css
.searchResultItem {
  /* 结果项基础样式 */
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.searchResultItem:hover {
  background-color: #f0f8ff;
}

.searchResultItem.selected {
  background-color: #3498db;
  color: white;
}

.resultName {
  font-weight: bold;
  font-size: 14px;
}

.resultDetails {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
}
```

---

## 界面元素 / UI Elements

| 元素 ID / Element ID | 描述 / Description                                           |
| :------------------- | :----------------------------------------------------------- |
| `#map`               | Main map container (680px height) / 主地图容器               |
| `#searchBox`         | Search input and button / 搜索输入框和按钮                   |
| `#searchInput`       | Text input for country/city search / 国家/城市搜索输入       |
| `#searchResults`     | Dropdown for search results / 搜索结果下拉框                 |
| `#infoBox`           | Info panel showing selected country / 显示选中国家的信息面板 |
| `#currentCountry`    | Updates with clicked/searched country name / 更新点击/搜索的国家名称 |
| `Loading indicator`  | Custom Leaflet control showing data load status / 数据加载状态指示器 |
| `Scale control`      | Metric scale indicator / 公制比例尺指示器                    |

---

## 扩展开发指南 / Development Guide

### 添加新配置项 / Adding New Configuration Options

1. 在 `js/config.js` 的 `appConfig` 对象中添加配置项：

```javascript
const appConfig = {
  // ... existing config
  newSection: {
    newOption: "default value"
  }
};
```

2. 在需要使用该配置的模块中通过 `get()` 函数访问：

```javascript
const myValue = get("newSection.newOption", "fallback value");
```

### 添加新的数据文件 / Adding New Data Files

1. 在 `data/` 或 `js/` 目录下创建新的 JS 文件
2. 在 `index.html` 的应用初始化脚本之前包含该文件

```html
<!-- 在 index.html 中 -->
<script src="data/my-new-data.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", async function () {
    // 现在可以使用新数据了
  });
</script>
```

### 添加国家名称映射 / Adding Country Name Mappings

更新 `data/country-names.js`：

```javascript
const countryNameMap = {
  // ... existing entries
  "New Country": "新国家中文名"
};

const chineseToEnglishMap = {
  // ... existing entries
  "新国家中文名": "New Country"
};
```

### 添加手动定义的国家 / Adding Manual Country Definitions

更新 `data/manual-countries.js`：

```javascript
const manualCountries = {
  // ... existing entries
  "New Country": {
    name: "New Country",
    chineseName: "新国家中文名",
    center: [latitude, longitude],
    zoom: 10,
    type: "country" // or "region"
  }
};
```

### 自定义地图样式 / Customizing Map Styles

修改 `js/countries.js` 中的样式对象：

```javascript
// 默认样式
function defaultCountryStyle(feature) {
  return {
    fillColor: "#95a5a6",     // 修改填充色
    weight: 1,                // 修改边框粗细
    opacity: 1,                // 修改边框透明度
    color: "white",           // 修改边框颜色
    fillOpacity: 0.7,         // 修改填充透明度
  };
}

// 高亮样式
const highlightStyle = {
  weight: 2,
  color: "#3498db",           // 修改悬停边框色
  fillOpacity: 0.9,
};

// 选中样式
const selectedStyle = {
  fillColor: "#e74c3c",       // 修改选中填充色
  weight: 2,
  color: "#c0392b",          // 修改选中边框色
  fillOpacity: 0.9,
};
```

### 更换地图瓦片源 / Changing Map Tile Source

编辑 `js/config.js`：

```javascript
const appConfig = {
  map: {
    tileLayer: {
      // OpenStreetMap (默认)
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

      // 或者使用其他瓦片源：
      // CartoDB Positron (浅色)
      // url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",

      // CartoDB Dark (深色)
      // url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

      // Stamen Terrain
      // url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",

      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  }
};
```

### 使用自定义 GeoJSON 数据源 / Using Custom GeoJSON Data Source

编辑 `js/config.js`：

```javascript
const appConfig = {
  geoJson: {
    // 使用本地文件
    url: "./data/my-custom-world.geo.json",

    // 或使用其他在线源
    // url: "https://example.com/geojson/world.json"
  }
};
```

**注意**：自定义 GeoJSON 必须符合标准格式，包含 `features` 数组，每个 feature 必须有 `properties.name` 作为国家名称。

### 自定义小国家判定逻辑 / Customizing Small Country Detection

编辑 `js/config.js` 调整阈值：

```javascript
const appConfig = {
  countries: {
    // 面积小于该值的国家被视为小国（度²）
    smallCountryThreshold: 0.5,    // 默认值
    // 可以调整为更大或更小
    // smallCountryThreshold: 1.0,    // 更严格，更多国家被视为小国
    // smallCountryThreshold: 0.1,    // 更宽松，只有非常小的国家才加标记

    // 小国家的默认缩放级别
    smallCountryDefaultZoom: 10,

    // 正常国家的内边距（避免边界贴边）
    normalCountryPadding: [30, 30]
  }
};
```

---

## API 参考 / API Reference

### 配置 API / Configuration API

#### `get(path, defaultValue)`
```javascript
/**
 * 获取配置值
 * @param {string} path - 配置路径（如 "map.zoom.max"）
 * @param {*} defaultValue - 配置不存在时返回的默认值
 * @returns {*} 配置值或默认值
 */
```

#### `getAll()`
```javascript
/**
 * 获取完整配置对象
 * @returns {Object} 配置对象的副本
 */
```

#### `set(path, value)`
```javascript
/**
 * 设置配置值（运行时修改）
 * @param {string} path - 配置路径（如 "map.zoom.max"）
 * @param {*} value - 要设置的值
 */
```

### 地图 API / Map API

#### `initMap()`
```javascript
/**
 * 初始化地图实例
 * 从配置读取初始视图、缩放级别和底图设置
 */
```

#### `getMap()`
```javascript
/**
 * 获取地图实例引用
 * @returns {L.Map} Leaflet 地图实例
 */
```

### 国家 API / Country API

#### `loadCountryData(onSuccess, onError)`
```javascript
/**
 * 加载国家边界数据
 * @param {Function} onSuccess - 加载成功回调，参数为 (countriesLayer, worldGeoJSON)
 * @param {Function} onError - 加载错误回调，参数为 error 对象
 */
```

#### `highlightCountryByName(englishName, chineseName)`
```javascript
/**
 * 根据国家名称查找并高亮国家
 * @param {string} englishName - 英文国家名（必须）
 * @param {string} chineseName - 中文国家名（可选）
 */
```

#### `selectCountry(layer)`
```javascript
/**
 * 选中一个国家图层并高亮
 * @param {L.GeoJSON.Layer} layer - Leaflet 图层对象
 */
```

### 搜索 API / Search API

#### `searchLocation(query)`
```javascript
/**
 * 搜索位置（国家或城市）
 * 先尝试匹配国家名称，然后使用 Nominatim API 搜索城市
 * @param {string} query - 搜索查询字符串
 */
```

#### `selectCityResult(lat, lon, name, country, countryCode)`
```javascript
/**
 * 选中城市搜索结果
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @param {string} name - 城市名称
 * @param {string} country - 国家名称
 * @param {string} countryCode - 国家代码（如 CN, US）
 */
```

---

## 数据来源 / Data Sources

| 数据类型 / Data Type | 来源 / Source | 许可证 / License |
|---------|------|--------|
| 国家/地区边界 / Country Boundaries | [johan/world.geo.json](https://github.com/johan/world.geo.json) | 请参阅源仓库 / Refer to source |
| 地图瓦片 / Map Tiles | [OpenStreetMap](https://www.openstreetmap.org/) | ODbL |
| 位置搜索 / Location Search | [Nominatim API](https://nominatim.openstreetmap.org/) | 使用策略 / Usage Policy |

---

## 浏览器兼容性 / Browser Compatibility

- 现代浏览器，支持 ES6 / Modern browsers with ES6 support
- 需要互联网连接以加载 / Requires internet connection for:
  - 从 CDN 加载 Leaflet 库 / Loading Leaflet library from CDN
  - 获取 GeoJSON 数据 / Fetching GeoJSON data
  - 加载地图瓦片 / Loading map tiles
  - Nominatim API 搜索 / Location search via Nominatim API

---

## 常见问题 / FAQ

### Q: 为什么配置文件是 .js 而不是 .json？

A: 浏览器的 `file://` 协议下，`fetch()` API 受 CORS 政策限制无法加载本地 JSON 文件。使用 JS 文件并通过 `<script>` 标签同步加载可以避免这个问题，同时保留了配置的模块化特性。

### Q: 如何添加自定义的国家名称？

A: 编辑 `data/country-names.js` 文件，在 `countryNameMap` 对象中添加英中名称映射，同时在 `chineseToEnglishMap` 中添加反向映射。

### Q: 小国家判定逻辑是如何工作的？

A: 通过计算国家边界的宽度和高度，得到面积（宽×高）。如果面积小于配置中的 `smallCountryThreshold`（默认 0.5 度²），则被视为小国，会额外添加圆形标记以确保可点击。

### Q: 搜索时为什么有时需要等待？

A: 搜索分为两步：
1. 首先在本地匹配国家名称（快速）
2. 如果没有匹配，则调用 Nominatim API 搜索城市（需要网络请求）

此外，国家边界数据加载是异步的，在数据加载完成前搜索可能受限。

### Q: 如何更换地图底图样式？

A: 编辑 `js/config.js` 中的 `map.tileLayer.url`，支持 OpenStreetMap、CartoDB、Stamen 等多种瓦片源。

---

## 许可证 / License

- Leaflet: [BSD-2-Clause License](https://github.com/Leaflet/Leaflet/blob/main/LICENSE)
- OpenStreetMap: [ODbL License](https://www.openstreetmap.org/copyright)
- Country GeoJSON: Refer to [source repository](https://github.com/johan/world.geo.json) / 请参阅源仓库

---

## 注意事项 / Notes

- 地图瓦片初次加载可能需要一些时间 / Map tiles may take a moment to load initially
- 国家边界数据约 250KB，可能需要几秒加载 / Country boundary data is ~250KB and may require a few seconds to load
- 搜索受 Nominatim API 使用策略限制 / Search is rate-limited by Nominatim API usage policy
- 手动国家定义作为 GeoJSON 缺失条目的备用 / Manual country definitions serve as fallback for missing GeoJSON entries
- 配置通过 `<script>` 标签同步加载，避免 CORS 问题 / Configuration is loaded synchronously via script tag; no CORS issues

---

## 免责声明 / Disclaimer

**重要声明：本项目中的所有地理边界数据、国家/地区名称、政治边界表示均来源于公开的第三方数据源，不代表开发者本人的任何政治立场。本项目仅用于技术学习和演示目的，不应用于任何政治、商业或其他用途。**

**IMPORTANT: All geographic boundary data, country/region names, and political boundary representations in this project are sourced from public third-party data sources. The developer does not express any political stance through this project. This project is for technical learning and demonstration purposes only.**
