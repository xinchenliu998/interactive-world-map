# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modular interactive world map application using Leaflet (v1.9.4) and OpenStreetMap. The project is structured with separate JavaScript modules for maintainability and includes a JavaScript-based configuration system for customizing behavior. Features include country/region boundary highlighting with click-to-highlight functionality, bilingual (Chinese/English) naming support, and search capabilities for both countries and cities worldwide.

## Running Project

This project has no build process. Simply open `index.html` in a web browser:

- `index.html` - Main application entry point

## Configuration

The application uses a configuration module (`js/config.js`) for customization. The config is loaded synchronously via script tag on application startup.

### Configuration Structure

The configuration is defined as a JavaScript object in `js/config.js` with the following structure:

```javascript
const appConfig = {
  map: {
    initialView: {
      center: [20, 0],
      zoom: 2
    },
    zoom: {
      min: 2,
      max: 19
    },
    tileLayer: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  },
  geoJson: {
    url: "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
  },
  search: {
    timeout: 3000,
    limit: 8,
    citySearch: {
      url: "https://nominatim.openstreetmap.org/search",
      limit: 5
    }
  },
  countries: {
    smallCountryThreshold: 0.5,
    smallCountryDefaultZoom: 10,
    normalCountryPadding: [30, 30]
  },
  colors: {
    country: {
      default: {
        fillColor: "#95a5a6",
        borderColor: "white",
        fillOpacity: 0.7,
        weight: 1
      },
      hover: {
        borderColor: "#3498db",
        fillOpacity: 0.9,
        weight: 2
      },
      selected: {
        fillColor: "#e74c3c",
        borderColor: "#c0392b",
        fillOpacity: 0.9,
        weight: 2
      }
    },
    marker: {
      default: {
        fillColor: "#3498db",
        borderColor: "#2980b9",
        fillOpacity: 0.3,
        weight: 2
      },
      hover: {
        fillColor: "#e74c3c",
        fillOpacity: 0.6,
        weight: 3
      },
      selected: {
        fillColor: "#e74c3c",
        borderColor: "#c0392b",
        fillOpacity: 0.7,
        weight: 3
      }
    },
    search: {
      searchingColor: "#3498db",
      errorColor: "#e74c3c",
      warningColor: "#e67e22"
    },
    loadingControl: {
      backgroundColor: "white",
      shadowColor: "rgba(0, 0, 0, 0.2)"
    }
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
    infoBoxTip: "加载边界数据可能需要几秒钟，请稍候。"
  }
};
```

### Configuration Options

