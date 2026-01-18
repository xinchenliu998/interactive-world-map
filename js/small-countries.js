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
function createSmallCountryMarker(
  layer,
  area,
  width,
  height,
  smallCountriesLayer,
) {
  const center = layer.getBounds().getCenter();
  const englishName = layer.feature.properties.name;
  const bilingualName = getBilingualName(englishName);

  // 计算圆形标记的半径（基于国家大小，但有最小值）
  const radius = Math.max(Math.min(width, height) * 5, 3);

  // 从配置获取标记默认样式
  const defaultFill = get("colors.marker.default.fillColor", "#3498db");
  const defaultBorder = get("colors.marker.default.borderColor", "#2980b9");
  const defaultOpacity = get("colors.marker.default.fillOpacity", 0.3);
  const defaultWeight = get("colors.marker.default.weight", 2);

  const marker = L.circleMarker(center, {
    radius: radius,
    fillColor: defaultFill,
    color: defaultBorder,
    weight: defaultWeight,
    opacity: 0.8,
    fillOpacity: defaultOpacity,
    bubblingMouseEvents: false, // 防止事件冒泡到地图
  });

  // 鼠标悬停效果
  marker.on("mouseover", function () {
    if (layer !== getCurrentlyHighlighted()) {
      const hoverFill = get("colors.marker.hover.fillColor", "#e74c3c");
      const hoverOpacity = get("colors.marker.hover.fillOpacity", 0.6);
      const hoverWeight = get("colors.marker.hover.weight", 3);

      this.setStyle({
        fillColor: hoverFill,
        fillOpacity: hoverOpacity,
        weight: hoverWeight,
      });
    }
    this.bindTooltip(bilingualName, {
      permanent: false,
      direction: "top",
    }).openTooltip();
    map.getContainer().style.cursor = "pointer";
  });

  // 鼠标移出效果
  marker.on("mouseout", function () {
    if (layer !== getCurrentlyHighlighted()) {
      this.setStyle({
        fillColor: defaultFill,
        fillOpacity: defaultOpacity,
        weight: defaultWeight,
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

  // 从配置获取标记选中样式
  const selectedFill = get("colors.marker.selected.fillColor", "#e74c3c");
  const selectedBorder = get("colors.marker.selected.borderColor", "#c0392b");
  const selectedOpacity = get("colors.marker.selected.fillOpacity", 0.7);
  const selectedWeight = get("colors.marker.selected.weight", 3);

  // 添加新的圆形标记
  const marker = L.circleMarker(data.center, {
    radius: 15,
    fillColor: selectedFill,
    color: selectedBorder,
    weight: selectedWeight,
    opacity: 1,
    fillOpacity: selectedOpacity,
  }).addTo(map);

  marker.bindTooltip(`${data.chineseName} (${data.name})`, {
    permanent: false,
    direction: "top",
  });

  // 点击事件
  marker.on("click", function (e) {
    L.DomEvent.stopPropagation(e);
    // 重置之前的手动标记
    resetManualMarkers();
    // 高亮当前标记
    this.setStyle({
      fillColor: selectedFill,
      color: selectedBorder,
      weight: selectedWeight,
      fillOpacity: selectedOpacity,
    });
    this.openTooltip();
    // 缩放到该位置
    map.setView(data.center, data.zoom, {
      animate: true,
      duration: 1,
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
  const selectedFill = get("colors.marker.selected.fillColor", "#e74c3c");
  const selectedBorder = get("colors.marker.selected.borderColor", "#c0392b");
  const selectedOpacity = get("colors.marker.selected.fillOpacity", 0.7);
  const selectedWeight = get("colors.marker.selected.weight", 3);

  for (const name of Object.keys(manualCountries)) {
    const marker = window[`manualMarker_${name}`];
    if (marker) {
      marker.setStyle({
        fillColor: selectedFill,
        color: selectedBorder,
        weight: selectedWeight,
        opacity: 1,
        fillOpacity: selectedOpacity,
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

  const selectedFill = get("colors.marker.selected.fillColor", "#e74c3c");
  const selectedBorder = get("colors.marker.selected.borderColor", "#c0392b");
  const selectedOpacity = get("colors.marker.selected.fillOpacity", 0.7);
  const selectedWeight = get("colors.marker.selected.weight", 3);

  // 高亮当前标记
  const marker = window[`manualMarker_${englishName}`];
  if (marker) {
    marker.setStyle({
      fillColor: selectedFill,
      color: selectedBorder,
      weight: selectedWeight,
      opacity: 1,
      fillOpacity: selectedOpacity,
    });
    marker.openTooltip();
  } else {
    createManualCountryMarker(data);
  }

  // 缩放到该位置
  map.setView(data.center, data.zoom, {
    animate: true,
    duration: 1,
  });

  // 更新信息框
  updateInfoBox(`${data.chineseName} (${data.name})`);

  console.log(`已定位到手动定义的: ${data.name}`);
  return true;
}
