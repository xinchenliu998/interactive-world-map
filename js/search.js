/**
 * 搜索功能模块
 * 支持国家和城市的搜索
 */

// 搜索相关元素（在 setupSearchEvents 中初始化）
let searchInput = null;
let searchButton = null;
let searchResults = null;

// 搜索状态
let selectedIndex = -1;
let currentResultItems = [];
let searchMarker = null;

// 搜索超时定时器
let searchTimeout = null;
// 用于中止搜索请求的控制器
let searchAbortController = null;

/**
 * 搜索位置（国家或城市）
 * @param {string} query - 搜索查询
 */
async function searchLocation(query) {
  if (!query.trim()) {
    searchResults.style.display = "none";
    return;
  }

  // 从配置获取 UI 文本
  const searchingText = get("ui.searchingText", "搜索中...");
  const searchButtonDisabledText = get("ui.searchButtonDisabledText", "搜索");
  const timeoutText = get("ui.timeoutText", "请求超时，请重试");
  const searchingHtml = `<div style="padding: 15px; color: #3498db; text-align: center;">⏳ ${searchingText}</div>`;
  const timeoutHtml = `<div style="padding: 15px; color: #e74c3c;">⏱️ ${timeoutText}</div>`;

  // 中止之前的请求
  if (searchAbortController) {
    searchAbortController.abort();
  }

  // 创建新的 AbortController
  searchAbortController = new AbortController();

  // 取消之前的超时
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // 显示搜索中状态
  searchButton.disabled = true;
  searchButton.innerHTML = `🔍 ${searchingText}`;
  searchResults.innerHTML = searchingHtml;
  searchResults.style.display = "block";

  // 设置搜索超时
  const timeout = get("search.timeout", 3000);
  searchTimeout = setTimeout(() => {
    // 超时时中止请求
    if (searchAbortController) {
      searchAbortController.abort();
    }
    // 显示超时信息
    searchResults.innerHTML = timeoutHtml;
    searchResults.style.display = "block";
    // 恢复按钮状态
    finishSearch();
  }, timeout);

  // 先尝试匹配国家名称
  const countryMatches = searchCountries(query);
  if (countryMatches.length > 0) {
    displayCountryResults(countryMatches);
    finishSearch();
    return;
  }

  // 如果没有匹配的国家，检查是否需要等待GeoJSON数据加载
  if (!getCountriesLayer()) {
    const manualCount = Object.keys(manualCountries).length;
    const manualList = Object.keys(manualCountries).slice(0, 5)
      .map(n => manualCountries[n].chineseName)
      .join("、");
    const dataLoadingText = get("ui.dataLoadingText", "⏳ 边界数据正在加载中，请稍后再试...");
    searchResults.innerHTML =
      `<div style="padding: 15px; color: #e67e22;">
        ${dataLoadingText}<br>
        <small>目前已手动定义 ${manualCount} 个（如：${manualList} 等），可以先搜索这些</small>
      </div>`;
    finishSearch();
    return;
  }

  // 使用Nominatim API搜索城市
  try {
    const citySearchUrl = get("search.citySearch.url", "https://nominatim.openstreetmap.org/search");
    const citySearchLimit = get("search.citySearch.limit", 5);
    const citySearchConfig = get("search.citySearch", { url: citySearchUrl, limit: citySearchLimit });

    const response = await fetch(
      `${citySearchConfig.url}?format=json&q=${encodeURIComponent(
        query
      )}&limit=${citySearchConfig.limit}&addressdetails=1`,
      { signal: searchAbortController.signal }
    );

    // 取消超时（如果请求成功完成）
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const data = await response.json();

    const noResultsText = get("ui.noResultsText", "未找到匹配的地点");

    if (data.length > 0) {
      displayCityResults(data);
    } else {
      searchResults.innerHTML =
        `<div style="padding: 15px; color: #e74c3c;">${noResultsText}</div>`;
      searchResults.style.display = "block";
    }
  } catch (error) {
    // 如果是请求被中止（超时或新搜索），不显示错误
    if (error.name === 'AbortError') {
      console.log("搜索请求已中止");
      return;
    }

    console.error("搜索错误:", error);

    const networkErrorText = get("ui.networkErrorText", "网络连接失败，请检查网络后重试");
    searchResults.innerHTML =
      `<div style="padding: 15px; color: #e74c3c;">${networkErrorText}</div>`;
    searchResults.style.display = "block";
  } finally {
    finishSearch();
  }
}