| Section | Key | Description | Default |
|---------|-----|-------------|----------|
| **map** | | | |
| | `initialView.center` | Map center coordinates [lat, lon] | `[20, 0]` |
| | `initialView.zoom` | Initial zoom level | `2` |
| | `zoom.min` | Minimum zoom level | `2` |
| | `zoom.max` | Maximum zoom level | `19` |
| | `tileLayer.url` | Map tiles URL template | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| | `tileLayer.attribution` | Map attribution text | OpenStreetMap |
| **geoJson** | | | |
| | `url` | GeoJSON data source URL | GitHub johan/world.geo.json |
| **search** | | | |
| | `timeout` | Search timeout in milliseconds | `3000` |
| | `limit` | Maximum search results to display | `8` |
| | `citySearch.url` | Nominatim API endpoint | `https://nominatim.openstreetmap.org/search` |
| | `citySearch.limit` | City search results limit | `5` |
| **countries** | | | |
| | `smallCountryThreshold` | Area threshold for small countries | `0.5` |
| | `smallCountryDefaultZoom` | Zoom level for small countries | `10` |
| | `normalCountryPadding` | Padding for normal countries | `[30, 30]` |
| **colors.country** | | | |
| | `default.fillColor` | Default fill color | `#95a5a6` |
| | `default.borderColor` | Default border color | `white` |
| | `default.fillOpacity` | Default fill opacity | `0.7` |
| | `default.weight` | Default border weight | `1` |
| | `hover.borderColor` | Hover border color | `#3498db` |
| | `hover.fillOpacity` | Hover fill opacity | `0.9` |
| | `hover.weight` | Hover border weight | `2` |
| | `selected.fillColor` | Selected fill color | `#e74c3c` |
| | `selected.borderColor` | Selected border color | `#c0392b` |
| | `selected.fillOpacity` | Selected fill opacity | `0.9` |
| | `selected.weight` | Selected border weight | `2` |
| **colors.marker** | | | |
| | `default.fillColor` | Marker default fill color | `#3498db` |
| | `default.borderColor` | Marker default border color | `#2980b9` |
| | `default.fillOpacity` | Marker default fill opacity | `0.3` |
| | `default.weight` | Marker default border weight | `2` |
| | `hover.fillColor` | Marker hover fill color | `#e74c3c` |
| | `hover.fillOpacity` | Marker hover fill opacity | `0.6` |
| | `hover.weight` | Marker hover border weight | `3` |
| | `selected.fillColor` | Marker selected fill color | `#e74c3c` |
| | `selected.borderColor` | Marker selected border color | `#c0392b` |
| | `selected.fillOpacity` | Marker selected fill opacity | `0.7` |
| | `selected.weight` | Marker selected border weight | `3` |
| **colors.search** | | | |
| | `searchingColor` | Searching state color | `#3498db` |
| | `errorColor` | Error state color | `#e74c3c` |
| | `warningColor` | Warning state color | `#e67e22` |
| **colors.loadingControl** | | | |
| | `backgroundColor` | Loading control background | `white` |
| | `shadowColor` | Loading control shadow | `rgba(0, 0, 0, 0.2)` |
| **ui** | | | |
| | `title` | Page title | `交互式世界地图` |
| | `searchPlaceholder` | Search input placeholder | `输入城市或国家名称...` |
| | `searchButtonText` | Search button text | `搜索` |
| | `searchingText` | Text shown during search | `搜索中...` |
| | `searchButtonDisabledText` | Disabled button text | `搜索` |
| | `timeoutText` | Timeout error text | `请求超时，请重试` |
| | `loadingText` | Loading indicator text | `⏳ 正在加载国家数据...` |
| | `loadingErrorText` | Error loading text | `❌ 加载国家数据失败，请刷新重试` |
| | `dataLoadingText` | Text when GeoJSON not loaded | `⏳ 边界数据正在加载中，请稍后再试...` |
| | `noResultsText` | No search results text | `未找到匹配的地点` |
| | `networkErrorText` | Network error text | `网络连接失败，请检查网络后重试` |
| | `currentCountryDefaultText` | Default selected country text | `暂无，请点击地图选择` |
| | `infoBoxInstructions` | Instructions text | `鼠标悬停可预览，点击后变为红色高亮。` |
| | `infoBoxTip` | Info box tip text | `加载边界数据可能需要几秒钟，请稍候。` |

#### Using Configuration in Code

The `js/config.js` module provides functions to access configuration:

```javascript
// Get a specific configuration value with fallback default
const value = get("map.zoom.max", 19);

// Get the entire configuration object
const config = getAll();

// Set a configuration value at runtime
set("search.timeout", 3000);
```

## Disclaimer

**IMPORTANT: 本项目中的所有地理边界数据、国家/地区名称、政治边界表示均来源于公开的第三方数据源，不代表开发者本人的任何政治立场。本项目仅用于技术学习和演示目的，不应用于任何政治、商业或其他用途。**

**IMPORTANT: All geographic boundary data, country/region names, and political boundary representations in this project are sourced from public third-party data sources. The developer does not express any political stance through this project. This project is for technical learning and demonstration purposes only and should not be used for any political, commercial, or other purposes.**

## Data Sources

### Geographic Boundary Data

1. **Country/Region Boundaries**
   - Default Source: `https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json`
   - Format: GeoJSON
   - License: Please refer to source repository for license information

