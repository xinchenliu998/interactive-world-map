# Interactive World Map / 交互式世界地图

A modular interactive world map application built with Leaflet and OpenStreetMap. Click on any country/region to highlight it and zoom to that location. Search functionality supports both countries and cities worldwide.

一个零构建、基于 Leaflet 和 OpenStreetMap 的模块化交互式世界地图项目。支持国家/地区点击高亮、中英双语显示和搜索功能。所有配置均在 `js/config.js` 中定义，便于修改。

---

## Quick Start / 快速开始

No build process required. Simply open `index.html` in a web browser.

本项目无需构建过程，直接用浏览器打开 HTML 文件即可运行：

```bash
# Using a local server (recommended)
npx serve .

# Or open directly in browser
open index.html
```

---

## Features / 功能特性

- **Interactive Map / 交互式地图** - Click any country to highlight and auto-locate / 点击任意国家/地区即可高亮显示并自动定位
- **Bilingual Display / 双语显示** - Chinese and English names / 中英双语国家名称
- **Search / 搜索功能** - Search countries and cities worldwide / 支持全球国家和城市搜索
- **Small Country Support / 小国支持** - Clickable markers for small nations / 为小国家添加可点击标记
- **Configurable / 可配置** - All settings in `js/config.js` / 所有配置在配置文件中

## Configuration / 配置

All configuration is in `js/config.js`. Edit this file to customize:

所有配置在 `js/config.js` 中。编辑此文件可自定义：

---

## Tech Stack / 技术栈

- **Leaflet.js** v1.9.4 - Interactive maps / 交互式地图
- **OpenStreetMap** - Map tiles and geocoding / 地图瓦片和地理编码
- **GeoJSON** - Country boundary data / 国家边界数据

---

## Documentation / 文档

For detailed technical documentation, architecture, API reference, and development guide, see:

详细的技术文档、架构说明、API 参考和开发指南，请参阅：

**[TECHNICAL.md](TECHNICAL.md)**

---

## Data Sources / 数据来源

| Type / 类型                   | Source / 来源                                                   |
| ----------------------------- | --------------------------------------------------------------- |
| Country Boundaries / 国家边界 | [johan/world.geo.json](https://github.com/johan/world.geo.json) |
| Map Tiles / 地图瓦片          | [OpenStreetMap](https://www.openstreetmap.org/)                 |
| Location Search / 位置搜索    | [Nominatim API](https://nominatim.openstreetmap.org/)           |

---

## License / 许可证

- Leaflet: [BSD-2-Clause](https://github.com/Leaflet/Leaflet/blob/main/LICENSE)
- OpenStreetMap: [ODbL](https://www.openstreetmap.org/copyright)
- Country GeoJSON: Refer to [source](https://github.com/johan/world.geo.json)

---

## Development Info / 开发信息

**Development Method / 主要开发方式**: Using Claude Code (glm-4.7 model) for code writing, debugging, and documentation. / 使用 Claude Code (glm-4.7 模型) 进行代码编写、调试和文档编写。

**Project Status / 项目状态**: Learning demonstration project / 学习演示项目。

---

## Disclaimer / 免责声明

**重要声明：本项目中的所有地理边界数据、国家/地区名称、政治边界表示均来源于公开的第三方数据源，不代表开发者本人的任何政治立场。本项目仅用于技术学习和演示目的。**

**IMPORTANT: All geographic boundary data, country/region names, and political boundary representations in this project are sourced from public third-party data sources. The developer does not express any political stance through this project. This project is for technical learning and demonstration purposes only.**
