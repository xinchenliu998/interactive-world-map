/**
 * 手动定义的缺失小国家数据
 * 这些国家/地区的GeoJSON边界数据不存在于主数据源中
 */

const manualCountries = {
  // 亚洲
  "Singapore": {
    name: "Singapore",
    chineseName: "新加坡",
    center: [1.3521, 103.8198],
    zoom: 11,
    type: "country"
  },
  "Brunei": {
    name: "Brunei",
    chineseName: "文莱",
    center: [4.5353, 114.7277],
    zoom: 9,
    type: "country"
  },
  "Bahrain": {
    name: "Bahrain",
    chineseName: "巴林",
    center: [26.0667, 50.5577],
    zoom: 10,
    type: "country"
  },
  "Qatar": {
    name: "Qatar",
    chineseName: "卡塔尔",
    center: [25.3548, 51.1839],
    zoom: 9,
    type: "country"
  },
  "Kuwait": {
    name: "Kuwait",
    chineseName: "科威特",
    center: [29.3117, 47.4818],
    zoom: 9,
    type: "country"
  },
  "Maldives": {
    name: "Maldives",
    chineseName: "马尔代夫",
    center: [3.2028, 73.2207],
    zoom: 8,
    type: "country"
  },
  "East Timor": {
    name: "East Timor",
    chineseName: "东帝汶",
    center: [-8.8742, 125.7275],
    zoom: 9,
    type: "country"
  },
  "Palestine": {
    name: "Palestine",
    chineseName: "巴勒斯坦",
    center: [31.9522, 35.2332],
    zoom: 9,
    type: "region"
  },

  // 欧洲
  "Monaco": {
    name: "Monaco",
    chineseName: "摩纳哥",
    center: [43.7384, 7.4246],
    zoom: 13,
    type: "country"
  },
  "Vatican": {
    name: "Vatican",
    chineseName: "梵蒂冈",
    center: [41.9029, 12.4534],
    zoom: 15,
    type: "region"
  },
  "San Marino": {
    name: "San Marino",
    chineseName: "圣马力诺",
    center: [43.9424, 12.4578],
    zoom: 12,
    type: "country"
  },
  "Malta": {
    name: "Malta",
    chineseName: "马耳他",
    center: [35.9375, 14.3754],
    zoom: 10,
    type: "country"
  },
  "Liechtenstein": {
    name: "Liechtenstein",
    chineseName: "列支敦士登",
    center: [47.1660, 9.5554],
    zoom: 10,
    type: "country"
  },
  "Andorra": {
    name: "Andorra",
    chineseName: "安道尔",
    center: [42.5063, 1.5218],
    zoom: 11,
    type: "country"
  },
  "Cyprus": {
    name: "Cyprus",
    chineseName: "塞浦路斯",
    center: [35.1264, 33.4299],
    zoom: 9,
    type: "country"
  },
  "Luxembourg": {
    name: "Luxembourg",
    chineseName: "卢森堡",
    center: [49.8153, 6.1296],
    zoom: 9,
    type: "country"
  },

  // 非洲
  "Comoros": {
    name: "Comoros",
    chineseName: "科摩罗",
    center: [-11.6455, 43.3333],
    zoom: 9,
    type: "country"
  },
  "Mauritius": {
    name: "Mauritius",
    chineseName: "毛里求斯",
    center: [-20.3484, 57.5522],
    zoom: 9,
    type: "country"
  },
  "Seychelles": {
    name: "Seychelles",
    chineseName: "塞舌尔",
    center: [-4.6796, 55.4920],
    zoom: 9,
    type: "country"
  },
  "Sao Tome and Principe": {
    name: "Sao Tome and Principe",
    chineseName: "圣多美和普林西比",
    center: [0.3365, 6.6271],
    zoom: 9,
    type: "country"
  },
  "Cabo Verde": {
    name: "Cabo Verde",
    chineseName: "佛得角",
    center: [16.5388, -23.0418],
    zoom: 8,
    type: "country"
  },

  // 加勒比海地区
  "Antigua and Barbuda": {
    name: "Antigua and Barbuda",
    chineseName: "安提瓜和巴布达",
    center: [17.0608, -61.7964],
    zoom: 10,
    type: "country"
  },
  "Barbados": {
    name: "Barbados",
    chineseName: "巴巴多斯",
    center: [13.1939, -59.5432],
    zoom: 10,
    type: "country"
  },
  "Dominica": {
    name: "Dominica",
    chineseName: "多米尼克",
    center: [15.4150, -61.3710],
    zoom: 10,
    type: "country"
  },
  "Grenada": {
    name: "Grenada",
    chineseName: "格林纳达",
    center: [12.1165, -61.6790],
    zoom: 10,
    type: "country"
  },
  "Saint Kitts and Nevis": {
    name: "Saint Kitts and Nevis",
    chineseName: "圣基茨和尼维斯",
    center: [17.3578, -62.7830],
    zoom: 10,
    type: "country"
  },
  "Saint Lucia": {
    name: "Saint Lucia",
    chineseName: "圣卢西亚",
    center: [13.9094, -60.9789],
    zoom: 10,
    type: "country"
  },
  "Saint Vincent and the Grenadines": {
    name: "Saint Vincent and the Grenadines",
    chineseName: "圣文森特和格林纳丁斯",
    center: [12.9843, -61.2872],
    zoom: 10,
    type: "country"
  },
  "Trinidad and Tobago": {
    name: "Trinidad and Tobago",
    chineseName: "特立尼达和多巴哥",
    center: [10.6918, -61.2225],
    zoom: 9,
    type: "country"
  },

  // 太平洋岛国
  "Fiji": {
    name: "Fiji",
    chineseName: "斐济",
    center: [-17.7134, 178.0650],
    zoom: 8,
    type: "country"
  },
  "Kiribati": {
    name: "Kiribati",
    chineseName: "基里巴斯",
    center: [-3.3704, -168.7340],
    zoom: 7,
    type: "country"
  },
  "Marshall Islands": {
    name: "Marshall Islands",
    chineseName: "马绍尔群岛",
    center: [7.1315, 171.1845],
    zoom: 8,
    type: "country"
  },
  "Micronesia": {
    name: "Micronesia",
    chineseName: "密克罗尼西亚",
    center: [7.4256, 150.5508],
    zoom: 8,
    type: "country"
  },
  "Nauru": {
    name: "Nauru",
    chineseName: "瑙鲁",
    center: [-0.5228, 166.9315],
    zoom: 11,
    type: "country"
  },
  "Palau": {
    name: "Palau",
    chineseName: "帕劳",
    center: [7.5150, 134.5825],
    zoom: 9,
    type: "country"
  },
  "Samoa": {
    name: "Samoa",
    chineseName: "萨摩亚",
    center: [-13.7590, -172.1046],
    zoom: 9,
    type: "country"
  },
  "Solomon Islands": {
    name: "Solomon Islands",
    chineseName: "所罗门群岛",
    center: [-9.6457, 160.1562],
    zoom: 8,
    type: "country"
  },
  "Tonga": {
    name: "Tonga",
    chineseName: "汤加",
    center: [-21.1790, -175.1982],
    zoom: 8,
    type: "country"
  },
  "Tuvalu": {
    name: "Tuvalu",
    chineseName: "图瓦卢",
    center: [-7.1095, 177.6493],
    zoom: 9,
    type: "country"
  },
  "Vanuatu": {
    name: "Vanuatu",
    chineseName: "瓦努阿图",
    center: [-15.3767, 166.9592],
    zoom: 8,
    type: "country"
  }
};
