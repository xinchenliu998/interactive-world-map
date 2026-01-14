/**
 * 国家交互模块
 * 负责加载国家边界数据并处理国家点击/悬停事件
 */

// 全局变量
let countriesLayer = null;
let currentlyHighlighted = null;

/**
 * 加载国家边界数据
 * @param {Function} onSuccess - 加载成功回调
 * @param {Function} onError - 加载错误回调
 */
function loadCountryData(onSuccess, onError) {
  // 显示加载提示
  const loadingControl = createLoadingControl();

  // 从配置获取 GeoJSON 数据源 URL
  const geoJsonUrl = get("geoJson.url",
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
  );
  const loadingErrorText = get("ui.loadingErrorText", "❌ 加载国家数据失败，请刷新重试");

  fetch(geoJsonUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`网络响应错误: ${response.status}`);
      }
      return response.json();
    })
    .then((worldGeoJSON) => {
      // 数据加载成功，移除加载提示
      map.removeControl(loadingControl);

      console.log(`成功加载 ${worldGeoJSON.features.length} 个国家/地区的边界数据`);

      // 创建国家图层
      countriesLayer = L.geoJSON(worldGeoJSON, {
        style: defaultCountryStyle,
        onEachFeature: setupCountryEvents
      }).addTo(map);

      console.log("国家边界数据加载完成");

      if (onSuccess) {
        onSuccess(countriesLayer, worldGeoJSON);
      }
    })
    .catch((error) => {
      console.error("加载国家数据失败:", error);

      // 更新加载提示为错误状态
      loadingControl._div.innerHTML = loadingErrorText;
      loadingControl._div.style.color = "red";

      if (onError) {
        onError(error);
      }
    });
}

/**
 * 默认国家样式
 */