/**
 * 完成搜索，恢复按钮状态
 */
function finishSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
  if (searchAbortController) {
    searchAbortController = null;
  }
  searchButton.disabled = false;
  const searchButtonText = get("ui.searchButtonText", "搜索");
  searchButton.innerHTML = `🔍 ${searchButtonText}`;
}

/**
 * 搜索国家名称（支持中英文）
 * @param {string} query - 搜索查询
 * @returns {Array} 搜索结果数组
 */
function searchCountries(query) {
  const queryLower = query.toLowerCase();
  const searchLimit = get("search.limit", 8);
  const results = [];

  // 搜索英文名称
  for (const [english, chinese] of Object.entries(countryNameMap)) {
    if (english.toLowerCase().includes(queryLower)) {
      results.push({
        type: "country",
        englishName: english,
        chineseName: chinese,
      });
      if (results.length >= searchLimit) break;
    }
  }

  // 搜索中文名称
  for (const [chinese, english] of Object.entries(chineseToEnglishMap)) {
    if (chinese.includes(query)) {
      // 避免重复
      if (!results.some((r) => r.englishName === english)) {
        results.push({
          type: "country",
          englishName: english,
          chineseName: chinese,
        });
      }
      if (results.length >= searchLimit) break;
    }
  }

  return results;
}

/**
 * 显示国家搜索结果
 * @param {Array} results - 搜索结果数组
 */
function displayCountryResults(results) {
  const searchLimit = get("search.limit", 8);
  const slicedResults = results.slice(0, searchLimit);
  searchResults.innerHTML = slicedResults
    .map((r, index) => `
      <div class="searchResultItem" data-index="${index}" data-type="country" data-english="${r.englishName}" data-chinese="${r.chineseName}">
        <div class="resultName">${r.chineseName} (${r.englishName})</div>
      </div>
    `).join("");

  // 存储结果项
  currentResultItems = Array.from(searchResults.querySelectorAll(".searchResultItem"));

  // 添加点击事件
  currentResultItems.forEach((item) => {
    item.addEventListener("click", function () {
      const englishName = this.dataset.english;
      const chineseName = this.dataset.chinese;
      selectCountryResult(englishName, chineseName);
    });
  });

  searchResults.style.display = "block";

  // 默认选中第一项
  selectedIndex = 0;
  updateSelection();
}

/**
 * 显示城市搜索结果
 * @param {Array} results - Nominatim API返回的数据
 */
function displayCityResults(results) {
  const searchLimit = get("search.limit", 8);
  const slicedResults = results.slice(0, searchLimit);
  searchResults.innerHTML = slicedResults
    .map((r, index) => {
      const displayName = r.display_name.split(",")[0];
      const country = r.address?.country || "";
      const countryCode = r.address?.country_code || "";
      return `
        <div class="searchResultItem" data-index="${index}" data-type="city" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${displayName}" data-country="${country}" data-country-code="${countryCode}">
          <div class="resultName">${displayName}</div>
          <div class="resultDetails">${country}</div>
        </div>
      `;
    })
    .join("");

  // 存储结果项
  currentResultItems = Array.from(searchResults.querySelectorAll(".searchResultItem"));

  // 添加点击事件
  currentResultItems.forEach((item) => {
    item.addEventListener("click", function () {
      const lat = parseFloat(this.dataset.lat);
      const lon = parseFloat(this.dataset.lon);
      const name = this.dataset.name;
      const country = this.dataset.country;
      const countryCode = this.dataset.countryCode;
      selectCityResult(lat, lon, name, country, countryCode);
    });
  });

  searchResults.style.display = "block";

  // 默认选中第一项
  selectedIndex = 0;
  updateSelection();
}

/**
 * 选中国家搜索结果
 * @param {string} englishName - 英文国家名
 * @param {string} chineseName - 中文国家名
 */
function selectCountryResult(englishName, chineseName) {
  // 先尝试手动定义的国家
  if (manualCountries[englishName]) {
    zoomToManualCountry(englishName, chineseName);
  } else {
    highlightCountryByName(englishName, chineseName);
  }

  searchResults.style.display = "none";
  searchInput.value = `${chineseName} (${englishName})`;
  selectedIndex = -1;
  currentResultItems = [];
}

