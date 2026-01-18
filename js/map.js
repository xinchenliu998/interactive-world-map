/**
 * 地图初始化模块
 * 负责创建Leaflet地图实例和基础配置
 */

// 全局地图实例
let map = null;

/**
 * 初始化地图
 * @param {string} elementId - 地图容器的DOM元素ID
 */
function initMap(elementId = "map") {
  // 从配置获取初始视图和缩放级别
  const initialView = get("map.initialView", { center: [20, 0], zoom: 2 });
  const zoomConfig = get("map.zoom", { min: 2, max: 19 });
  const tileLayerConfig = get("map.tileLayer", {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  // 创建地图实例
  map = L.map(elementId).setView(initialView.center, initialView.zoom);

  // 添加底图 - 从配置读取
  L.tileLayer(tileLayerConfig.url, {
    attribution: tileLayerConfig.attribution,
    maxZoom: zoomConfig.max,
    minZoom: zoomConfig.min,
  }).addTo(map);

  // 添加比例尺控件
  L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

  return map;
}

/**
 * 获取地图实例
 */
function getMap() {
  return map;
}

/**
 * 添加加载提示控件
 * @returns {Object} Leaflet control实例
 */
function createLoadingControl() {
  const loadingText = get("ui.loadingText", "⏳ 正在加载国家数据...");
  const bgColor = get("colors.loadingControl.backgroundColor", "white");
  const shadowColor = get(
    "colors.loadingControl.shadowColor",
    "rgba(0, 0, 0, 0.2)",
  );
  const loadingMsg = L.control({ position: "topright" });
  loadingMsg.onAdd = function () {
    this._div = L.DomUtil.create("div", "loading-msg");
    this._div.innerHTML = loadingText;
    this._div.style.cssText = `background: ${bgColor}; padding: 8px; border-radius: 4px; box-shadow: 0 0 10px ${shadowColor};`;
    return this._div;
  };
  loadingMsg.addTo(map);
  return loadingMsg;
}