function defaultCountryStyle(feature) {
  return {
    fillColor: "#95a5a6",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
}

/**
 * 高亮样式
 */
const highlightStyle = {
  weight: 2,
  color: "#3498db",
  fillOpacity: 0.9,
};

/**
 * 选中样式
 */
const selectedStyle = {
  fillColor: "#e74c3c",
  weight: 2,
  color: "#c0392b",
  fillOpacity: 0.9,
};

/**
 * 为每个国家设置交互事件
 */
function setupCountryEvents(feature, layer) {
  try {
    // 确保layer有有效的几何体
    if (!layer.getBounds) {
      console.warn("Invalid geometry for:", feature.properties.name);
      return;
    }

    const englishName = feature.properties.name || "未知国家";
    const bilingualName = getBilingualName(englishName);

    // 鼠标悬停事件
    layer.on("mouseover", function (e) {
      if (layer !== currentlyHighlighted) {
        layer.setStyle(highlightStyle);
        layer.bringToFront();
      }
      layer
        .bindTooltip(bilingualName, {
          permanent: false,
          direction: "top",
        })
        .openTooltip();
      map.getContainer().style.cursor = "pointer";
    });

    // 鼠标移出事件
    layer.on("mouseout", function () {
      if (layer !== currentlyHighlighted) {
        layer.setStyle(defaultCountryStyle(feature));
      }
      layer.closeTooltip();
      map.getContainer().style.cursor = "";
    });

    // 点击事件
    layer.on("click", function (e) {
      L.DomEvent.stopPropagation(e);
      selectCountry(layer);
    });
  } catch (err) {
    console.error("Error processing feature:", err);
  }
}

/**
 * 选中一个国家
 * @param {Object} layer - Leaflet图层
 */
function selectCountry(layer) {
  if (layer === currentlyHighlighted) return;

  // 恢复之前高亮国家的样式
  resetPreviousHighlight();

  // 高亮当前国家
  layer.setStyle(selectedStyle);
  layer.bringToFront();

  // 更新引用
  currentlyHighlighted = layer;

  // 从配置获取国家相关设置
  const smallCountryThreshold = get("countries.smallCountryThreshold", 0.5);
  const smallCountryDefaultZoom = get("countries.smallCountryDefaultZoom", 10);
  const normalCountryPadding = get("countries.normalCountryPadding", [30, 30]);

  // 计算国家大小，决定缩放方式
  const bounds = layer.getBounds();
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  const width = Math.abs(northEast.lng - southWest.lng);
  const height = Math.abs(northEast.lat - southWest.lat);
  const area = width * height;

  const englishName = layer.feature.properties.name;
  const bilingualName = getBilingualName(englishName);

  // 对于小国家，使用中心点 + 固定缩放级别
  if (area < smallCountryThreshold) {
    const center = bounds.getCenter();
    map.setView(center, smallCountryDefaultZoom, {
      animate: true,
      duration: 1
    });
  } else {
    // 对于正常大小的国家，使用 fitBounds
    map.fitBounds(bounds, {
      padding: normalCountryPadding,
      animate: true,
      duration: 1,
    });
  }

  // 更新信息框
  updateInfoBox(bilingualName);

  // 同步小国家标记的样式
  syncSmallCountryMarker(layer, true);
}

/**
 * 恢复之前高亮国家的样式
 */
function resetPreviousHighlight() {
  if (currentlyHighlighted) {
    currentlyHighlighted.setStyle(defaultCountryStyle(currentlyHighlighted.feature));
    syncSmallCountryMarker(currentlyHighlighted, false);
  }
}

/**
 * 同步小国家标记的样式
 * @param {Object} layer - Leaflet图层
 * @param {boolean} isSelected - 是否选中
 */
function syncSmallCountryMarker(layer, isSelected) {
  if (layer.smallCountryMarker) {
    if (isSelected) {
      layer.smallCountryMarker.setStyle({
        fillColor: "#e74c3c",
        color: "#c0392b",
        fillOpacity: 0.7,
        weight: 3
      });
      layer.smallCountryMarker.bringToFront();
    } else {
      layer.smallCountryMarker.setStyle({
        fillColor: "#3498db",
        color: "#2980b9",
        fillOpacity: 0.3,
        weight: 2
      });
    }
  }
}

/**
 * 更新信息框内容
 * @param {string} text - 显示文本
 */
function updateInfoBox(text) {
  const infoBoxElement = document.getElementById("currentCountry");
  if (infoBoxElement) {
    infoBoxElement.textContent = text;
  }
}

/**
 * 根据国家名称查找并高亮国家
 * @param {string} englishName - 英文国家名
 * @param {string} chineseName - 中文国家名（可选）
 */
function highlightCountryByName(englishName, chineseName) {
  if (!countriesLayer) {
    console.warn("边界数据尚未加载，请等待数据加载完成");
    if (chineseName) {
      updateInfoBox(`正在加载数据... (${chineseName})`);
    }
    return;
  }

  // 从配置获取国家相关设置
  const smallCountryThreshold = get("countries.smallCountryThreshold", 0.5);
  const smallCountryDefaultZoom = get("countries.smallCountryDefaultZoom", 10);
  const normalCountryPadding = get("countries.normalCountryPadding", [30, 30]);

  let found = false;

  countriesLayer.eachLayer(function (layer) {
    if (found) return;

    const feature = layer.feature;
    if (feature && feature.properties.name === englishName) {
      // 恢复之前高亮国家的样式
      resetPreviousHighlight();

      // 高亮当前国家
      layer.setStyle(selectedStyle);
      layer.bringToFront();

      currentlyHighlighted = layer;

      // 计算国家大小，决定缩放方式
      const bounds = layer.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      const width = Math.abs(northEast.lng - southWest.lng);
      const height = Math.abs(northEast.lat - southWest.lat);
      const area = width * height;

      // 对于小国家，使用中心点 + 固定缩放级别
      if (area < smallCountryThreshold) {
        const center = bounds.getCenter();
        map.setView(center, smallCountryDefaultZoom, {
          animate: true,
          duration: 1
        });
      } else {
        // 对于正常大小的国家，使用 fitBounds
        map.fitBounds(bounds, {
          padding: normalCountryPadding,
          animate: true,
          duration: 1,
        });
      }

      // 更新信息框
      updateInfoBox(chineseName ? `${chineseName} (${englishName})` : englishName);

      found = true;

      // 同步小国家标记
      syncSmallCountryMarker(layer, true);
    }
  });

  if (!found) {
    console.warn(`未找到: ${englishName}`);
    updateInfoBox(`未找到: ${chineseName || englishName}`);
  }
}

/**
 * 获取当前高亮的国家
 */
function getCurrentlyHighlighted() {
  return currentlyHighlighted;
}

/**
 * 获取国家图层
 */
function getCountriesLayer() {
  return countriesLayer;
}
