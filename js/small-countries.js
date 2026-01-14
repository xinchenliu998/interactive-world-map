/**
 * 小国家标记模块
 * 为面积较小的国家添加可点击的圆形标记，解决难以点击的问题
 */

// 小国家面积阈值（度数平方）
const SMALL_COUNTRY_THRESHOLD = 0.5;

/**
 * 为小国家添加可点击的圆形标记
 * @param {Object} countriesLayer - 国家图层
 */
function addSmallCountryMarkers(countriesLayer) {
  const smallCountriesLayer = L.layerGroup().addTo(map);

  countriesLayer.eachLayer(function (layer) {
    if (!layer.getBounds) return;

    const bounds = layer.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const width = Math.abs(northEast.lng - southWest.lng);
    const height = Math.abs(northEast.lat - southWest.lat);
    const area = width * height;

    // 如果国家面积很小，添加一个可点击的圆形标记
    if (area < SMALL_COUNTRY_THRESHOLD) {
      createSmallCountryMarker(layer, area, width, height, smallCountriesLayer);
    }
  });

  return smallCountriesLayer;
}

/**
 * 为单个小国家创建标记
 * @param {Object} layer - 国家图层
 * @param {number} area - 国家面积
 * @param {number} width - 国家宽度
 * @param {number} height - 国家高度
 * @param {Object} smallCountriesLayer - 标记图层组
 */
function createSmallCountryMarker(layer, area, width, height, smallCountriesLayer) {
  const center = layer.getBounds().getCenter();
  const englishName = layer.feature.properties.name;
  const bilingualName = getBilingualName(englishName);

  // 计算圆形标记的半径（基于国家大小，但有最小值）
  const radius = Math.max(Math.min(width, height) * 5, 3);

  const marker = L.circleMarker(center, {
    radius: radius,
    fillColor: "#3498db",
    color: "#2980b9",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.3,
    bubblingMouseEvents: false // 防止事件冒泡到地图
  });

  // 鼠标悬停效果
  marker.on("mouseover", function () {
    if (layer !== getCurrentlyHighlighted()) {
      this.setStyle({
        fillColor: "#e74c3c",
        fillOpacity: 0.6,
        weight: 3
      });
    }
    this.bindTooltip(bilingualName, {
      permanent: false,
      direction: "top"
    }).openTooltip();
    map.getContainer().style.cursor = "pointer";
  });

  // 鼠标移出效果
  marker.on("mouseout", function () {
    if (layer !== getCurrentlyHighlighted()) {
      this.setStyle({
        fillColor: "#3498db",
        fillOpacity: 0.3,
        weight: 2
      });
    }
    this.closeTooltip();
    map.getContainer().style.cursor = "";
  });

  // 点击事件 - 触发国家的点击事件
  marker.on("click", function (e) {
    L.DomEvent.stopPropagation(e);
    selectCountry(layer);
  });

  // 保存对图层的引用以便高亮时同步
  layer.smallCountryMarker = marker;
  smallCountriesLayer.addLayer(marker);
}

/**
 * 显示手动定义的小国家标记
 */
function showManualCountryMarkers() {
  for (const [name, data] of Object.entries(manualCountries)) {
    createManualCountryMarker(data);
  }
}

/**
 * 创建单个手动定义的国家标记
 * @param {Object} data - 国家数据对象
 */
function createManualCountryMarker(data) {
  // 移除之前的临时标记
  if (window[`manualMarker_${data.name}`]) {
    map.removeLayer(window[`manualMarker_${data.name}`]);
  }

  // 添加新的圆形标记
  const marker = L.circleMarker(data.center, {
    radius: 15,
    fillColor: "#e74c3c",
    color: "#c0392b",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.7
  }).addTo(map);

  marker.bindTooltip(
    `${data.chineseName} (${data.name})`,
    { permanent: false, direction: "top" }
  );

  // 点击事件
  marker.on("click", function (e) {
    L.DomEvent.stopPropagation(e);
    // 重置之前的手动标记
    resetManualMarkers();
    // 高亮当前标记
    this.setStyle({
      fillColor: "#e74c3c",
      color: "#c0392b",
      weight: 3,
      fillOpacity: 0.7
    });
    this.openTooltip();
    // 缩放到该位置
    map.setView(data.center, data.zoom, {
      animate: true,
      duration: 1
    });
    // 更新信息框
    updateInfoBox(`${data.chineseName} (${data.name})`);
  });

  window[`manualMarker_${data.name}`] = marker;
}

/**
 * 重置所有手动标记的样式
 */
function resetManualMarkers() {
  for (const name of Object.keys(manualCountries)) {
    const marker = window[`manualMarker_${name}`];
    if (marker) {
      marker.setStyle({
        fillColor: "#e74c3c",
        color: "#c0392b",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.7
      });
      marker.closeTooltip();
    }
  }
}

/**
 * 通过名称定位到手动定义的国家
 * @param {string} englishName - 英文国家名
 * @param {string} chineseName - 中文国家名
 */
function zoomToManualCountry(englishName, chineseName) {
  const data = manualCountries[englishName];
  if (!data) return false;

  // 重置其他手动标记
  resetManualMarkers();

  // 高亮当前标记
  const marker = window[`manualMarker_${englishName}`];
  if (marker) {
    marker.setStyle({
      fillColor: "#e74c3c",
      color: "#c0392b",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.7
    });
    marker.openTooltip();
  } else {
    createManualCountryMarker(data);
  }

  // 缩放到该位置
  map.setView(data.center, data.zoom, {
    animate: true,
    duration: 1
  });

  // 更新信息框
  updateInfoBox(`${data.chineseName} (${data.name})`);

  console.log(`已定位到手动定义的: ${data.name}`);
  return true;
}