/**
 * 选中城市搜索结果
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @param {string} name - 城市名称
 * @param {string} country - 国家名称
 * @param {string} countryCode - 国家代码
 */
function selectCityResult(lat, lon, name, country, countryCode) {
  // 移除之前的标记
  if (searchMarker) {
    map.removeLayer(searchMarker);
  }

  // 添加新标记
  searchMarker = L.marker([lat, lon]).addTo(map);
  searchMarker.bindPopup(name).openPopup();

  // 缩放到该位置
  map.setView([lat, lon], 12);

  // 尝试找到并高亮所在国家
  highlightCountryAtLocation(lat, lon, country, countryCode);

  searchResults.style.display = "none";
  searchInput.value = name;
  selectedIndex = -1;
  currentResultItems = [];
}

/**
 * 在指定位置高亮国家
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @param {string} countryName - 国家名称
 * @param {string} countryCode - 国家代码
 */
function highlightCountryAtLocation(lat, lon, countryName, countryCode) {
  if (!getCountriesLayer()) return;

  let found = false;

  // 首先尝试使用国家名称或代码匹配
  let targetCountryName = null;

  if (countryCode && countryCodeToName[countryCode]) {
    targetCountryName = countryCodeToName[countryCode];
  } else if (countryName) {
    // 尝试将国家名称映射到英文名称
    for (const [english, chinese] of Object.entries(countryNameMap)) {
      if (english === countryName || chinese === countryName) {
        targetCountryName = english;
        break;
      }
    }
  }

  // 如果有目标国家名称，直接高亮
  if (targetCountryName) {
    highlightCountryByName(targetCountryName, countryNameMap[targetCountryName]);
    found = true;
  }

  // 如果没有通过国家名称找到，使用坐标检测
  if (!found) {
    const point = L.latLng(lat, lon);
    getCountriesLayer().eachLayer(function (layer) {
      if (!found && layer.getBounds && layer.getBounds().contains(point)) {
        const englishName = layer.feature.properties.name;
        const chineseName = countryNameMap[englishName];
        highlightCountryByName(englishName, chineseName);
        found = true;
      }
    });
  }
}

/**
 * 更新选中项的显示
 */
function updateSelection() {
  currentResultItems.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("selected");
    }
  });
}

/**
 * 处理选中项的点击
 */
function selectCurrentItem() {
  if (selectedIndex >= 0 && selectedIndex < currentResultItems.length) {
    const item = currentResultItems[selectedIndex];
    item.click();
  }
}

/**
 * 绑定搜索事件监听器
 */
function setupSearchEvents() {
  // 初始化 DOM 元素引用
  searchInput = document.getElementById("searchInput");
  searchButton = document.getElementById("searchButton");
  searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchButton || !searchResults) {
    console.error("搜索元素未找到，请确保 HTML 中存在对应的元素");
    return;
  }

  const searchButtonText = get("ui.searchButtonText", "搜索");

  // 搜索按钮点击
  searchButton.innerHTML = `🔍 ${searchButtonText}`;
  searchButton.addEventListener("click", () => {
    searchLocation(searchInput.value);
  });

  // 键盘事件
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 如果有选中的项，则选择该项；否则执行搜索
      if (searchResults.style.display === "block" && selectedIndex >= 0) {
        selectCurrentItem();
      } else {
        searchLocation(searchInput.value);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchResults.style.display === "block" && selectedIndex < currentResultItems.length - 1) {
        selectedIndex++;
        updateSelection();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchResults.style.display === "block" && selectedIndex > 0) {
        selectedIndex--;
        updateSelection();
      }
    } else if (e.key === "Escape") {
      searchResults.style.display = "none";
      selectedIndex = -1;
      currentResultItems = [];
      // 恢复按钮状态
      finishSearch();
    }
  });

  // 点击其他地方关闭搜索结果
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchBox") && !e.target.closest("#searchResults")) {
      searchResults.style.display = "none";
      selectedIndex = -1;
      currentResultItems = [];
      // 恢复按钮状态
      finishSearch();
    }
  });
}