2. **Map Tiles**
   - Source: OpenStreetMap (https://www.openstreetmap.org/)
   - Provider: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
   - License: ODbL (Open Database License)

3. **Location Search**
   - API: Nominatim by OpenStreetMap
   - Endpoint: `https://nominatim.openstreetmap.org/search`
   - Usage Policy: https://operations.osmfoundation.org/policies/nominatim/

4. **Country/Region Naming**
   - Chinese translations sourced from commonly accepted Chinese names
   - For educational purposes only
   - No political claims or endorsements intended

## Architecture

### File Structure

```
map/
├── index.html                 # Main HTML entry point
├── styles.css                # Application styles
├── data/                    # Data modules
│   ├── country-names.js       # English-Chinese name mappings
│   ├── manual-countries.js   # Manually defined small countries
│   └── country-codes.js      # Country code to name mappings
└── js/                      # Application modules
    ├── config.js             # Configuration module
    ├── map.js               # Map initialization
    ├── countries.js         # Country interaction logic
    ├── small-countries.js   # Small country markers
    └── search.js           # Search functionality
```

### Module Dependencies

```
index.html
├── styles.css
├── data/country-names.js    (no dependencies)
├── data/manual-countries.js  (no dependencies)
├── data/country-codes.js     (no dependencies)
├── js/config.js             (no dependencies)
├── js/map.js               (no dependencies)
├── js/countries.js         (depends on: config.js, map.js, country-names.js)
├── js/small-countries.js    (depends on: config.js, map.js, countries.js, country-names.js, manual-countries.js)
└── js/search.js           (depends on: config.js, map.js, countries.js, country-names.js, manual-countries.js, country-codes.js)
```

### Core Components

#### 0. Configuration (`js/config.js`)

- Config is embedded as JavaScript object in `js/config.js`
- Provides `get(path, defaultValue)` for accessing config values
- Provides `getAll()` for full config object
- Provides `set(path, value)` for runtime updates

#### 1. Map Initialization (`js/map.js`)

- Creates Leaflet map instance using config values for initial view and zoom
- Base tiles from OpenStreetMap (configurable URL and attribution)
- Zoom range from config (min/max)
- Provides helper functions:
  - `initMap()` - Initialize the map
  - `getMap()` - Get the map instance
  - `createLoadingControl()` - Create loading indicator (uses config for text)

#### 2. Country Interactions (`js/countries.js`)

- Fetches GeoJSON from configurable URL
- Handles mouse events (mouseover, mouseout, click)
- Manages country highlighting state
- Country behavior uses config (thresholds, zoom levels, padding)
- Key functions:
  - `loadCountryData(onSuccess, onError)` - Load country boundaries
  - `selectCountry(layer)` - Select and highlight a country
  - `highlightCountryByName(englishName, chineseName)` - Find and highlight by name
  - `getCurrentlyHighlighted()` - Get currently selected country
  - `getCountriesLayer()` - Get the GeoJSON layer

#### 3. Small Countries (`js/small-countries.js`)

- Adds circle markers for small countries with difficult-to-click areas
- Manually defines countries not in GeoJSON (Singapore, Monaco, Vatican, etc.)
- Uses `colors.marker` config for marker appearance
- Key functions:
  - `addSmallCountryMarkers(countriesLayer)` - Add markers for small GeoJSON countries
  - `showManualCountryMarkers()` - Show manually defined country markers
  - `zoomToManualCountry(englishName, chineseName)` - Navigate to manual country

#### 4. Search (`js/search.js`)

- Supports Chinese and English input for country names
- Searches cities worldwide via Nominatim API (configurable endpoint)
- Configurable search timeout and result limits
- Uses AbortController to cancel pending requests on timeout or new search
- Properly restores button state when search completes, times out, or is cancelled
- Keyboard navigation (Arrow keys, Enter, Escape)
- Key functions:
  - `searchLocation(query)` - Main search function with timeout and abort controller
  - `searchCountries(query)` - Search local country data
  - `displayCountryResults(results)` - Show country matches
  - `displayCityResults(results)` - Show city matches
  - `setupSearchEvents()` - Bind event listeners
  - `finishSearch()` - Restore button state and cleanup

### Styling System

Country styles are set via `layer.setStyle()` with these properties:

| State | fillColor | weight | color | fillOpacity |
|-------|-----------|--------|-------|-------------|
| Default | #95a5a6 | 1 | white | 0.7 |
| Hover | #95a5a6 | 2 | #3498db | 0.9 |
| Selected | #e74c3c | 2 | #c0392b | 0.9 |

## Key Features

### Interactive Map
- Click on any country/region to highlight and zoom to it
- Hover to preview country/region name (bilingual display)
- Small countries have clickable circle markers

### Search Functionality
- Search for countries/regions by name (Chinese or English)
- Search for cities worldwide via Nominatim API
- Keyboard navigation support (Up/Down arrows, Enter to select, Escape to close)
- Display search results with country information
- Configurable search timeout and limits
- Proper request cancellation and button state management on timeout/cancel

### Small Country Support
- Additional circle markers for countries with small land area
- Ensures clickable areas for nations like Singapore, Monaco, etc.
- Synchronized highlighting between markers and country boundaries

### Manual Country Definitions
- Some small countries not present in GeoJSON data are manually defined
- Includes: Singapore, Monaco, Vatican, Malta, Bahrain, Qatar, and many more
- Each with center coordinates and appropriate zoom level

### Configuration System
- JSON-based configuration in `js/config.js`
- All settings customizable by editing the configuration object
- Default values embedded in code if needed
- Runtime config updates supported

## UI Elements

| Element ID | Description |
|-----------|-------------|
| `#map` | Main map container (680px height) |
| `#searchBox` | Search input and button |
| `#searchInput` | Text input for country/city search |
| `#searchResults` | Dropdown for search results |
| `#infoBox` | Info panel showing selected country and instructions |
| `#currentCountry` | Updates with clicked/searched country name |
| Loading indicator | Custom Leaflet control showing data load status (top-right) |
| Scale control | Metric scale indicator (bottom-left) |

## Country/Region Naming

The project maintains a comprehensive mapping of English names to Chinese names in `data/country-names.js`:

- All 180+ countries/regions from GeoJSON data source
- Additional small island nations and territories
- Various alternative name spellings (e.g., "Guinea-Bissau" vs "Guinea Bissau")

Notable entries include:
- `Antarctica` - 南极洲
- `Kosovo` - 科索沃
- `Somaliland` - 索马里兰
- `Northern Cyprus` - 北塞浦路斯
- `Taiwan` - 台湾
- `Hong Kong` - 香港
- `Macau` - 澳门
- `Palestine` - 巴勒斯坦

## Adding New Features

### Configuring the Application

To customize the application, edit `js/config.js`:

```javascript
// Edit the `appConfig` object at the top of `js/config.js`:
const appConfig = {
  "map": {
    "initialView": {
      "center": [35, 105],  // Modify initial center
      "zoom": 3
    },
    "geoJson": {
      "url": "https://your-custom-source/data.json"  // Use custom GeoJSON
    }
  }
};
```

### Adding New Data Files

1. Create new JS files in `data/` or `js/` directories
2. Include them in `index.html` before the app initialization script

### Adding Country Names

Update `data/country-names.js`:
```javascript
const countryNameMap = {
  // ... existing entries
  "New Country": "新国家中文名"
};
```

### Adding Manual Countries

Update `data/manual-countries.js`:
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

### Modifying Country Events

Events are bound in `js/countries.js` in the `setupCountryEvents()` function.

### Changing Data Source

Update the `geoJson.url` value in `js/config.js` (must return valid GeoJSON with `features` array).

## Browser Compatibility

- Modern browsers with ES6 support
- Requires internet connection for:
  - Loading Leaflet library from CDN
  - Fetching GeoJSON data
  - Loading map tiles
  - Location search (Nominatim API)

## License and Attribution

- Leaflet: BSD-2-Clause license
- OpenStreetMap: ODbL license
- Country GeoJSON: Refer to source repository

## Notes

- Map tiles may take a moment to load initially
- Country boundary data is ~250KB and may require a few seconds to load
- Search is rate-limited by Nominatim API usage policy
- Manual country definitions serve as fallback for missing GeoJSON entries
- Configuration is loaded synchronously; no CORS issues since config is embedded directly in JavaScript
