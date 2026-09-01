// Clean 200 Provinces extracted from Azgaar poles: Chile 2026-08-31-22-04.map
export interface ChileProvince {
  id: number;
  originalId: number;
  name: string;
  fullName: string;
  stateId: number;
  stateName: string;
  stateColor: string;
  provinceColor: string;
  burgName: string;
  isCapital: boolean;
  terrain: 'mountain' | 'forest' | 'plains' | 'hills';
  polygon: [number, number][];
  cx: number;
  cy: number;
  neighbors: number[];
  income: number;
}

export const CHILE_PROVINCES_METADATA = {
  name: "Chile (200 Granular Provinces)",
  width: 1536,
  height: 730,
  svgAsset: "/maps/chile_master.svg",
  provincesCount: 200,
};

export const CHILE_PROVINCES: ChileProvince[] = [
  {
    "id": 0,
    "originalId": 1,
    "name": "Dengzhou",
    "fullName": "Dengzhou Parish",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#78bbba",
    "burgName": "Yinan",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        1038.1,
        541.2
      ],
      [
        1073.5,
        522
      ],
      [
        1084.2,
        550.6
      ],
      [
        1059.7,
        572.9
      ],
      [
        1047.6,
        568.9
      ],
      [
        1038.1,
        541.2
      ]
    ],
    "cx": 1065,
    "cy": 548,
    "neighbors": [
      1,
      3,
      38,
      40,
      41
    ],
    "income": 14
  },
  {
    "id": 1,
    "originalId": 2,
    "name": "Chang",
    "fullName": "Chang Parish",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#6bc6c4",
    "burgName": "Chang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1084.2,
        550.6
      ],
      [
        1110.3,
        559.8
      ],
      [
        1080.5,
        601.7
      ],
      [
        1059.7,
        572.9
      ],
      [
        1084.2,
        550.6
      ]
    ],
    "cx": 1085,
    "cy": 570,
    "neighbors": [
      0,
      3,
      40,
      43
    ],
    "income": 14
  },
  {
    "id": 2,
    "originalId": 3,
    "name": "Chan Guo",
    "fullName": "Chan Guo Parish",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#61d6c1",
    "burgName": "Shaozhouai",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1149.2,
        490.3
      ],
      [
        1199,
        486.6
      ],
      [
        1199,
        539.6
      ],
      [
        1176.6,
        552.6
      ],
      [
        1143.4,
        538.1
      ],
      [
        1149.2,
        490.3
      ]
    ],
    "cx": 1162,
    "cy": 523,
    "neighbors": [
      32,
      39,
      42,
      157,
      191
    ],
    "income": 14
  },
  {
    "id": 3,
    "originalId": 4,
    "name": "Yeong",
    "fullName": "Yeong Parish",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#8ed39d",
    "burgName": "Hwacheon",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1047.6,
        568.9
      ],
      [
        1059.7,
        572.9
      ],
      [
        1080.5,
        601.7
      ],
      [
        1083.3,
        620.1
      ],
      [
        1051.2,
        623.6
      ],
      [
        1029.5,
        584.2
      ],
      [
        1047.6,
        568.9
      ]
    ],
    "cx": 1049,
    "cy": 596,
    "neighbors": [
      0,
      1,
      41,
      43,
      45,
      46
    ],
    "income": 14
  },
  {
    "id": 4,
    "originalId": 5,
    "name": "Dongc",
    "fullName": "Dongc County",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#e9a288",
    "burgName": "Dongc",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        973,
        169.1
      ],
      [
        993.2,
        120.4
      ],
      [
        1024,
        104.4
      ],
      [
        1018.1,
        161.6
      ],
      [
        973,
        169.1
      ]
    ],
    "cx": 995,
    "cy": 150,
    "neighbors": [
      5,
      49,
      50,
      56
    ],
    "income": 14
  },
  {
    "id": 5,
    "originalId": 6,
    "name": "Wending",
    "fullName": "Wending County",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#edb373",
    "burgName": "Wending",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        963.6,
        176.3
      ],
      [
        964.4,
        175.3
      ],
      [
        973,
        169.1
      ],
      [
        1018.1,
        161.6
      ],
      [
        1034.2,
        189.3
      ],
      [
        982.6,
        221
      ],
      [
        963.6,
        176.3
      ]
    ],
    "cx": 1000,
    "cy": 180,
    "neighbors": [
      4,
      48,
      50,
      51,
      52,
      56
    ],
    "income": 14
  },
  {
    "id": 6,
    "originalId": 7,
    "name": "Guangzhou",
    "fullName": "Guangzhou County",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#eaa189",
    "burgName": "Guangzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        926,
        123.1
      ],
      [
        934.1,
        98.8
      ],
      [
        952.6,
        93
      ],
      [
        965.4,
        121.1
      ],
      [
        959.5,
        126
      ],
      [
        930.5,
        128.9
      ],
      [
        926,
        123.1
      ]
    ],
    "cx": 948,
    "cy": 112,
    "neighbors": [
      22,
      47,
      48,
      49,
      56,
      144
    ],
    "income": 14
  },
  {
    "id": 7,
    "originalId": 8,
    "name": "Yong",
    "fullName": "Yong Parish",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#83bbe0",
    "burgName": "Zhang",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        1218.9,
        272.1
      ],
      [
        1218.4,
        270.9
      ],
      [
        1230.1,
        232.7
      ],
      [
        1260.5,
        243.6
      ],
      [
        1260.5,
        258.8
      ],
      [
        1228.3,
        279.9
      ],
      [
        1218.9,
        272.1
      ]
    ],
    "cx": 1239,
    "cy": 250,
    "neighbors": [
      8,
      9,
      62,
      63,
      64,
      66
    ],
    "income": 14
  },
  {
    "id": 8,
    "originalId": 9,
    "name": "Yuaoyan Guo",
    "fullName": "Yuaoyan Guo Parish",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#9bc5c8",
    "burgName": "Shuoyang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1260.5,
        243.6
      ],
      [
        1278.9,
        218.6
      ],
      [
        1289.4,
        219.9
      ],
      [
        1292.4,
        274.3
      ],
      [
        1286.8,
        276.9
      ],
      [
        1260.5,
        258.8
      ],
      [
        1260.5,
        243.6
      ]
    ],
    "cx": 1282,
    "cy": 250,
    "neighbors": [
      7,
      60,
      61,
      62,
      64,
      70
    ],
    "income": 14
  },
  {
    "id": 9,
    "originalId": 10,
    "name": "Xing",
    "fullName": "Xing Parish",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#95c5c9",
    "burgName": "Zhenan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1158.8,
        280.4
      ],
      [
        1183.6,
        242.1
      ],
      [
        1218.4,
        270.9
      ],
      [
        1218.9,
        272.1
      ],
      [
        1173.1,
        294
      ],
      [
        1158.8,
        280.4
      ]
    ],
    "cx": 1189,
    "cy": 271,
    "neighbors": [
      7,
      31,
      63,
      65,
      66
    ],
    "income": 14
  },
  {
    "id": 10,
    "originalId": 11,
    "name": "Gonguk",
    "fullName": "Gonguk Landgrave",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#f488d6",
    "burgName": "Yeong",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        940.8,
        527.8
      ],
      [
        969,
        528.9
      ],
      [
        969.2,
        538.3
      ],
      [
        917.8,
        601.1
      ],
      [
        897.9,
        599.7
      ],
      [
        897.7,
        598.3
      ],
      [
        910.8,
        539.3
      ],
      [
        940.8,
        527.8
      ]
    ],
    "cx": 919,
    "cy": 566,
    "neighbors": [
      11,
      41,
      73,
      74,
      75,
      77,
      118
    ],
    "income": 14
  },
  {
    "id": 11,
    "originalId": 12,
    "name": "Kauka",
    "fullName": "Kauka Barony",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#ff98bb",
    "burgName": "Waiki",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        886.2,
        464.5
      ],
      [
        912.1,
        452.7
      ],
      [
        976.1,
        519.4
      ],
      [
        969,
        528.9
      ],
      [
        940.8,
        527.8
      ],
      [
        885.7,
        479.1
      ],
      [
        884.4,
        473.3
      ],
      [
        886.2,
        464.5
      ]
    ],
    "cx": 922,
    "cy": 488,
    "neighbors": [
      10,
      37,
      41,
      73,
      101,
      110,
      132
    ],
    "income": 14
  },
  {
    "id": 12,
    "originalId": 13,
    "name": "Aioko",
    "fullName": "Aioko Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#aece72",
    "burgName": "Aioko",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        595.2,
        600.5
      ],
      [
        619.5,
        623.1
      ],
      [
        586.8,
        646.4
      ],
      [
        595.2,
        600.5
      ]
    ],
    "cx": 601,
    "cy": 631,
    "neighbors": [
      13,
      120,
      140
    ],
    "income": 14
  },
  {
    "id": 13,
    "originalId": 14,
    "name": "Wapelalu",
    "fullName": "Wapelalu Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9be979",
    "burgName": "Wapelalu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        526.2,
        730
      ],
      [
        524.3,
        658.2
      ],
      [
        591.8,
        593.7
      ],
      [
        595.2,
        600.5
      ],
      [
        586.8,
        646.4
      ],
      [
        552.8,
        730
      ],
      [
        526.2,
        730
      ]
    ],
    "cx": 579,
    "cy": 627,
    "neighbors": [
      12,
      120,
      122,
      139,
      140
    ],
    "income": 14
  },
  {
    "id": 14,
    "originalId": 15,
    "name": "Paiale",
    "fullName": "Paiale Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a7f761",
    "burgName": "Paiale",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        385.5,
        627
      ],
      [
        290.3,
        730
      ],
      [
        163,
        730
      ],
      [
        299,
        530.3
      ],
      [
        361.6,
        481.8
      ],
      [
        364.8,
        482.5
      ],
      [
        398,
        542.2
      ],
      [
        398,
        605.9
      ],
      [
        385.5,
        627
      ]
    ],
    "cx": 376,
    "cy": 545,
    "neighbors": [
      102,
      106,
      114,
      119,
      130,
      134,
      139
    ],
    "income": 14
  },
  {
    "id": 15,
    "originalId": 16,
    "name": "Puunaupou",
    "fullName": "Puunaupou Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9ce57c",
    "burgName": "Puunaupou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        345.1,
        231.4
      ],
      [
        319.1,
        235.1
      ],
      [
        290.9,
        212
      ],
      [
        323.3,
        198.1
      ],
      [
        371.2,
        196
      ],
      [
        373.7,
        196.6
      ],
      [
        365.2,
        215.4
      ],
      [
        345.1,
        231.4
      ]
    ],
    "cx": 327,
    "cy": 209,
    "neighbors": [
      18,
      83,
      84,
      85,
      88,
      123,
      124
    ],
    "income": 14
  },
  {
    "id": 16,
    "originalId": 17,
    "name": "Kapokolia",
    "fullName": "Kapokolia Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b8ce73",
    "burgName": "Puonauhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        0,
        0
      ],
      [
        291.1,
        0
      ],
      [
        312.5,
        117.5
      ],
      [
        312.5,
        178.3
      ],
      [
        274.5,
        205.7
      ],
      [
        223.1,
        199.1
      ],
      [
        0,
        82.7
      ],
      [
        0,
        0
      ]
    ],
    "cx": 305,
    "cy": 170,
    "neighbors": [
      17,
      18,
      84,
      87,
      123,
      164
    ],
    "income": 14
  },
  {
    "id": 17,
    "originalId": 18,
    "name": "Wainihikoo",
    "fullName": "Wainihikoo Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b9ce73",
    "burgName": "Wainihikoo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        321,
        179.2
      ],
      [
        312.5,
        178.3
      ],
      [
        312.5,
        117.5
      ],
      [
        331.8,
        175.4
      ],
      [
        321,
        179.2
      ]
    ],
    "cx": 320,
    "cy": 170,
    "neighbors": [
      16,
      18,
      123,
      124
    ],
    "income": 14
  },
  {
    "id": 18,
    "originalId": 19,
    "name": "Puehuhia",
    "fullName": "Puehuhia Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cdd661",
    "burgName": "Palikuini",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        290.9,
        212
      ],
      [
        274.5,
        205.7
      ],
      [
        312.5,
        178.3
      ],
      [
        321,
        179.2
      ],
      [
        323.3,
        198.1
      ],
      [
        290.9,
        212
      ]
    ],
    "cx": 318,
    "cy": 188,
    "neighbors": [
      15,
      16,
      17,
      84,
      124
    ],
    "income": 14
  },
  {
    "id": 19,
    "originalId": 20,
    "name": "Moopooaile",
    "fullName": "Moopooaile Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cce157",
    "burgName": "Moopooaile",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        809.5,
        490.6
      ],
      [
        843.7,
        506.4
      ],
      [
        848.9,
        534.7
      ],
      [
        788.1,
        528.5
      ],
      [
        809.5,
        490.6
      ]
    ],
    "cx": 830,
    "cy": 508,
    "neighbors": [
      109,
      110,
      115,
      133
    ],
    "income": 14
  },
  {
    "id": 20,
    "originalId": 21,
    "name": "Hapapuali",
    "fullName": "Hapapuali Parish",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9aed76",
    "burgName": "Hapapuali",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        287.8,
        422.3
      ],
      [
        279.4,
        453.8
      ],
      [
        247.5,
        451.1
      ],
      [
        268.9,
        422.6
      ],
      [
        285.1,
        416.5
      ],
      [
        287.8,
        422.3
      ]
    ],
    "cx": 259,
    "cy": 440,
    "neighbors": [
      97,
      100,
      105,
      106,
      130
    ],
    "income": 14
  },
  {
    "id": 21,
    "originalId": 22,
    "name": "Jiunyan Guo",
    "fullName": "Jiunyan Guo County",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#fff238",
    "burgName": "Jiliang",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        852.1,
        113.9
      ],
      [
        886.5,
        48.4
      ],
      [
        904.1,
        81.1
      ],
      [
        897.2,
        119.6
      ],
      [
        868.3,
        134.1
      ],
      [
        852.1,
        113.9
      ]
    ],
    "cx": 887,
    "cy": 96,
    "neighbors": [
      22,
      141,
      142,
      143,
      144
    ],
    "income": 14
  },
  {
    "id": 22,
    "originalId": 23,
    "name": "Kainan",
    "fullName": "Kainan County",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffed35",
    "burgName": "Liliqiande",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        897.2,
        119.6
      ],
      [
        904.1,
        81.1
      ],
      [
        926.6,
        90.6
      ],
      [
        934.1,
        98.8
      ],
      [
        926,
        123.1
      ],
      [
        897.2,
        119.6
      ]
    ],
    "cx": 915,
    "cy": 101,
    "neighbors": [
      6,
      21,
      47,
      142,
      144
    ],
    "income": 14
  },
  {
    "id": 23,
    "originalId": 24,
    "name": "Fuz Guo",
    "fullName": "Fuz Guo County",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ecae8c",
    "burgName": "Xingyuan",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        1204.9,
        374.9
      ],
      [
        1233,
        342.7
      ],
      [
        1259.4,
        349.6
      ],
      [
        1260.8,
        351.9
      ],
      [
        1257.4,
        396.4
      ],
      [
        1206,
        379.7
      ],
      [
        1204.9,
        374.9
      ]
    ],
    "cx": 1240,
    "cy": 367,
    "neighbors": [
      24,
      150,
      151,
      153,
      154,
      156
    ],
    "income": 14
  },
  {
    "id": 24,
    "originalId": 25,
    "name": "Xing",
    "fullName": "Xing Barony",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ffd074",
    "burgName": "Qingzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1223.8,
        314.4
      ],
      [
        1232.8,
        298.8
      ],
      [
        1253.1,
        303
      ],
      [
        1267,
        333.9
      ],
      [
        1259.4,
        349.6
      ],
      [
        1233,
        342.7
      ],
      [
        1223.8,
        314.4
      ]
    ],
    "cx": 1251,
    "cy": 325,
    "neighbors": [
      23,
      25,
      64,
      66,
      150,
      151
    ],
    "income": 14
  },
  {
    "id": 25,
    "originalId": 26,
    "name": "Dilon Guo",
    "fullName": "Dilon Guo Barony",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ffae8a",
    "burgName": "Kuizhoulei",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1267,
        333.9
      ],
      [
        1253.1,
        303
      ],
      [
        1280.5,
        294.2
      ],
      [
        1294.4,
        319.7
      ],
      [
        1267,
        333.9
      ]
    ],
    "cx": 1271,
    "cy": 316,
    "neighbors": [
      24,
      64,
      70,
      151
    ],
    "income": 14
  },
  {
    "id": 26,
    "originalId": 27,
    "name": "Haoyang",
    "fullName": "Haoyang Council",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#fc8a97",
    "burgName": "Xianc",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        773.8,
        0
      ],
      [
        756.9,
        82.3
      ],
      [
        713.5,
        113.1
      ],
      [
        692.5,
        104.2
      ],
      [
        749.3,
        0
      ],
      [
        773.8,
        0
      ]
    ],
    "cx": 715,
    "cy": 76,
    "neighbors": [
      27,
      141,
      160,
      161,
      163
    ],
    "income": 14
  },
  {
    "id": 27,
    "originalId": 28,
    "name": "Yihu Guo",
    "fullName": "Yihu Guo Council",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ec97a1",
    "burgName": "Yingzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        756.9,
        82.3
      ],
      [
        773.8,
        0
      ],
      [
        791.6,
        0
      ],
      [
        831.3,
        107.8
      ],
      [
        788.5,
        132.2
      ],
      [
        756.9,
        82.3
      ]
    ],
    "cx": 798,
    "cy": 93,
    "neighbors": [
      26,
      141,
      143,
      161
    ],
    "income": 14
  },
  {
    "id": 28,
    "originalId": 29,
    "name": "Liding",
    "fullName": "Liding Council",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffa87c",
    "burgName": "Liding",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        496.8,
        159.4
      ],
      [
        413.7,
        156.6
      ],
      [
        399.6,
        95.7
      ],
      [
        509.2,
        127.9
      ],
      [
        507.4,
        156.8
      ],
      [
        496.8,
        159.4
      ]
    ],
    "cx": 485,
    "cy": 130,
    "neighbors": [
      123,
      162,
      164,
      175,
      176
    ],
    "income": 14
  },
  {
    "id": 29,
    "originalId": 30,
    "name": "Kan Guo",
    "fullName": "Kan Guo County",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#f6abd5",
    "burgName": "Ankang",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        1113.5,
        147.7
      ],
      [
        1134.5,
        57.1
      ],
      [
        1155.9,
        190.5
      ],
      [
        1130.9,
        198.5
      ],
      [
        1113.5,
        147.7
      ]
    ],
    "cx": 1139,
    "cy": 165,
    "neighbors": [
      30,
      182,
      183,
      185
    ],
    "income": 14
  },
  {
    "id": 30,
    "originalId": 31,
    "name": "Tai Guo",
    "fullName": "Tai Guo County",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#d2d3cc",
    "burgName": "Hangzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1065.6,
        187.9
      ],
      [
        1056,
        60.3
      ],
      [
        1082.7,
        0
      ],
      [
        1140.9,
        0
      ],
      [
        1134.5,
        57.1
      ],
      [
        1113.5,
        147.7
      ],
      [
        1065.6,
        187.9
      ]
    ],
    "cx": 1083,
    "cy": 152,
    "neighbors": [
      29,
      49,
      50,
      180,
      182,
      183
    ],
    "income": 14
  },
  {
    "id": 31,
    "originalId": 32,
    "name": "Songxiang",
    "fullName": "Songxiang County",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#ebd3c3",
    "burgName": "Songxiang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1126.6,
        233.8
      ],
      [
        1126.7,
        232.9
      ],
      [
        1183,
        236.9
      ],
      [
        1183.6,
        242.1
      ],
      [
        1158.8,
        280.4
      ],
      [
        1154.7,
        280.1
      ],
      [
        1126.6,
        233.8
      ]
    ],
    "cx": 1155,
    "cy": 249,
    "neighbors": [
      9,
      63,
      65,
      184,
      185,
      187
    ],
    "income": 14
  },
  {
    "id": 32,
    "originalId": 33,
    "name": "Kuiz Guo",
    "fullName": "Kuiz Guo Margrave",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ffa7c4",
    "burgName": "Ning",
    "isCapital": true,
    "terrain": "plains",
    "polygon": [
      [
        1176.6,
        552.6
      ],
      [
        1199,
        539.6
      ],
      [
        1230,
        562
      ],
      [
        1231.7,
        572
      ],
      [
        1197.2,
        604.1
      ],
      [
        1188.4,
        602.6
      ],
      [
        1174.4,
        558.7
      ],
      [
        1176.6,
        552.6
      ]
    ],
    "cx": 1195,
    "cy": 580,
    "neighbors": [
      2,
      33,
      42,
      191,
      192,
      193,
      194
    ],
    "income": 14
  },
  {
    "id": 33,
    "originalId": 34,
    "name": "Chang Guo",
    "fullName": "Chang Guo Earldom",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff94c9",
    "burgName": "Shunhuaian",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1188.4,
        602.6
      ],
      [
        1197.2,
        604.1
      ],
      [
        1206.2,
        621.1
      ],
      [
        1197.6,
        645.3
      ],
      [
        1154.5,
        634.2
      ],
      [
        1161.7,
        614.5
      ],
      [
        1188.4,
        602.6
      ]
    ],
    "cx": 1187,
    "cy": 626,
    "neighbors": [
      32,
      44,
      192,
      194,
      195,
      198
    ],
    "income": 14
  },
  {
    "id": 34,
    "originalId": 35,
    "name": "Turk",
    "fullName": "Turk Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#7fe3a7",
    "burgName": "Aslani",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        923.9,
        378.6
      ],
      [
        933,
        366.6
      ],
      [
        977.5,
        367.1
      ],
      [
        1014.6,
        400.4
      ],
      [
        984.3,
        447.8
      ],
      [
        931.1,
        427.7
      ],
      [
        923.9,
        378.6
      ]
    ],
    "cx": 967,
    "cy": 411,
    "neighbors": [
      35,
      37,
      58,
      95,
      101,
      190
    ],
    "income": 14
  },
  {
    "id": 35,
    "originalId": 36,
    "name": "Saztemereli",
    "fullName": "Saztemereli Land",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#72bdbd",
    "burgName": "Kozopuz",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1014.6,
        400.4
      ],
      [
        1030.4,
        399.6
      ],
      [
        1067.7,
        424.5
      ],
      [
        1069.9,
        431
      ],
      [
        1050.6,
        476.7
      ],
      [
        994.1,
        495.3
      ],
      [
        984.3,
        447.8
      ],
      [
        1014.6,
        400.4
      ]
    ],
    "cx": 1025,
    "cy": 448,
    "neighbors": [
      34,
      36,
      37,
      38,
      68,
      155,
      190
    ],
    "income": 14
  },
  {
    "id": 36,
    "originalId": 37,
    "name": "Tai",
    "fullName": "Tai Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#91d19d",
    "burgName": "Sutsuryu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1050.6,
        476.7
      ],
      [
        1069.9,
        431
      ],
      [
        1120,
        454.8
      ],
      [
        1127.2,
        480.5
      ],
      [
        1100.8,
        504.5
      ],
      [
        1079.7,
        507.2
      ],
      [
        1050.6,
        476.7
      ]
    ],
    "cx": 1089,
    "cy": 475,
    "neighbors": [
      35,
      38,
      39,
      40,
      155,
      157
    ],
    "income": 14
  },
  {
    "id": 37,
    "originalId": 38,
    "name": "Ukaynakeli",
    "fullName": "Ukaynakeli Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#87dca0",
    "burgName": "Aman",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        976.1,
        519.4
      ],
      [
        912.1,
        452.7
      ],
      [
        931.1,
        427.7
      ],
      [
        984.3,
        447.8
      ],
      [
        994.1,
        495.3
      ],
      [
        985.2,
        512.6
      ],
      [
        976.1,
        519.4
      ]
    ],
    "cx": 947,
    "cy": 464,
    "neighbors": [
      11,
      34,
      35,
      38,
      41,
      101
    ],
    "income": 14
  },
  {
    "id": 38,
    "originalId": 39,
    "name": "Kohokura",
    "fullName": "Kohokura Region",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#76e3a7",
    "burgName": "Kama",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        994.1,
        495.3
      ],
      [
        1050.6,
        476.7
      ],
      [
        1079.7,
        507.2
      ],
      [
        1073.5,
        522
      ],
      [
        1038.1,
        541.2
      ],
      [
        985.2,
        512.6
      ],
      [
        994.1,
        495.3
      ]
    ],
    "cx": 1047,
    "cy": 515,
    "neighbors": [
      0,
      35,
      36,
      37,
      40,
      41
    ],
    "income": 14
  },
  {
    "id": 39,
    "originalId": 40,
    "name": "Tongchun Guo",
    "fullName": "Tongchun Guo Region",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#87dda1",
    "burgName": "Chuzhoulin",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1122.7,
        545.8
      ],
      [
        1100.8,
        504.5
      ],
      [
        1127.2,
        480.5
      ],
      [
        1149.2,
        490.3
      ],
      [
        1143.4,
        538.1
      ],
      [
        1122.7,
        545.8
      ]
    ],
    "cx": 1129,
    "cy": 519,
    "neighbors": [
      2,
      36,
      40,
      42,
      157
    ],
    "income": 14
  },
  {
    "id": 40,
    "originalId": 41,
    "name": "Bainanding",
    "fullName": "Bainanding Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#88db9f",
    "burgName": "Bainanding",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1079.7,
        507.2
      ],
      [
        1100.8,
        504.5
      ],
      [
        1122.7,
        545.8
      ],
      [
        1115.9,
        558.5
      ],
      [
        1110.3,
        559.8
      ],
      [
        1084.2,
        550.6
      ],
      [
        1073.5,
        522
      ],
      [
        1079.7,
        507.2
      ]
    ],
    "cx": 1097,
    "cy": 536,
    "neighbors": [
      0,
      1,
      36,
      38,
      39,
      42,
      43
    ],
    "income": 14
  },
  {
    "id": 41,
    "originalId": 42,
    "name": "Gong Guo",
    "fullName": "Gong Guo Land",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#63e0b3",
    "burgName": "Tadinguoy",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        976.1,
        519.4
      ],
      [
        985.2,
        512.6
      ],
      [
        1038.1,
        541.2
      ],
      [
        1047.6,
        568.9
      ],
      [
        1029.5,
        584.2
      ],
      [
        1000.2,
        589.5
      ],
      [
        990.3,
        586.7
      ],
      [
        969.2,
        538.3
      ],
      [
        969,
        528.9
      ],
      [
        976.1,
        519.4
      ]
    ],
    "cx": 1021,
    "cy": 563,
    "neighbors": [
      0,
      3,
      10,
      11,
      37,
      38,
      46,
      75,
      76
    ],
    "income": 14
  },
  {
    "id": 42,
    "originalId": 43,
    "name": "Zhenhaijin",
    "fullName": "Zhenhaijin Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#74bbb9",
    "burgName": "Zhenhaijin",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1122.7,
        545.8
      ],
      [
        1143.4,
        538.1
      ],
      [
        1176.6,
        552.6
      ],
      [
        1174.4,
        558.7
      ],
      [
        1146.2,
        585.9
      ],
      [
        1132.8,
        582.9
      ],
      [
        1115.9,
        558.5
      ],
      [
        1122.7,
        545.8
      ]
    ],
    "cx": 1145,
    "cy": 562,
    "neighbors": [
      2,
      32,
      39,
      40,
      43,
      44,
      192
    ],
    "income": 14
  },
  {
    "id": 43,
    "originalId": 44,
    "name": "Gimcheon",
    "fullName": "Gimcheon Land",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#66e2af",
    "burgName": "Gimcheon",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1080.5,
        601.7
      ],
      [
        1110.3,
        559.8
      ],
      [
        1115.9,
        558.5
      ],
      [
        1132.8,
        582.9
      ],
      [
        1096,
        630.8
      ],
      [
        1083.3,
        620.1
      ],
      [
        1080.5,
        601.7
      ]
    ],
    "cx": 1109,
    "cy": 587,
    "neighbors": [
      1,
      3,
      40,
      42,
      44,
      45
    ],
    "income": 14
  },
  {
    "id": 44,
    "originalId": 45,
    "name": "Shun Guo",
    "fullName": "Shun Guo Tribe",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#82babb",
    "burgName": "Yingzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1132.8,
        582.9
      ],
      [
        1146.2,
        585.9
      ],
      [
        1161.7,
        614.5
      ],
      [
        1154.5,
        634.2
      ],
      [
        1116.3,
        667.8
      ],
      [
        1096,
        630.8
      ],
      [
        1132.8,
        582.9
      ]
    ],
    "cx": 1135,
    "cy": 607,
    "neighbors": [
      33,
      42,
      43,
      45,
      192,
      195
    ],
    "income": 14
  },
  {
    "id": 45,
    "originalId": 46,
    "name": "Hongjin",
    "fullName": "Hongjin Land",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#64d1c4",
    "burgName": "Hongjin",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1030,
        636.1
      ],
      [
        1051.2,
        623.6
      ],
      [
        1083.3,
        620.1
      ],
      [
        1096,
        630.8
      ],
      [
        1116.3,
        667.8
      ],
      [
        1115,
        694.9
      ],
      [
        1099.7,
        730
      ],
      [
        1027.5,
        730
      ],
      [
        1029.3,
        637.5
      ],
      [
        1030,
        636.1
      ]
    ],
    "cx": 1055,
    "cy": 651,
    "neighbors": [
      3,
      43,
      44,
      46,
      76,
      80,
      81,
      195,
      199
    ],
    "income": 14
  },
  {
    "id": 46,
    "originalId": 47,
    "name": "Heung",
    "fullName": "Heung Territory",
    "stateId": 1,
    "stateName": "Yinan Guo",
    "stateColor": "#66c2a5",
    "provinceColor": "#86dfa1",
    "burgName": "Heung",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1000.2,
        589.5
      ],
      [
        1029.5,
        584.2
      ],
      [
        1051.2,
        623.6
      ],
      [
        1030,
        636.1
      ],
      [
        1000.2,
        589.5
      ]
    ],
    "cx": 1029,
    "cy": 607,
    "neighbors": [
      3,
      41,
      45,
      76
    ],
    "income": 14
  },
  {
    "id": 47,
    "originalId": 48,
    "name": "Qindingxin",
    "fullName": "Qindingxin Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#f78e81",
    "burgName": "Qindingxin",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        934.1,
        98.8
      ],
      [
        926.6,
        90.6
      ],
      [
        964.3,
        0
      ],
      [
        1016.6,
        0
      ],
      [
        952.6,
        93
      ],
      [
        934.1,
        98.8
      ]
    ],
    "cx": 938,
    "cy": 80,
    "neighbors": [
      6,
      22,
      49,
      142,
      180
    ],
    "income": 14
  },
  {
    "id": 48,
    "originalId": 49,
    "name": "Cheng",
    "fullName": "Cheng Area",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ffb36b",
    "burgName": "Cheng",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        930.5,
        171
      ],
      [
        930.5,
        128.9
      ],
      [
        959.5,
        126
      ],
      [
        964.4,
        175.3
      ],
      [
        963.6,
        176.3
      ],
      [
        930.5,
        171
      ]
    ],
    "cx": 951,
    "cy": 142,
    "neighbors": [
      5,
      6,
      51,
      56,
      144
    ],
    "income": 14
  },
  {
    "id": 49,
    "originalId": 50,
    "name": "Chan Guo",
    "fullName": "Chan Guo Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff8b7f",
    "burgName": "Zezhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        965.4,
        121.1
      ],
      [
        952.6,
        93
      ],
      [
        1016.6,
        0
      ],
      [
        1082.7,
        0
      ],
      [
        1056,
        60.3
      ],
      [
        1024,
        104.4
      ],
      [
        993.2,
        120.4
      ],
      [
        965.4,
        121.1
      ]
    ],
    "cx": 970,
    "cy": 102,
    "neighbors": [
      4,
      6,
      30,
      47,
      50,
      56,
      180
    ],
    "income": 14
  },
  {
    "id": 50,
    "originalId": 51,
    "name": "Kan Guo",
    "fullName": "Kan Guo Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ee9b89",
    "burgName": "Nanchengli",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1018.1,
        161.6
      ],
      [
        1024,
        104.4
      ],
      [
        1056,
        60.3
      ],
      [
        1065.6,
        187.9
      ],
      [
        1064.6,
        190.6
      ],
      [
        1051.9,
        193.4
      ],
      [
        1034.2,
        189.3
      ],
      [
        1018.1,
        161.6
      ]
    ],
    "cx": 1043,
    "cy": 155,
    "neighbors": [
      4,
      5,
      30,
      49,
      52,
      57,
      182
    ],
    "income": 14
  },
  {
    "id": 51,
    "originalId": 52,
    "name": "Dong Guo",
    "fullName": "Dong Guo Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff9669",
    "burgName": "Yazhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        898.3,
        212.7
      ],
      [
        896,
        188
      ],
      [
        930.5,
        171
      ],
      [
        963.6,
        176.3
      ],
      [
        982.6,
        221
      ],
      [
        979.1,
        236.6
      ],
      [
        954,
        257.4
      ],
      [
        898.3,
        212.7
      ]
    ],
    "cx": 941,
    "cy": 205,
    "neighbors": [
      5,
      48,
      52,
      53,
      54,
      144,
      146
    ],
    "income": 14
  },
  {
    "id": 52,
    "originalId": 53,
    "name": "Luz Guo",
    "fullName": "Luz Guo Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#e9a488",
    "burgName": "Chang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        979.1,
        236.6
      ],
      [
        982.6,
        221
      ],
      [
        1034.2,
        189.3
      ],
      [
        1051.9,
        193.4
      ],
      [
        1035.5,
        260.8
      ],
      [
        979.1,
        236.6
      ]
    ],
    "cx": 1027,
    "cy": 224,
    "neighbors": [
      5,
      50,
      51,
      54,
      57
    ],
    "income": 14
  },
  {
    "id": 53,
    "originalId": 54,
    "name": "Eren",
    "fullName": "Eren Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#f49387",
    "burgName": "Buyli",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        839.6,
        274.2
      ],
      [
        898.3,
        212.7
      ],
      [
        954,
        257.4
      ],
      [
        950.4,
        272.9
      ],
      [
        917.1,
        306.6
      ],
      [
        846.9,
        291.8
      ],
      [
        839.6,
        274.2
      ]
    ],
    "cx": 900,
    "cy": 256,
    "neighbors": [
      51,
      54,
      58,
      95,
      146,
      148
    ],
    "income": 14
  },
  {
    "id": 54,
    "originalId": 55,
    "name": "Seryurt",
    "fullName": "Seryurt Region",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff8b7f",
    "burgName": "Uvasubeyla",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        954,
        257.4
      ],
      [
        979.1,
        236.6
      ],
      [
        1035.5,
        260.8
      ],
      [
        1043.5,
        270.3
      ],
      [
        1023.8,
        308.4
      ],
      [
        963.6,
        283.6
      ],
      [
        950.4,
        272.9
      ],
      [
        954,
        257.4
      ]
    ],
    "cx": 1003,
    "cy": 280,
    "neighbors": [
      51,
      52,
      53,
      55,
      57,
      58,
      186
    ],
    "income": 14
  },
  {
    "id": 55,
    "originalId": 56,
    "name": "Huiping",
    "fullName": "Huiping Land",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#e6a786",
    "burgName": "Huiping",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        989.8,
        345
      ],
      [
        963.6,
        283.6
      ],
      [
        1023.8,
        308.4
      ],
      [
        1024.4,
        316.8
      ],
      [
        989.8,
        345
      ]
    ],
    "cx": 989,
    "cy": 314,
    "neighbors": [
      54,
      58,
      186,
      190
    ],
    "income": 14
  },
  {
    "id": 56,
    "originalId": 57,
    "name": "Caoz Guo",
    "fullName": "Caoz Guo Land",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff936d",
    "burgName": "Caoz Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        964.4,
        175.3
      ],
      [
        959.5,
        126
      ],
      [
        965.4,
        121.1
      ],
      [
        993.2,
        120.4
      ],
      [
        973,
        169.1
      ],
      [
        964.4,
        175.3
      ]
    ],
    "cx": 971,
    "cy": 140,
    "neighbors": [
      4,
      5,
      6,
      48,
      49
    ],
    "income": 14
  },
  {
    "id": 57,
    "originalId": 58,
    "name": "Shiqin Guo",
    "fullName": "Shiqin Guo Territory",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff8e75",
    "burgName": "Shiqin Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1035.5,
        260.8
      ],
      [
        1051.9,
        193.4
      ],
      [
        1064.6,
        190.6
      ],
      [
        1084.3,
        206.3
      ],
      [
        1069.6,
        270.6
      ],
      [
        1043.5,
        270.3
      ],
      [
        1035.5,
        260.8
      ]
    ],
    "cx": 1060,
    "cy": 232,
    "neighbors": [
      50,
      52,
      54,
      182,
      184,
      186
    ],
    "income": 14
  },
  {
    "id": 58,
    "originalId": 59,
    "name": "Gamanyurt",
    "fullName": "Gamanyurt Land",
    "stateId": 2,
    "stateName": "Dong Guo",
    "stateColor": "#fc8d62",
    "provinceColor": "#ff9c64",
    "burgName": "Gamanyurt",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        917.1,
        306.6
      ],
      [
        950.4,
        272.9
      ],
      [
        963.6,
        283.6
      ],
      [
        989.8,
        345
      ],
      [
        977.5,
        367.1
      ],
      [
        933,
        366.6
      ],
      [
        917.1,
        306.6
      ]
    ],
    "cx": 968,
    "cy": 323,
    "neighbors": [
      34,
      53,
      54,
      55,
      95,
      190
    ],
    "income": 14
  },
  {
    "id": 59,
    "originalId": 60,
    "name": "Fenz Guo",
    "fullName": "Fenz Guo Land",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#8caae6",
    "burgName": "Yanyang",
    "isCapital": false,
    "terrain": "forest",
    "polygon": [
      [
        1207,
        205.8
      ],
      [
        1239.3,
        156.7
      ],
      [
        1240.7,
        156.9
      ],
      [
        1260.8,
        167.2
      ],
      [
        1269.4,
        207.4
      ],
      [
        1222.2,
        216.5
      ],
      [
        1207,
        205.8
      ]
    ],
    "cx": 1243,
    "cy": 199,
    "neighbors": [
      60,
      62,
      63,
      180,
      181,
      189
    ],
    "income": 8
  },
  {
    "id": 60,
    "originalId": 61,
    "name": "Fengz Guo",
    "fullName": "Fengz Guo Territory",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#959ddc",
    "burgName": "Angan",
    "isCapital": false,
    "terrain": "forest",
    "polygon": [
      [
        1269.4,
        207.4
      ],
      [
        1260.8,
        167.2
      ],
      [
        1270.5,
        164.7
      ],
      [
        1427.6,
        196.9
      ],
      [
        1289.4,
        219.9
      ],
      [
        1278.9,
        218.6
      ],
      [
        1269.4,
        207.4
      ]
    ],
    "cx": 1290,
    "cy": 189,
    "neighbors": [
      8,
      59,
      61,
      62,
      69,
      189
    ],
    "income": 8
  },
  {
    "id": 61,
    "originalId": 62,
    "name": "Kan Guo",
    "fullName": "Kan Guo Territory",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#83bbe0",
    "burgName": "Puzhong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1536,
        254.4
      ],
      [
        1292.4,
        274.3
      ],
      [
        1289.4,
        219.9
      ],
      [
        1427.6,
        196.9
      ],
      [
        1536,
        194.7
      ],
      [
        1536,
        254.4
      ]
    ],
    "cx": 1300,
    "cy": 249,
    "neighbors": [
      8,
      60,
      69,
      70,
      152
    ],
    "income": 14
  },
  {
    "id": 62,
    "originalId": 63,
    "name": "Chang",
    "fullName": "Chang Territory",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#989ddb",
    "burgName": "Ganzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1230.1,
        232.7
      ],
      [
        1222.2,
        216.5
      ],
      [
        1269.4,
        207.4
      ],
      [
        1278.9,
        218.6
      ],
      [
        1260.5,
        243.6
      ],
      [
        1230.1,
        232.7
      ]
    ],
    "cx": 1248,
    "cy": 225,
    "neighbors": [
      7,
      8,
      59,
      60,
      63
    ],
    "income": 14
  },
  {
    "id": 63,
    "originalId": 64,
    "name": "Ningqin Guo",
    "fullName": "Ningqin Guo Dependency",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#87b3e5",
    "burgName": "Fenzhouai",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1183,
        236.9
      ],
      [
        1193.7,
        208.4
      ],
      [
        1207,
        205.8
      ],
      [
        1222.2,
        216.5
      ],
      [
        1230.1,
        232.7
      ],
      [
        1218.4,
        270.9
      ],
      [
        1183.6,
        242.1
      ],
      [
        1183,
        236.9
      ]
    ],
    "cx": 1213,
    "cy": 242,
    "neighbors": [
      7,
      9,
      31,
      59,
      62,
      181,
      185
    ],
    "income": 14
  },
  {
    "id": 64,
    "originalId": 65,
    "name": "Yongnin Guo",
    "fullName": "Yongnin Guo Territory",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#a99cdb",
    "burgName": "Dongchang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1228.3,
        279.9
      ],
      [
        1260.5,
        258.8
      ],
      [
        1286.8,
        276.9
      ],
      [
        1280.5,
        294.2
      ],
      [
        1253.1,
        303
      ],
      [
        1232.8,
        298.8
      ],
      [
        1228.3,
        279.9
      ]
    ],
    "cx": 1260,
    "cy": 282,
    "neighbors": [
      7,
      8,
      24,
      25,
      66,
      70
    ],
    "income": 14
  },
  {
    "id": 65,
    "originalId": 66,
    "name": "Xinchang",
    "fullName": "Xinchang Tribe",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#ad9cda",
    "burgName": "Siyang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1105.1,
        306.6
      ],
      [
        1154.7,
        280.1
      ],
      [
        1158.8,
        280.4
      ],
      [
        1173.1,
        294
      ],
      [
        1181.3,
        321.3
      ],
      [
        1169.6,
        345.1
      ],
      [
        1154.7,
        349
      ],
      [
        1107.2,
        312.3
      ],
      [
        1105.1,
        307
      ],
      [
        1105.1,
        306.6
      ]
    ],
    "cx": 1151,
    "cy": 311,
    "neighbors": [
      9,
      31,
      66,
      67,
      150,
      153,
      186,
      187,
      188
    ],
    "income": 14
  },
  {
    "id": 66,
    "originalId": 67,
    "name": "Ping",
    "fullName": "Ping Dependency",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#b7a1cf",
    "burgName": "Yihuanansu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1173.1,
        294
      ],
      [
        1218.9,
        272.1
      ],
      [
        1228.3,
        279.9
      ],
      [
        1232.8,
        298.8
      ],
      [
        1223.8,
        314.4
      ],
      [
        1181.3,
        321.3
      ],
      [
        1173.1,
        294
      ]
    ],
    "cx": 1201,
    "cy": 296,
    "neighbors": [
      7,
      9,
      24,
      64,
      65,
      150
    ],
    "income": 14
  },
  {
    "id": 67,
    "originalId": 68,
    "name": "Yongshun Guo",
    "fullName": "Yongshun Guo Region",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#83bbe0",
    "burgName": "Jingzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1094.5,
        353.4
      ],
      [
        1107.2,
        312.3
      ],
      [
        1154.7,
        349
      ],
      [
        1145.2,
        366.4
      ],
      [
        1101.3,
        360.5
      ],
      [
        1094.5,
        353.4
      ]
    ],
    "cx": 1117,
    "cy": 355,
    "neighbors": [
      65,
      71,
      72,
      153,
      188
    ],
    "income": 14
  },
  {
    "id": 68,
    "originalId": 69,
    "name": "Erineli",
    "fullName": "Erineli Clan",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#8caae6",
    "burgName": "Aslan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1030.4,
        399.6
      ],
      [
        1049.4,
        357.6
      ],
      [
        1084,
        359.6
      ],
      [
        1084,
        407.8
      ],
      [
        1067.7,
        424.5
      ],
      [
        1030.4,
        399.6
      ]
    ],
    "cx": 1073,
    "cy": 376,
    "neighbors": [
      35,
      71,
      155,
      188,
      190
    ],
    "income": 14
  },
  {
    "id": 69,
    "originalId": 70,
    "name": "Liuz Guo",
    "fullName": "Liuz Guo Islands",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#93a1e2",
    "burgName": "Liuz Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1536,
        194.7
      ],
      [
        1427.6,
        196.9
      ],
      [
        1270.5,
        164.7
      ],
      [
        1390.3,
        0
      ],
      [
        1536,
        0
      ],
      [
        1536,
        194.7
      ]
    ],
    "cx": 1298,
    "cy": 150,
    "neighbors": [
      60,
      61,
      152,
      180,
      189
    ],
    "income": 14
  },
  {
    "id": 70,
    "originalId": 71,
    "name": "Shuangan Guo",
    "fullName": "Shuangan Guo Dependency",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#b5b0c1",
    "burgName": "Shuangan Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1286.8,
        276.9
      ],
      [
        1292.4,
        274.3
      ],
      [
        1536,
        254.4
      ],
      [
        1536,
        278
      ],
      [
        1295.3,
        320.1
      ],
      [
        1294.4,
        319.7
      ],
      [
        1280.5,
        294.2
      ],
      [
        1286.8,
        276.9
      ]
    ],
    "cx": 1304,
    "cy": 298,
    "neighbors": [
      8,
      25,
      61,
      64,
      151,
      152
    ],
    "income": 14
  },
  {
    "id": 71,
    "originalId": 72,
    "name": "Yumeta",
    "fullName": "Yumeta Dependency",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#88b0e6",
    "burgName": "Yumeta",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1084,
        407.8
      ],
      [
        1084,
        359.6
      ],
      [
        1094.5,
        353.4
      ],
      [
        1101.3,
        360.5
      ],
      [
        1111.3,
        394.1
      ],
      [
        1084,
        407.8
      ]
    ],
    "cx": 1095,
    "cy": 376,
    "neighbors": [
      67,
      68,
      72,
      155,
      188
    ],
    "income": 14
  },
  {
    "id": 72,
    "originalId": 73,
    "name": "Sokubetu",
    "fullName": "Sokubetu Territory",
    "stateId": 3,
    "stateName": "Shaoz Guo",
    "stateColor": "#8da0cb",
    "provinceColor": "#8baae6",
    "burgName": "Sokubetu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1111.3,
        394.1
      ],
      [
        1101.3,
        360.5
      ],
      [
        1145.2,
        366.4
      ],
      [
        1138.3,
        393.5
      ],
      [
        1111.3,
        394.1
      ]
    ],
    "cx": 1115,
    "cy": 370,
    "neighbors": [
      67,
      71,
      153,
      155
    ],
    "income": 14
  },
  {
    "id": 73,
    "originalId": 74,
    "name": "Kaoaikia",
    "fullName": "Kaoaikia Land",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#ff8ec5",
    "burgName": "Kalele",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        871.5,
        533.3
      ],
      [
        885.7,
        479.1
      ],
      [
        940.8,
        527.8
      ],
      [
        910.8,
        539.3
      ],
      [
        871.5,
        533.3
      ]
    ],
    "cx": 899,
    "cy": 514,
    "neighbors": [
      10,
      11,
      74,
      110
    ],
    "income": 14
  },
  {
    "id": 74,
    "originalId": 75,
    "name": "Hokia",
    "fullName": "Hokia Land",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#e1b2c4",
    "burgName": "Wamena",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        871.5,
        533.3
      ],
      [
        910.8,
        539.3
      ],
      [
        897.7,
        598.3
      ],
      [
        861.5,
        539.5
      ],
      [
        871.5,
        533.3
      ]
    ],
    "cx": 892,
    "cy": 560,
    "neighbors": [
      10,
      73,
      110,
      118
    ],
    "income": 14
  },
  {
    "id": 75,
    "originalId": 76,
    "name": "Cheonguk",
    "fullName": "Cheonguk Territory",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#e191dc",
    "burgName": "Gaunsanbong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        917.8,
        601.1
      ],
      [
        969.2,
        538.3
      ],
      [
        990.3,
        586.7
      ],
      [
        973.9,
        615
      ],
      [
        932.5,
        614.1
      ],
      [
        917.8,
        601.1
      ]
    ],
    "cx": 952,
    "cy": 593,
    "neighbors": [
      10,
      41,
      76,
      77,
      78
    ],
    "income": 14
  },
  {
    "id": 76,
    "originalId": 77,
    "name": "Pohanguk",
    "fullName": "Pohanguk Land",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#e789d3",
    "burgName": "Wegyeon",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        990.3,
        586.7
      ],
      [
        1000.2,
        589.5
      ],
      [
        1030,
        636.1
      ],
      [
        1029.3,
        637.5
      ],
      [
        979,
        635.6
      ],
      [
        973.9,
        615
      ],
      [
        990.3,
        586.7
      ]
    ],
    "cx": 1004,
    "cy": 623,
    "neighbors": [
      41,
      45,
      46,
      75,
      78,
      80
    ],
    "income": 14
  },
  {
    "id": 77,
    "originalId": 78,
    "name": "Jidonando",
    "fullName": "Jidonando Land",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#d7afcd",
    "burgName": "Jidonando",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        897.9,
        599.7
      ],
      [
        917.8,
        601.1
      ],
      [
        932.5,
        614.1
      ],
      [
        932.5,
        657
      ],
      [
        905.9,
        697
      ],
      [
        884.3,
        610.6
      ],
      [
        897.9,
        599.7
      ]
    ],
    "cx": 914,
    "cy": 636,
    "neighbors": [
      10,
      75,
      78,
      79,
      81,
      118
    ],
    "income": 14
  },
  {
    "id": 78,
    "originalId": 79,
    "name": "Cheon",
    "fullName": "Cheon Territory",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#dd95df",
    "burgName": "Cheon",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        932.5,
        614.1
      ],
      [
        973.9,
        615
      ],
      [
        979,
        635.6
      ],
      [
        976.4,
        645.3
      ],
      [
        932.5,
        657
      ],
      [
        932.5,
        614.1
      ]
    ],
    "cx": 951,
    "cy": 636,
    "neighbors": [
      75,
      76,
      77,
      80,
      81
    ],
    "income": 14
  },
  {
    "id": 79,
    "originalId": 80,
    "name": "Okcheonguk",
    "fullName": "Okcheonguk Land",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#d3a8d8",
    "burgName": "Tean",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        743.4,
        730
      ],
      [
        840,
        613.1
      ],
      [
        884.3,
        610.6
      ],
      [
        905.9,
        697
      ],
      [
        898.8,
        730
      ],
      [
        743.4,
        730
      ]
    ],
    "cx": 870,
    "cy": 647,
    "neighbors": [
      77,
      81,
      118,
      121,
      138,
      140
    ],
    "income": 14
  },
  {
    "id": 80,
    "originalId": 81,
    "name": "Songpo",
    "fullName": "Songpo Region",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#e58ad6",
    "burgName": "Songpo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        979,
        635.6
      ],
      [
        1029.3,
        637.5
      ],
      [
        1027.5,
        730
      ],
      [
        1007.2,
        730
      ],
      [
        976.4,
        645.3
      ],
      [
        979,
        635.6
      ]
    ],
    "cx": 1003,
    "cy": 650,
    "neighbors": [
      45,
      76,
      78,
      81
    ],
    "income": 14
  },
  {
    "id": 81,
    "originalId": 82,
    "name": "Samcheok",
    "fullName": "Samcheok Island",
    "stateId": 4,
    "stateName": "Yeonguk",
    "stateColor": "#e78ac3",
    "provinceColor": "#ff8ec6",
    "burgName": "Samcheok",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        932.5,
        657
      ],
      [
        976.4,
        645.3
      ],
      [
        1007.2,
        730
      ],
      [
        898.8,
        730
      ],
      [
        905.9,
        697
      ],
      [
        932.5,
        657
      ]
    ],
    "cx": 959,
    "cy": 666,
    "neighbors": [
      45,
      77,
      78,
      79,
      80,
      140,
      199
    ],
    "income": 14
  },
  {
    "id": 82,
    "originalId": 83,
    "name": "Hoholi",
    "fullName": "Hoholi Region",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9ce67c",
    "burgName": "Hoholi",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        485.5,
        272.7
      ],
      [
        459.4,
        268.4
      ],
      [
        444.6,
        215.4
      ],
      [
        487.6,
        211.8
      ],
      [
        514.2,
        219.5
      ],
      [
        514.7,
        247.8
      ],
      [
        485.5,
        272.7
      ]
    ],
    "cx": 487,
    "cy": 236,
    "neighbors": [
      86,
      90,
      125,
      175,
      176,
      177
    ],
    "income": 14
  },
  {
    "id": 83,
    "originalId": 84,
    "name": "Pali",
    "fullName": "Pali Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a6f762",
    "burgName": "Pali",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        433.6,
        204.9
      ],
      [
        392.6,
        270.5
      ],
      [
        389.5,
        271.1
      ],
      [
        365.2,
        215.4
      ],
      [
        373.7,
        196.6
      ],
      [
        411.8,
        168
      ],
      [
        433.6,
        204.9
      ]
    ],
    "cx": 395,
    "cy": 240,
    "neighbors": [
      15,
      85,
      89,
      123,
      125,
      175
    ],
    "income": 14
  },
  {
    "id": 84,
    "originalId": 85,
    "name": "Kuaile",
    "fullName": "Kuaile Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cdd364",
    "burgName": "Kuaile",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        306.1,
        285.9
      ],
      [
        288,
        289.9
      ],
      [
        223.1,
        199.1
      ],
      [
        274.5,
        205.7
      ],
      [
        290.9,
        212
      ],
      [
        319.1,
        235.1
      ],
      [
        306.1,
        285.9
      ]
    ],
    "cx": 295,
    "cy": 248,
    "neighbors": [
      15,
      16,
      18,
      87,
      88,
      91
    ],
    "income": 14
  },
  {
    "id": 85,
    "originalId": 86,
    "name": "Pokia",
    "fullName": "Pokia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9aee74",
    "burgName": "Moanaleha",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        345.1,
        231.4
      ],
      [
        365.2,
        215.4
      ],
      [
        389.5,
        271.1
      ],
      [
        356.6,
        303.2
      ],
      [
        354.8,
        302
      ],
      [
        345.1,
        231.4
      ]
    ],
    "cx": 363,
    "cy": 254,
    "neighbors": [
      15,
      83,
      88,
      89,
      91
    ],
    "income": 14
  },
  {
    "id": 86,
    "originalId": 87,
    "name": "Nuuhana",
    "fullName": "Nuuhana Dependency",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#afce72",
    "burgName": "Nuuhana",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        570.2,
        260.7
      ],
      [
        557.3,
        268
      ],
      [
        514.7,
        247.8
      ],
      [
        514.2,
        219.5
      ],
      [
        518.2,
        215.7
      ],
      [
        563.2,
        203.5
      ],
      [
        576.9,
        208.9
      ],
      [
        570.2,
        260.7
      ]
    ],
    "cx": 542,
    "cy": 235,
    "neighbors": [
      82,
      166,
      167,
      169,
      172,
      176,
      177
    ],
    "income": 14
  },
  {
    "id": 87,
    "originalId": 88,
    "name": "Kahouka",
    "fullName": "Kahouka Clan",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9bf36e",
    "burgName": "Kahouka",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        0,
        82.7
      ],
      [
        223.1,
        199.1
      ],
      [
        288,
        289.9
      ],
      [
        268.9,
        319.8
      ],
      [
        249.6,
        323
      ],
      [
        0,
        269.7
      ],
      [
        0,
        82.7
      ]
    ],
    "cx": 246,
    "cy": 283,
    "neighbors": [
      16,
      84,
      91,
      93,
      126
    ],
    "income": 14
  },
  {
    "id": 88,
    "originalId": 89,
    "name": "Kukaleuki",
    "fullName": "Kukaleuki Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a7d77a",
    "burgName": "Kukaleuki",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        345.1,
        231.4
      ],
      [
        354.8,
        302
      ],
      [
        306.1,
        285.9
      ],
      [
        319.1,
        235.1
      ],
      [
        345.1,
        231.4
      ]
    ],
    "cx": 334,
    "cy": 258,
    "neighbors": [
      15,
      84,
      85,
      91
    ],
    "income": 14
  },
  {
    "id": 89,
    "originalId": 90,
    "name": "Kaapa",
    "fullName": "Kaapa Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#c9e456",
    "burgName": "Kaapa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        443,
        285.7
      ],
      [
        436.6,
        329.8
      ],
      [
        359.7,
        314.1
      ],
      [
        356.6,
        303.2
      ],
      [
        389.5,
        271.1
      ],
      [
        392.6,
        270.5
      ],
      [
        443,
        285.7
      ]
    ],
    "cx": 406,
    "cy": 298,
    "neighbors": [
      83,
      85,
      90,
      91,
      92,
      125
    ],
    "income": 14
  },
  {
    "id": 90,
    "originalId": 91,
    "name": "Wailapi",
    "fullName": "Wailapi Area",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b5f65f",
    "burgName": "Pumale",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        485.5,
        272.7
      ],
      [
        518.4,
        322.7
      ],
      [
        503.1,
        352.9
      ],
      [
        440.2,
        337
      ],
      [
        436.6,
        329.8
      ],
      [
        443,
        285.7
      ],
      [
        459.4,
        268.4
      ],
      [
        485.5,
        272.7
      ]
    ],
    "cx": 475,
    "cy": 308,
    "neighbors": [
      82,
      89,
      92,
      94,
      96,
      125,
      177
    ],
    "income": 14
  },
  {
    "id": 91,
    "originalId": 92,
    "name": "Ohia",
    "fullName": "Ohia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9bea78",
    "burgName": "Malelimao",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        359.7,
        314.1
      ],
      [
        346.2,
        365.7
      ],
      [
        303.7,
        369.6
      ],
      [
        268.9,
        319.8
      ],
      [
        288,
        289.9
      ],
      [
        306.1,
        285.9
      ],
      [
        354.8,
        302
      ],
      [
        356.6,
        303.2
      ],
      [
        359.7,
        314.1
      ]
    ],
    "cx": 312,
    "cy": 325,
    "neighbors": [
      84,
      85,
      87,
      88,
      89,
      92,
      93,
      97
    ],
    "income": 14
  },
  {
    "id": 92,
    "originalId": 93,
    "name": "Puoko",
    "fullName": "Puoko Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9aee74",
    "burgName": "Puoko",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        413.4,
        388
      ],
      [
        368,
        391.2
      ],
      [
        346.2,
        365.7
      ],
      [
        359.7,
        314.1
      ],
      [
        436.6,
        329.8
      ],
      [
        440.2,
        337
      ],
      [
        413.4,
        388
      ]
    ],
    "cx": 396,
    "cy": 347,
    "neighbors": [
      89,
      90,
      91,
      96,
      97,
      102
    ],
    "income": 14
  },
  {
    "id": 93,
    "originalId": 94,
    "name": "Puanimia",
    "fullName": "Puanimia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b2f75f",
    "burgName": "Holipuia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        303.7,
        369.6
      ],
      [
        283.9,
        393.9
      ],
      [
        240.8,
        386.7
      ],
      [
        249.6,
        323
      ],
      [
        268.9,
        319.8
      ],
      [
        303.7,
        369.6
      ]
    ],
    "cx": 259,
    "cy": 362,
    "neighbors": [
      87,
      91,
      97,
      100,
      126
    ],
    "income": 14
  },
  {
    "id": 94,
    "originalId": 95,
    "name": "Bayakyurt",
    "fullName": "Bayakyurt Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9af072",
    "burgName": "Ediyurtlu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        593.8,
        335
      ],
      [
        605.3,
        395.3
      ],
      [
        574.3,
        399.5
      ],
      [
        504.2,
        356.4
      ],
      [
        503.1,
        352.9
      ],
      [
        518.4,
        322.7
      ],
      [
        540.7,
        312.2
      ],
      [
        593.8,
        335
      ]
    ],
    "cx": 556,
    "cy": 349,
    "neighbors": [
      90,
      96,
      98,
      104,
      172,
      177,
      179
    ],
    "income": 14
  },
  {
    "id": 95,
    "originalId": 96,
    "name": "Yarobalaz",
    "fullName": "Yarobalaz Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9cf46b",
    "burgName": "Yarobalaz",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        820,
        353.9
      ],
      [
        846.9,
        291.8
      ],
      [
        917.1,
        306.6
      ],
      [
        933,
        366.6
      ],
      [
        923.9,
        378.6
      ],
      [
        852.2,
        389
      ],
      [
        820,
        353.9
      ]
    ],
    "cx": 881,
    "cy": 346,
    "neighbors": [
      34,
      53,
      58,
      99,
      101,
      148
    ],
    "income": 14
  },
  {
    "id": 96,
    "originalId": 97,
    "name": "Keonolia",
    "fullName": "Keonolia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a5f763",
    "burgName": "Kunau",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        504.2,
        356.4
      ],
      [
        487.1,
        396.9
      ],
      [
        420,
        394.9
      ],
      [
        413.4,
        388
      ],
      [
        440.2,
        337
      ],
      [
        503.1,
        352.9
      ],
      [
        504.2,
        356.4
      ]
    ],
    "cx": 457,
    "cy": 379,
    "neighbors": [
      90,
      92,
      94,
      98,
      102,
      127
    ],
    "income": 14
  },
  {
    "id": 97,
    "originalId": 98,
    "name": "Ponouhewa",
    "fullName": "Ponouhewa Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#bff059",
    "burgName": "Ponouhewa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        368,
        391.2
      ],
      [
        354.6,
        449
      ],
      [
        287.8,
        422.3
      ],
      [
        285.1,
        416.5
      ],
      [
        283.9,
        393.9
      ],
      [
        303.7,
        369.6
      ],
      [
        346.2,
        365.7
      ],
      [
        368,
        391.2
      ]
    ],
    "cx": 320,
    "cy": 412,
    "neighbors": [
      20,
      91,
      92,
      93,
      100,
      102,
      106
    ],
    "income": 14
  },
  {
    "id": 98,
    "originalId": 99,
    "name": "Keloholahu",
    "fullName": "Keloholahu Area",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9af073",
    "burgName": "Keloholahu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        504.2,
        356.4
      ],
      [
        574.3,
        399.5
      ],
      [
        524.2,
        451.7
      ],
      [
        490.5,
        427.9
      ],
      [
        487.1,
        396.9
      ],
      [
        504.2,
        356.4
      ]
    ],
    "cx": 521,
    "cy": 406,
    "neighbors": [
      94,
      96,
      104,
      107,
      127
    ],
    "income": 14
  },
  {
    "id": 99,
    "originalId": 100,
    "name": "Kayli",
    "fullName": "Kayli Dependency",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9be979",
    "burgName": "Kayli",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        771,
        439.7
      ],
      [
        771,
        364.1
      ],
      [
        820,
        353.9
      ],
      [
        852.2,
        389
      ],
      [
        851.7,
        394.2
      ],
      [
        810.5,
        452.6
      ],
      [
        810,
        452.9
      ],
      [
        771,
        439.7
      ]
    ],
    "cx": 807,
    "cy": 414,
    "neighbors": [
      95,
      101,
      109,
      128,
      129,
      132,
      148
    ],
    "income": 14
  },
  {
    "id": 100,
    "originalId": 101,
    "name": "Pelia",
    "fullName": "Pelia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a0f666",
    "burgName": "Waiaulana",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        268.9,
        422.6
      ],
      [
        104.6,
        461.7
      ],
      [
        0,
        477
      ],
      [
        0,
        469.8
      ],
      [
        240.8,
        386.7
      ],
      [
        283.9,
        393.9
      ],
      [
        285.1,
        416.5
      ],
      [
        268.9,
        422.6
      ]
    ],
    "cx": 250,
    "cy": 416,
    "neighbors": [
      20,
      93,
      97,
      105,
      126,
      130
    ],
    "income": 14
  },
  {
    "id": 101,
    "originalId": 102,
    "name": "Boyleli",
    "fullName": "Boyleli Region",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a8d578",
    "burgName": "Kortoprak",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        851.7,
        394.2
      ],
      [
        852.2,
        389
      ],
      [
        923.9,
        378.6
      ],
      [
        931.1,
        427.7
      ],
      [
        912.1,
        452.7
      ],
      [
        886.2,
        464.5
      ],
      [
        884.5,
        462.8
      ],
      [
        851.7,
        394.2
      ]
    ],
    "cx": 892,
    "cy": 422,
    "neighbors": [
      11,
      34,
      37,
      95,
      99,
      129,
      132
    ],
    "income": 14
  },
  {
    "id": 102,
    "originalId": 103,
    "name": "Pukia",
    "fullName": "Pukia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9ee37d",
    "burgName": "Panapomu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        413.4,
        388
      ],
      [
        420,
        394.9
      ],
      [
        439,
        452.1
      ],
      [
        429.1,
        475.6
      ],
      [
        364.8,
        482.5
      ],
      [
        361.6,
        481.8
      ],
      [
        354.6,
        449
      ],
      [
        368,
        391.2
      ],
      [
        413.4,
        388
      ]
    ],
    "cx": 402,
    "cy": 431,
    "neighbors": [
      14,
      92,
      96,
      97,
      106,
      107,
      114,
      127
    ],
    "income": 14
  },
  {
    "id": 103,
    "originalId": 104,
    "name": "Yazyurt",
    "fullName": "Yazyurt Dependency",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9be979",
    "burgName": "Yazbeynak",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        684.8,
        378.2
      ],
      [
        720.2,
        473.8
      ],
      [
        709.3,
        480.3
      ],
      [
        638.3,
        471.7
      ],
      [
        616,
        419.2
      ],
      [
        613.1,
        399.5
      ],
      [
        680.1,
        376.3
      ],
      [
        684.8,
        378.2
      ]
    ],
    "cx": 670,
    "cy": 438,
    "neighbors": [
      104,
      108,
      116,
      128,
      131,
      178,
      179
    ],
    "income": 14
  },
  {
    "id": 104,
    "originalId": 105,
    "name": "Seluun",
    "fullName": "Seluun Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b8ce73",
    "burgName": "Seluun",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        613.1,
        399.5
      ],
      [
        616,
        419.2
      ],
      [
        567.9,
        478
      ],
      [
        527.9,
        482.1
      ],
      [
        524.2,
        451.7
      ],
      [
        574.3,
        399.5
      ],
      [
        605.3,
        395.3
      ],
      [
        613.1,
        399.5
      ]
    ],
    "cx": 570,
    "cy": 453,
    "neighbors": [
      94,
      98,
      103,
      107,
      111,
      131,
      179
    ],
    "income": 14
  },
  {
    "id": 105,
    "originalId": 106,
    "name": "Kauaileha",
    "fullName": "Kauaileha Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a1dd7d",
    "burgName": "Kauaileha",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        268.9,
        422.6
      ],
      [
        247.5,
        451.1
      ],
      [
        104.6,
        461.7
      ],
      [
        268.9,
        422.6
      ]
    ],
    "cx": 255,
    "cy": 437,
    "neighbors": [
      20,
      100,
      130
    ],
    "income": 14
  },
  {
    "id": 106,
    "originalId": 107,
    "name": "Keohia",
    "fullName": "Keohia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#abcf73",
    "burgName": "Wailinilea",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        361.6,
        481.8
      ],
      [
        299,
        530.3
      ],
      [
        279.4,
        453.8
      ],
      [
        287.8,
        422.3
      ],
      [
        354.6,
        449
      ],
      [
        361.6,
        481.8
      ]
    ],
    "cx": 304,
    "cy": 452,
    "neighbors": [
      14,
      20,
      97,
      102,
      130
    ],
    "income": 14
  },
  {
    "id": 107,
    "originalId": 108,
    "name": "Kulukapuu",
    "fullName": "Kulukapuu Clan",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cce157",
    "burgName": "Kulukapuu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        527.9,
        482.1
      ],
      [
        517.4,
        508.4
      ],
      [
        505.1,
        510
      ],
      [
        452.4,
        501.7
      ],
      [
        429.1,
        475.6
      ],
      [
        439,
        452.1
      ],
      [
        490.5,
        427.9
      ],
      [
        524.2,
        451.7
      ],
      [
        527.9,
        482.1
      ]
    ],
    "cx": 480,
    "cy": 464,
    "neighbors": [
      98,
      102,
      104,
      111,
      112,
      114,
      127,
      135
    ],
    "income": 14
  },
  {
    "id": 108,
    "originalId": 109,
    "name": "Mahu",
    "fullName": "Mahu Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#adcf70",
    "burgName": "Ulanepai",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        638.3,
        471.7
      ],
      [
        709.3,
        480.3
      ],
      [
        684.7,
        552.1
      ],
      [
        668.7,
        567.6
      ],
      [
        627.7,
        552
      ],
      [
        615.4,
        529.3
      ],
      [
        618.2,
        505.5
      ],
      [
        638.3,
        471.7
      ]
    ],
    "cx": 661,
    "cy": 512,
    "neighbors": [
      103,
      111,
      113,
      116,
      120,
      131,
      138
    ],
    "income": 14
  },
  {
    "id": 109,
    "originalId": 110,
    "name": "Kauhia",
    "fullName": "Kauhia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a8d579",
    "burgName": "Mapaliau",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        771,
        439.7
      ],
      [
        810,
        452.9
      ],
      [
        813.6,
        474.3
      ],
      [
        809.5,
        490.6
      ],
      [
        788.1,
        528.5
      ],
      [
        783.9,
        530.7
      ],
      [
        776.1,
        529.8
      ],
      [
        723.4,
        474
      ],
      [
        771,
        439.7
      ]
    ],
    "cx": 784,
    "cy": 482,
    "neighbors": [
      19,
      99,
      115,
      116,
      117,
      128,
      132,
      133
    ],
    "income": 14
  },
  {
    "id": 110,
    "originalId": 111,
    "name": "Kamimia",
    "fullName": "Kamimia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a1dd7d",
    "burgName": "Kaohi",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        851,
        487.3
      ],
      [
        884.4,
        473.3
      ],
      [
        885.7,
        479.1
      ],
      [
        871.5,
        533.3
      ],
      [
        861.5,
        539.5
      ],
      [
        857.8,
        540
      ],
      [
        848.9,
        534.7
      ],
      [
        843.7,
        506.4
      ],
      [
        851,
        487.3
      ]
    ],
    "cx": 857,
    "cy": 503,
    "neighbors": [
      11,
      19,
      73,
      74,
      115,
      118,
      132,
      133
    ],
    "income": 14
  },
  {
    "id": 111,
    "originalId": 112,
    "name": "Peohiapaa",
    "fullName": "Peohiapaa Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9aeb77",
    "burgName": "Peohiapaa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        527.9,
        482.1
      ],
      [
        567.9,
        478
      ],
      [
        618.2,
        505.5
      ],
      [
        615.4,
        529.3
      ],
      [
        538,
        530.7
      ],
      [
        527.1,
        521.9
      ],
      [
        517.4,
        508.4
      ],
      [
        527.9,
        482.1
      ]
    ],
    "cx": 575,
    "cy": 502,
    "neighbors": [
      104,
      107,
      108,
      113,
      131,
      135,
      136
    ],
    "income": 14
  },
  {
    "id": 112,
    "originalId": 113,
    "name": "New Puehuhia",
    "fullName": "New Puehuhia Colony",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9ce67c",
    "burgName": "Puehakale",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        505.1,
        510
      ],
      [
        469.6,
        571.5
      ],
      [
        443,
        568.9
      ],
      [
        444,
        523.8
      ],
      [
        452.4,
        501.7
      ],
      [
        505.1,
        510
      ]
    ],
    "cx": 467,
    "cy": 546,
    "neighbors": [
      107,
      114,
      119,
      134,
      135
    ],
    "income": 14
  },
  {
    "id": 113,
    "originalId": 114,
    "name": "Pupoia",
    "fullName": "Pupoia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a7d67a",
    "burgName": "Pupapakai",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        538,
        530.7
      ],
      [
        615.4,
        529.3
      ],
      [
        627.7,
        552
      ],
      [
        591.8,
        591
      ],
      [
        551.8,
        575.7
      ],
      [
        545.3,
        559.1
      ],
      [
        538,
        530.7
      ]
    ],
    "cx": 576,
    "cy": 558,
    "neighbors": [
      108,
      111,
      120,
      122,
      136,
      137
    ],
    "income": 14
  },
  {
    "id": 114,
    "originalId": 115,
    "name": "Wamoalaa",
    "fullName": "Wamoalaa Island",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cdd363",
    "burgName": "Wamoalaa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        452.4,
        501.7
      ],
      [
        444,
        523.8
      ],
      [
        398,
        542.2
      ],
      [
        364.8,
        482.5
      ],
      [
        429.1,
        475.6
      ],
      [
        452.4,
        501.7
      ]
    ],
    "cx": 412,
    "cy": 525,
    "neighbors": [
      14,
      102,
      107,
      112,
      134
    ],
    "income": 14
  },
  {
    "id": 115,
    "originalId": 116,
    "name": "Puhohu",
    "fullName": "Puhohu Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9bf36d",
    "burgName": "Puhohu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        788.1,
        528.5
      ],
      [
        848.9,
        534.7
      ],
      [
        857.8,
        540
      ],
      [
        834.9,
        589.4
      ],
      [
        796,
        561.1
      ],
      [
        783.9,
        530.7
      ],
      [
        788.1,
        528.5
      ]
    ],
    "cx": 825,
    "cy": 557,
    "neighbors": [
      19,
      109,
      110,
      117,
      118,
      121
    ],
    "income": 14
  },
  {
    "id": 116,
    "originalId": 117,
    "name": "Pami",
    "fullName": "Pami Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#afce72",
    "burgName": "Ukaka",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        723.4,
        474
      ],
      [
        776.1,
        529.8
      ],
      [
        748.4,
        558.1
      ],
      [
        684.7,
        552.1
      ],
      [
        709.3,
        480.3
      ],
      [
        720.2,
        473.8
      ],
      [
        723.4,
        474
      ]
    ],
    "cx": 728,
    "cy": 535,
    "neighbors": [
      103,
      108,
      109,
      117,
      128,
      138
    ],
    "income": 14
  },
  {
    "id": 117,
    "originalId": 118,
    "name": "Paala",
    "fullName": "Paala Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b1ce72",
    "burgName": "Paala",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        776.1,
        529.8
      ],
      [
        783.9,
        530.7
      ],
      [
        796,
        561.1
      ],
      [
        745.8,
        682.3
      ],
      [
        748.4,
        558.1
      ],
      [
        776.1,
        529.8
      ]
    ],
    "cx": 772,
    "cy": 578,
    "neighbors": [
      109,
      115,
      116,
      121,
      138
    ],
    "income": 14
  },
  {
    "id": 118,
    "originalId": 119,
    "name": "Kelaia",
    "fullName": "Kelaia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#baf65f",
    "burgName": "Mookimaoko",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        857.8,
        540
      ],
      [
        861.5,
        539.5
      ],
      [
        897.7,
        598.3
      ],
      [
        897.9,
        599.7
      ],
      [
        884.3,
        610.6
      ],
      [
        840,
        613.1
      ],
      [
        834.9,
        589.4
      ],
      [
        857.8,
        540
      ]
    ],
    "cx": 866,
    "cy": 576,
    "neighbors": [
      10,
      74,
      77,
      79,
      110,
      115,
      121
    ],
    "income": 14
  },
  {
    "id": 119,
    "originalId": 120,
    "name": "New Moopooaile",
    "fullName": "New Moopooaile Colony",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cbd06a",
    "burgName": "Hakaikaka",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        493.7,
        593.5
      ],
      [
        497.6,
        607.2
      ],
      [
        385.5,
        627
      ],
      [
        398,
        605.9
      ],
      [
        443,
        568.9
      ],
      [
        469.6,
        571.5
      ],
      [
        493.3,
        592.5
      ],
      [
        493.7,
        593.5
      ]
    ],
    "cx": 462,
    "cy": 596,
    "neighbors": [
      14,
      112,
      134,
      135,
      136,
      137,
      139
    ],
    "income": 14
  },
  {
    "id": 120,
    "originalId": 121,
    "name": "Waaumawani",
    "fullName": "Waaumawani Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#abf760",
    "burgName": "Waaumawani",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        668.7,
        567.6
      ],
      [
        696.4,
        668.3
      ],
      [
        619.5,
        623.1
      ],
      [
        595.2,
        600.5
      ],
      [
        591.8,
        593.7
      ],
      [
        591.8,
        591
      ],
      [
        627.7,
        552
      ],
      [
        668.7,
        567.6
      ]
    ],
    "cx": 626,
    "cy": 604,
    "neighbors": [
      12,
      13,
      108,
      113,
      122,
      138,
      140
    ],
    "income": 14
  },
  {
    "id": 121,
    "originalId": 122,
    "name": "Keapanana",
    "fullName": "Keapanana Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#bfce72",
    "burgName": "Keapanana",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        737.8,
        730
      ],
      [
        745.8,
        682.3
      ],
      [
        796,
        561.1
      ],
      [
        834.9,
        589.4
      ],
      [
        840,
        613.1
      ],
      [
        743.4,
        730
      ],
      [
        737.8,
        730
      ]
    ],
    "cx": 801,
    "cy": 590,
    "neighbors": [
      79,
      115,
      117,
      118,
      138
    ],
    "income": 14
  },
  {
    "id": 122,
    "originalId": 123,
    "name": "Laulapalia",
    "fullName": "Laulapalia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9aec77",
    "burgName": "Laulapalia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        591.8,
        591
      ],
      [
        591.8,
        593.7
      ],
      [
        524.3,
        658.2
      ],
      [
        515.4,
        626.1
      ],
      [
        551.8,
        575.7
      ],
      [
        591.8,
        591
      ]
    ],
    "cx": 558,
    "cy": 605,
    "neighbors": [
      13,
      113,
      120,
      137,
      139
    ],
    "income": 14
  },
  {
    "id": 123,
    "originalId": 124,
    "name": "Awia",
    "fullName": "Awia Island",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#cdd85d",
    "burgName": "Awia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        411.8,
        168
      ],
      [
        373.7,
        196.6
      ],
      [
        371.2,
        196
      ],
      [
        331.8,
        175.4
      ],
      [
        312.5,
        117.5
      ],
      [
        291.1,
        0
      ],
      [
        367.5,
        0
      ],
      [
        399.6,
        95.7
      ],
      [
        413.7,
        156.6
      ],
      [
        411.8,
        168
      ]
    ],
    "cx": 338,
    "cy": 164,
    "neighbors": [
      15,
      16,
      17,
      28,
      83,
      124,
      164,
      175
    ],
    "income": 14
  },
  {
    "id": 124,
    "originalId": 125,
    "name": "Moakia",
    "fullName": "Moakia Area",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9fe17d",
    "burgName": "Moakia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        371.2,
        196
      ],
      [
        323.3,
        198.1
      ],
      [
        321,
        179.2
      ],
      [
        331.8,
        175.4
      ],
      [
        371.2,
        196
      ]
    ],
    "cx": 326,
    "cy": 187,
    "neighbors": [
      15,
      17,
      18,
      123
    ],
    "income": 14
  },
  {
    "id": 125,
    "originalId": 126,
    "name": "Wapukulia",
    "fullName": "Wapukulia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b9f65f",
    "burgName": "Wapukulia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        443,
        285.7
      ],
      [
        392.6,
        270.5
      ],
      [
        433.6,
        204.9
      ],
      [
        444.6,
        215.4
      ],
      [
        459.4,
        268.4
      ],
      [
        443,
        285.7
      ]
    ],
    "cx": 419,
    "cy": 255,
    "neighbors": [
      82,
      83,
      89,
      90,
      175
    ],
    "income": 14
  },
  {
    "id": 126,
    "originalId": 127,
    "name": "Moalia",
    "fullName": "Moalia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b9ce73",
    "burgName": "Moalia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        0,
        269.7
      ],
      [
        249.6,
        323
      ],
      [
        240.8,
        386.7
      ],
      [
        0,
        469.8
      ],
      [
        0,
        269.7
      ]
    ],
    "cx": 230,
    "cy": 358,
    "neighbors": [
      87,
      93,
      100,
      130
    ],
    "income": 14
  },
  {
    "id": 127,
    "originalId": 128,
    "name": "Howalia",
    "fullName": "Howalia Dependency",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#c3ce70",
    "burgName": "Howalia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        490.5,
        427.9
      ],
      [
        439,
        452.1
      ],
      [
        420,
        394.9
      ],
      [
        487.1,
        396.9
      ],
      [
        490.5,
        427.9
      ]
    ],
    "cx": 456,
    "cy": 413,
    "neighbors": [
      96,
      98,
      102,
      107
    ],
    "income": 14
  },
  {
    "id": 128,
    "originalId": 129,
    "name": "Bayarer",
    "fullName": "Bayarer Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#bcf45c",
    "burgName": "Bayarer",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        684.8,
        378.2
      ],
      [
        764.4,
        361.2
      ],
      [
        771,
        364.1
      ],
      [
        771,
        439.7
      ],
      [
        723.4,
        474
      ],
      [
        720.2,
        473.8
      ],
      [
        684.8,
        378.2
      ]
    ],
    "cx": 735,
    "cy": 414,
    "neighbors": [
      99,
      103,
      109,
      116,
      148,
      178
    ],
    "income": 14
  },
  {
    "id": 129,
    "originalId": 130,
    "name": "Komaokia",
    "fullName": "Komaokia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#abd073",
    "burgName": "Komaokia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        810.5,
        452.6
      ],
      [
        851.7,
        394.2
      ],
      [
        884.5,
        462.8
      ],
      [
        810.5,
        452.6
      ]
    ],
    "cx": 848,
    "cy": 443,
    "neighbors": [
      99,
      101,
      132
    ],
    "income": 14
  },
  {
    "id": 130,
    "originalId": 131,
    "name": "Kanaiahi",
    "fullName": "Kanaiahi Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9fe17d",
    "burgName": "Kanaiahi",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        0,
        477
      ],
      [
        104.6,
        461.7
      ],
      [
        247.5,
        451.1
      ],
      [
        279.4,
        453.8
      ],
      [
        299,
        530.3
      ],
      [
        163,
        730
      ],
      [
        0,
        730
      ],
      [
        0,
        477
      ]
    ],
    "cx": 257,
    "cy": 464,
    "neighbors": [
      14,
      20,
      100,
      105,
      106,
      126,
      139
    ],
    "income": 14
  },
  {
    "id": 131,
    "originalId": 132,
    "name": "Balania",
    "fullName": "Balania Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#c2ee57",
    "burgName": "Balania",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        616,
        419.2
      ],
      [
        638.3,
        471.7
      ],
      [
        618.2,
        505.5
      ],
      [
        567.9,
        478
      ],
      [
        616,
        419.2
      ]
    ],
    "cx": 592,
    "cy": 471,
    "neighbors": [
      103,
      104,
      108,
      111
    ],
    "income": 14
  },
  {
    "id": 132,
    "originalId": 133,
    "name": "Paupa",
    "fullName": "Paupa Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#c6cf6e",
    "burgName": "Paupa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        810.5,
        452.6
      ],
      [
        884.5,
        462.8
      ],
      [
        886.2,
        464.5
      ],
      [
        884.4,
        473.3
      ],
      [
        851,
        487.3
      ],
      [
        813.6,
        474.3
      ],
      [
        810,
        452.9
      ],
      [
        810.5,
        452.6
      ]
    ],
    "cx": 844,
    "cy": 472,
    "neighbors": [
      11,
      99,
      101,
      109,
      110,
      129,
      133
    ],
    "income": 14
  },
  {
    "id": 133,
    "originalId": 134,
    "name": "Amoalia",
    "fullName": "Amoalia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#c1ef58",
    "burgName": "Amoalia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        813.6,
        474.3
      ],
      [
        851,
        487.3
      ],
      [
        843.7,
        506.4
      ],
      [
        809.5,
        490.6
      ],
      [
        813.6,
        474.3
      ]
    ],
    "cx": 836,
    "cy": 495,
    "neighbors": [
      19,
      109,
      110,
      132
    ],
    "income": 14
  },
  {
    "id": 134,
    "originalId": 135,
    "name": "Apiwapia",
    "fullName": "Apiwapia Region",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a8d578",
    "burgName": "Apiwapia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        443,
        568.9
      ],
      [
        398,
        605.9
      ],
      [
        398,
        542.2
      ],
      [
        444,
        523.8
      ],
      [
        443,
        568.9
      ]
    ],
    "cx": 420,
    "cy": 545,
    "neighbors": [
      14,
      112,
      114,
      119
    ],
    "income": 14
  },
  {
    "id": 135,
    "originalId": 136,
    "name": "Laloilia",
    "fullName": "Laloilia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#ccd06a",
    "burgName": "Laloilia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        527.1,
        521.9
      ],
      [
        493.3,
        592.5
      ],
      [
        469.6,
        571.5
      ],
      [
        505.1,
        510
      ],
      [
        517.4,
        508.4
      ],
      [
        527.1,
        521.9
      ]
    ],
    "cx": 493,
    "cy": 561,
    "neighbors": [
      107,
      111,
      112,
      119,
      136
    ],
    "income": 14
  },
  {
    "id": 136,
    "originalId": 137,
    "name": "New Aioko",
    "fullName": "New Aioko Colony",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9ce57c",
    "burgName": "New Aioko",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        538,
        530.7
      ],
      [
        545.3,
        559.1
      ],
      [
        493.7,
        593.5
      ],
      [
        493.3,
        592.5
      ],
      [
        527.1,
        521.9
      ],
      [
        538,
        530.7
      ]
    ],
    "cx": 518,
    "cy": 573,
    "neighbors": [
      111,
      113,
      119,
      135,
      137
    ],
    "income": 14
  },
  {
    "id": 137,
    "originalId": 138,
    "name": "Mawa",
    "fullName": "Mawa Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#b3ce73",
    "burgName": "Mawa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        545.3,
        559.1
      ],
      [
        551.8,
        575.7
      ],
      [
        515.4,
        626.1
      ],
      [
        497.6,
        607.2
      ],
      [
        493.7,
        593.5
      ],
      [
        545.3,
        559.1
      ]
    ],
    "cx": 522,
    "cy": 579,
    "neighbors": [
      113,
      119,
      122,
      136,
      139
    ],
    "income": 14
  },
  {
    "id": 138,
    "originalId": 139,
    "name": "Puikia",
    "fullName": "Puikia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#a5d97c",
    "burgName": "Puikia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        684.7,
        552.1
      ],
      [
        748.4,
        558.1
      ],
      [
        745.8,
        682.3
      ],
      [
        737.8,
        730
      ],
      [
        728.3,
        730
      ],
      [
        696.4,
        668.3
      ],
      [
        668.7,
        567.6
      ],
      [
        684.7,
        552.1
      ]
    ],
    "cx": 724,
    "cy": 577,
    "neighbors": [
      79,
      108,
      116,
      117,
      120,
      121,
      140
    ],
    "income": 14
  },
  {
    "id": 139,
    "originalId": 140,
    "name": "Kueohia",
    "fullName": "Kueohia Territory",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#bef259",
    "burgName": "Kueohia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        290.3,
        730
      ],
      [
        385.5,
        627
      ],
      [
        497.6,
        607.2
      ],
      [
        515.4,
        626.1
      ],
      [
        524.3,
        658.2
      ],
      [
        526.2,
        730
      ],
      [
        290.3,
        730
      ]
    ],
    "cx": 468,
    "cy": 630,
    "neighbors": [
      13,
      14,
      119,
      122,
      130,
      137,
      140,
      199
    ],
    "income": 14
  },
  {
    "id": 140,
    "originalId": 141,
    "name": "Mahuia",
    "fullName": "Mahuia Land",
    "stateId": 5,
    "stateName": "Aiokia",
    "stateColor": "#a6d854",
    "provinceColor": "#9de47c",
    "burgName": "Mahuia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        696.4,
        668.3
      ],
      [
        728.3,
        730
      ],
      [
        552.8,
        730
      ],
      [
        586.8,
        646.4
      ],
      [
        619.5,
        623.1
      ],
      [
        696.4,
        668.3
      ]
    ],
    "cx": 606,
    "cy": 638,
    "neighbors": [
      12,
      13,
      79,
      81,
      120,
      138,
      139,
      199
    ],
    "income": 14
  },
  {
    "id": 141,
    "originalId": 142,
    "name": "Guangbo",
    "fullName": "Guangbo Area",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#f5d85a",
    "burgName": "Guangbo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        831.3,
        107.8
      ],
      [
        791.6,
        0
      ],
      [
        886.5,
        0
      ],
      [
        886.5,
        48.4
      ],
      [
        852.1,
        113.9
      ],
      [
        831.3,
        107.8
      ]
    ],
    "cx": 847,
    "cy": 75,
    "neighbors": [
      21,
      26,
      27,
      142,
      143,
      160
    ],
    "income": 14
  },
  {
    "id": 142,
    "originalId": 143,
    "name": "Yong Guo",
    "fullName": "Yong Guo Region",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffea34",
    "burgName": "Chong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        964.3,
        0
      ],
      [
        926.6,
        90.6
      ],
      [
        904.1,
        81.1
      ],
      [
        886.5,
        48.4
      ],
      [
        886.5,
        0
      ],
      [
        964.3,
        0
      ]
    ],
    "cx": 926,
    "cy": 75,
    "neighbors": [
      21,
      22,
      47,
      141,
      160,
      180
    ],
    "income": 14
  },
  {
    "id": 143,
    "originalId": 144,
    "name": "Zezhoulan",
    "fullName": "Zezhoulan Land",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#f3dc5b",
    "burgName": "Zezhoulan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        787.4,
        136.4
      ],
      [
        788.5,
        132.2
      ],
      [
        831.3,
        107.8
      ],
      [
        852.1,
        113.9
      ],
      [
        868.3,
        134.1
      ],
      [
        869.1,
        167.1
      ],
      [
        836.1,
        180.5
      ],
      [
        793.3,
        158.2
      ],
      [
        787.4,
        136.4
      ]
    ],
    "cx": 827,
    "cy": 144,
    "neighbors": [
      21,
      27,
      141,
      144,
      145,
      146,
      161,
      174
    ],
    "income": 14
  },
  {
    "id": 144,
    "originalId": 145,
    "name": "Tengchun",
    "fullName": "Tengchun Dependency",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffe235",
    "burgName": "Tengchun",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        869.1,
        167.1
      ],
      [
        868.3,
        134.1
      ],
      [
        897.2,
        119.6
      ],
      [
        926,
        123.1
      ],
      [
        930.5,
        128.9
      ],
      [
        930.5,
        171
      ],
      [
        896,
        188
      ],
      [
        869.1,
        167.1
      ]
    ],
    "cx": 910,
    "cy": 142,
    "neighbors": [
      6,
      21,
      22,
      48,
      51,
      143,
      146
    ],
    "income": 14
  },
  {
    "id": 145,
    "originalId": 146,
    "name": "Nanqing",
    "fullName": "Nanqing Territory",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#fff238",
    "burgName": "Nanqing",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        815.3,
        239.6
      ],
      [
        754.7,
        213
      ],
      [
        793.3,
        158.2
      ],
      [
        836.1,
        180.5
      ],
      [
        815.3,
        239.6
      ]
    ],
    "cx": 801,
    "cy": 194,
    "neighbors": [
      143,
      146,
      147,
      174
    ],
    "income": 14
  },
  {
    "id": 146,
    "originalId": 147,
    "name": "Yadeli",
    "fullName": "Yadeli Dependency",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffcf50",
    "burgName": "Dozeslayaz",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        815.3,
        239.6
      ],
      [
        836.1,
        180.5
      ],
      [
        869.1,
        167.1
      ],
      [
        896,
        188
      ],
      [
        898.3,
        212.7
      ],
      [
        839.6,
        274.2
      ],
      [
        831.1,
        267.5
      ],
      [
        815.3,
        239.6
      ]
    ],
    "cx": 855,
    "cy": 213,
    "neighbors": [
      51,
      53,
      143,
      144,
      145,
      147,
      148
    ],
    "income": 14
  },
  {
    "id": 147,
    "originalId": 148,
    "name": "Xinchang",
    "fullName": "Xinchang Territory",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffdc3a",
    "burgName": "Xinchang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        731.9,
        253.4
      ],
      [
        731.6,
        228.4
      ],
      [
        740,
        215.3
      ],
      [
        754.7,
        213
      ],
      [
        815.3,
        239.6
      ],
      [
        831.1,
        267.5
      ],
      [
        755.4,
        288.2
      ],
      [
        731.9,
        253.4
      ]
    ],
    "cx": 772,
    "cy": 260,
    "neighbors": [
      145,
      146,
      148,
      149,
      168,
      170,
      174
    ],
    "income": 14
  },
  {
    "id": 148,
    "originalId": 149,
    "name": "Obayadeli",
    "fullName": "Obayadeli Territory",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#fcd051",
    "burgName": "Buynakut",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        750.4,
        315.8
      ],
      [
        755.4,
        288.2
      ],
      [
        831.1,
        267.5
      ],
      [
        839.6,
        274.2
      ],
      [
        846.9,
        291.8
      ],
      [
        820,
        353.9
      ],
      [
        771,
        364.1
      ],
      [
        764.4,
        361.2
      ],
      [
        750.4,
        315.8
      ]
    ],
    "cx": 784,
    "cy": 304,
    "neighbors": [
      53,
      95,
      99,
      128,
      146,
      147,
      149,
      178
    ],
    "income": 14
  },
  {
    "id": 149,
    "originalId": 150,
    "name": "Newboland",
    "fullName": "Newboland Clan",
    "stateId": 6,
    "stateName": "Xiandin Guo",
    "stateColor": "#ffd92f",
    "provinceColor": "#ffe434",
    "burgName": "Newboland",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        750.4,
        315.8
      ],
      [
        682.8,
        301
      ],
      [
        731.9,
        253.4
      ],
      [
        755.4,
        288.2
      ],
      [
        750.4,
        315.8
      ]
    ],
    "cx": 723,
    "cy": 293,
    "neighbors": [
      147,
      148,
      170,
      178
    ],
    "income": 14
  },
  {
    "id": 150,
    "originalId": 151,
    "name": "Weiaian",
    "fullName": "Weiaian Area",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#f8ad8d",
    "burgName": "Weiaian",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1204.9,
        374.9
      ],
      [
        1169.6,
        345.1
      ],
      [
        1181.3,
        321.3
      ],
      [
        1223.8,
        314.4
      ],
      [
        1233,
        342.7
      ],
      [
        1204.9,
        374.9
      ]
    ],
    "cx": 1208,
    "cy": 339,
    "neighbors": [
      23,
      24,
      65,
      66,
      153
    ],
    "income": 14
  },
  {
    "id": 151,
    "originalId": 152,
    "name": "Denan",
    "fullName": "Denan Territory",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#e1d680",
    "burgName": "Denan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1267,
        333.9
      ],
      [
        1294.4,
        319.7
      ],
      [
        1295.3,
        320.1
      ],
      [
        1299.6,
        358.6
      ],
      [
        1260.8,
        351.9
      ],
      [
        1259.4,
        349.6
      ],
      [
        1267,
        333.9
      ]
    ],
    "cx": 1284,
    "cy": 341,
    "neighbors": [
      23,
      24,
      25,
      70,
      152,
      154
    ],
    "income": 14
  },
  {
    "id": 152,
    "originalId": 153,
    "name": "Shiading",
    "fullName": "Shiading Clan",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ecd67a",
    "burgName": "Shiading",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1536,
        497.9
      ],
      [
        1467.1,
        485.3
      ],
      [
        1394.4,
        453.4
      ],
      [
        1299.6,
        358.6
      ],
      [
        1295.3,
        320.1
      ],
      [
        1536,
        278
      ],
      [
        1536,
        497.9
      ]
    ],
    "cx": 1311,
    "cy": 338,
    "neighbors": [
      61,
      69,
      70,
      151,
      154,
      159,
      193
    ],
    "income": 14
  },
  {
    "id": 153,
    "originalId": 154,
    "name": "Jiajing",
    "fullName": "Jiajing Territory",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ffb280",
    "burgName": "Jiajing",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1154.7,
        349
      ],
      [
        1169.6,
        345.1
      ],
      [
        1204.9,
        374.9
      ],
      [
        1206,
        379.7
      ],
      [
        1185.5,
        424
      ],
      [
        1153.9,
        418.3
      ],
      [
        1138.3,
        393.5
      ],
      [
        1145.2,
        366.4
      ],
      [
        1154.7,
        349
      ]
    ],
    "cx": 1170,
    "cy": 384,
    "neighbors": [
      23,
      65,
      67,
      72,
      150,
      155,
      156,
      157
    ],
    "income": 14
  },
  {
    "id": 154,
    "originalId": 155,
    "name": "Fenzhou",
    "fullName": "Fenzhou Clan",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#d9cd90",
    "burgName": "Fenzhou",
    "isCapital": false,
    "terrain": "forest",
    "polygon": [
      [
        1257.4,
        396.4
      ],
      [
        1260.8,
        351.9
      ],
      [
        1299.6,
        358.6
      ],
      [
        1394.4,
        453.4
      ],
      [
        1354.1,
        442.9
      ],
      [
        1258.8,
        398.3
      ],
      [
        1257.4,
        396.4
      ]
    ],
    "cx": 1279,
    "cy": 370,
    "neighbors": [
      23,
      151,
      152,
      156,
      158,
      159
    ],
    "income": 8
  },
  {
    "id": 155,
    "originalId": 156,
    "name": "Kyomiji",
    "fullName": "Kyomiji Tribe",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#ddd384",
    "burgName": "Tsunisuiho",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1084,
        407.8
      ],
      [
        1111.3,
        394.1
      ],
      [
        1138.3,
        393.5
      ],
      [
        1153.9,
        418.3
      ],
      [
        1120,
        454.8
      ],
      [
        1069.9,
        431
      ],
      [
        1067.7,
        424.5
      ],
      [
        1084,
        407.8
      ]
    ],
    "cx": 1116,
    "cy": 418,
    "neighbors": [
      35,
      36,
      68,
      71,
      72,
      153,
      157
    ],
    "income": 14
  },
  {
    "id": 156,
    "originalId": 157,
    "name": "Shaowu",
    "fullName": "Shaowu Dependency",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#dac993",
    "burgName": "Siche",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1185.5,
        424
      ],
      [
        1206,
        379.7
      ],
      [
        1257.4,
        396.4
      ],
      [
        1258.8,
        398.3
      ],
      [
        1207.3,
        454.5
      ],
      [
        1206.2,
        455
      ],
      [
        1185.5,
        424
      ]
    ],
    "cx": 1226,
    "cy": 410,
    "neighbors": [
      23,
      153,
      154,
      157,
      158,
      159
    ],
    "income": 14
  },
  {
    "id": 157,
    "originalId": 158,
    "name": "Huangzhou",
    "fullName": "Huangzhou Territory",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#dbd189",
    "burgName": "Huangzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1120,
        454.8
      ],
      [
        1153.9,
        418.3
      ],
      [
        1185.5,
        424
      ],
      [
        1206.2,
        455
      ],
      [
        1202.1,
        482.9
      ],
      [
        1199,
        486.6
      ],
      [
        1149.2,
        490.3
      ],
      [
        1127.2,
        480.5
      ],
      [
        1120,
        454.8
      ]
    ],
    "cx": 1157,
    "cy": 456,
    "neighbors": [
      2,
      36,
      39,
      153,
      155,
      156,
      159,
      191
    ],
    "income": 14
  },
  {
    "id": 158,
    "originalId": 159,
    "name": "Kuiz Guo",
    "fullName": "Kuiz Guo Islands",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#e5d67d",
    "burgName": "Dongnan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1207.3,
        454.5
      ],
      [
        1258.8,
        398.3
      ],
      [
        1354.1,
        442.9
      ],
      [
        1207.3,
        454.5
      ]
    ],
    "cx": 1250,
    "cy": 432,
    "neighbors": [
      154,
      156,
      159
    ],
    "income": 14
  },
  {
    "id": 159,
    "originalId": 160,
    "name": "Henan Guo",
    "fullName": "Henan Guo Island",
    "stateId": 7,
    "stateName": "Puer",
    "stateColor": "#eeb372",
    "provinceColor": "#e4d67e",
    "burgName": "Henan Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1207.3,
        454.5
      ],
      [
        1354.1,
        442.9
      ],
      [
        1394.4,
        453.4
      ],
      [
        1467.1,
        485.3
      ],
      [
        1296.6,
        513.2
      ],
      [
        1202.1,
        482.9
      ],
      [
        1206.2,
        455
      ],
      [
        1207.3,
        454.5
      ]
    ],
    "cx": 1253,
    "cy": 470,
    "neighbors": [
      152,
      154,
      156,
      157,
      158,
      191,
      193
    ],
    "income": 14
  },
  {
    "id": 160,
    "originalId": 161,
    "name": "Suz Guo",
    "fullName": "Suz Guo Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffa77a",
    "burgName": "Baibeihua",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        749.3,
        0
      ],
      [
        692.5,
        104.2
      ],
      [
        673.1,
        99.8
      ],
      [
        609.9,
        0
      ],
      [
        749.3,
        0
      ]
    ],
    "cx": 704,
    "cy": 70,
    "neighbors": [
      26,
      141,
      142,
      163,
      164,
      173
    ],
    "income": 14
  },
  {
    "id": 161,
    "originalId": 162,
    "name": "Daxing",
    "fullName": "Daxing Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ff8c91",
    "burgName": "Daxing",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        787.4,
        136.4
      ],
      [
        723.1,
        149.6
      ],
      [
        713.5,
        113.1
      ],
      [
        756.9,
        82.3
      ],
      [
        788.5,
        132.2
      ],
      [
        787.4,
        136.4
      ]
    ],
    "cx": 749,
    "cy": 124,
    "neighbors": [
      26,
      27,
      143,
      163,
      174
    ],
    "income": 14
  },
  {
    "id": 162,
    "originalId": 163,
    "name": "Chang",
    "fullName": "Chang Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#e5a2a0",
    "burgName": "Yichaian",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        510.3,
        158.5
      ],
      [
        507.4,
        156.8
      ],
      [
        509.2,
        127.9
      ],
      [
        562.9,
        12.4
      ],
      [
        581.6,
        116.1
      ],
      [
        540.7,
        160.7
      ],
      [
        510.3,
        158.5
      ]
    ],
    "cx": 533,
    "cy": 133,
    "neighbors": [
      28,
      164,
      166,
      167,
      173,
      176
    ],
    "income": 14
  },
  {
    "id": 163,
    "originalId": 164,
    "name": "Ganz Guo",
    "fullName": "Ganz Guo Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ee94a0",
    "burgName": "Zhaonanhua",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        659.9,
        171.7
      ],
      [
        651.2,
        148
      ],
      [
        673.1,
        99.8
      ],
      [
        692.5,
        104.2
      ],
      [
        713.5,
        113.1
      ],
      [
        723.1,
        149.6
      ],
      [
        715.2,
        173.4
      ],
      [
        659.9,
        171.7
      ]
    ],
    "cx": 688,
    "cy": 140,
    "neighbors": [
      26,
      160,
      161,
      165,
      168,
      173,
      174
    ],
    "income": 14
  },
  {
    "id": 164,
    "originalId": 165,
    "name": "Zhangxiang",
    "fullName": "Zhangxiang Dependency",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#f78b96",
    "burgName": "Zhangxiang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        563.1,
        0
      ],
      [
        562.9,
        12.4
      ],
      [
        509.2,
        127.9
      ],
      [
        399.6,
        95.7
      ],
      [
        367.5,
        0
      ],
      [
        563.1,
        0
      ]
    ],
    "cx": 490,
    "cy": 113,
    "neighbors": [
      16,
      28,
      123,
      160,
      162,
      173
    ],
    "income": 14
  },
  {
    "id": 165,
    "originalId": 166,
    "name": "Henan",
    "fullName": "Henan Land",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#f4b386",
    "burgName": "Henan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        659.9,
        171.7
      ],
      [
        638.3,
        209.5
      ],
      [
        593.5,
        201.3
      ],
      [
        593.5,
        131.1
      ],
      [
        651.2,
        148
      ],
      [
        659.9,
        171.7
      ]
    ],
    "cx": 618,
    "cy": 166,
    "neighbors": [
      163,
      166,
      168,
      169,
      173
    ],
    "income": 14
  },
  {
    "id": 166,
    "originalId": 167,
    "name": "Ganzhouian",
    "fullName": "Ganzhouian Land",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffaf7f",
    "burgName": "Ganzhouian",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        576.9,
        208.9
      ],
      [
        563.2,
        203.5
      ],
      [
        540.7,
        160.7
      ],
      [
        581.6,
        116.1
      ],
      [
        593.5,
        131.1
      ],
      [
        593.5,
        201.3
      ],
      [
        576.9,
        208.9
      ]
    ],
    "cx": 569,
    "cy": 166,
    "neighbors": [
      86,
      162,
      165,
      167,
      169,
      173
    ],
    "income": 14
  },
  {
    "id": 167,
    "originalId": 168,
    "name": "Apaapuu",
    "fullName": "Apaapuu Land",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ff8a97",
    "burgName": "Apaapuu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        563.2,
        203.5
      ],
      [
        518.2,
        215.7
      ],
      [
        510.3,
        158.5
      ],
      [
        540.7,
        160.7
      ],
      [
        563.2,
        203.5
      ]
    ],
    "cx": 529,
    "cy": 187,
    "neighbors": [
      86,
      162,
      166,
      176
    ],
    "income": 14
  },
  {
    "id": 168,
    "originalId": 169,
    "name": "Shaoton Guo",
    "fullName": "Shaoton Guo Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#e9b28b",
    "burgName": "Danan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        651.1,
        237.1
      ],
      [
        638.3,
        209.5
      ],
      [
        659.9,
        171.7
      ],
      [
        715.2,
        173.4
      ],
      [
        740,
        215.3
      ],
      [
        731.6,
        228.4
      ],
      [
        651.1,
        237.1
      ]
    ],
    "cx": 686,
    "cy": 205,
    "neighbors": [
      147,
      163,
      165,
      169,
      170,
      174
    ],
    "income": 14
  },
  {
    "id": 169,
    "originalId": 170,
    "name": "Kahouuini",
    "fullName": "Kahouuini Land",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#feb383",
    "burgName": "Kahouuini",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        604.3,
        276.8
      ],
      [
        570.2,
        260.7
      ],
      [
        576.9,
        208.9
      ],
      [
        593.5,
        201.3
      ],
      [
        638.3,
        209.5
      ],
      [
        651.1,
        237.1
      ],
      [
        650.3,
        240.6
      ],
      [
        604.3,
        276.8
      ]
    ],
    "cx": 604,
    "cy": 243,
    "neighbors": [
      86,
      165,
      166,
      168,
      170,
      171,
      172
    ],
    "income": 14
  },
  {
    "id": 170,
    "originalId": 171,
    "name": "Boylakareli",
    "fullName": "Boylakareli Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#f3909d",
    "burgName": "Beyruman",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        677.6,
        302.9
      ],
      [
        650.3,
        240.6
      ],
      [
        651.1,
        237.1
      ],
      [
        731.6,
        228.4
      ],
      [
        731.9,
        253.4
      ],
      [
        682.8,
        301
      ],
      [
        677.6,
        302.9
      ]
    ],
    "cx": 692,
    "cy": 261,
    "neighbors": [
      147,
      149,
      168,
      169,
      171,
      178
    ],
    "income": 14
  },
  {
    "id": 171,
    "originalId": 172,
    "name": "Paawa",
    "fullName": "Paawa Region",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#feb383",
    "burgName": "Paawa",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        673.1,
        311.8
      ],
      [
        611.1,
        308
      ],
      [
        604.3,
        276.8
      ],
      [
        650.3,
        240.6
      ],
      [
        677.6,
        302.9
      ],
      [
        673.1,
        311.8
      ]
    ],
    "cx": 637,
    "cy": 285,
    "neighbors": [
      169,
      170,
      172,
      178,
      179
    ],
    "income": 14
  },
  {
    "id": 172,
    "originalId": 173,
    "name": "Selisia",
    "fullName": "Selisia Region",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#feb383",
    "burgName": "Vanavand",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        593.8,
        335
      ],
      [
        540.7,
        312.2
      ],
      [
        557.3,
        268
      ],
      [
        570.2,
        260.7
      ],
      [
        604.3,
        276.8
      ],
      [
        611.1,
        308
      ],
      [
        593.8,
        335
      ]
    ],
    "cx": 578,
    "cy": 298,
    "neighbors": [
      86,
      94,
      169,
      171,
      177,
      179
    ],
    "income": 14
  },
  {
    "id": 173,
    "originalId": 174,
    "name": "Suining",
    "fullName": "Suining Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#f8b384",
    "burgName": "Suining",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        593.5,
        131.1
      ],
      [
        581.6,
        116.1
      ],
      [
        562.9,
        12.4
      ],
      [
        563.1,
        0
      ],
      [
        609.9,
        0
      ],
      [
        673.1,
        99.8
      ],
      [
        651.2,
        148
      ],
      [
        593.5,
        131.1
      ]
    ],
    "cx": 633,
    "cy": 115,
    "neighbors": [
      160,
      162,
      163,
      164,
      165,
      166
    ],
    "income": 14
  },
  {
    "id": 174,
    "originalId": 175,
    "name": "Yihuanan Guo",
    "fullName": "Yihuanan Guo Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ff8b93",
    "burgName": "Yihuanan Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        740,
        215.3
      ],
      [
        715.2,
        173.4
      ],
      [
        723.1,
        149.6
      ],
      [
        787.4,
        136.4
      ],
      [
        793.3,
        158.2
      ],
      [
        754.7,
        213
      ],
      [
        740,
        215.3
      ]
    ],
    "cx": 757,
    "cy": 163,
    "neighbors": [
      143,
      145,
      147,
      161,
      163,
      168
    ],
    "income": 14
  },
  {
    "id": 175,
    "originalId": 176,
    "name": "New Haoyang",
    "fullName": "New Haoyang Colony",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffa47a",
    "burgName": "New Haoyang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        496.8,
        159.4
      ],
      [
        487.6,
        211.8
      ],
      [
        444.6,
        215.4
      ],
      [
        433.6,
        204.9
      ],
      [
        411.8,
        168
      ],
      [
        413.7,
        156.6
      ],
      [
        496.8,
        159.4
      ]
    ],
    "cx": 483,
    "cy": 188,
    "neighbors": [
      28,
      82,
      83,
      123,
      125,
      176
    ],
    "income": 14
  },
  {
    "id": 176,
    "originalId": 177,
    "name": "Kipia",
    "fullName": "Kipia Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffa47a",
    "burgName": "Kipia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        514.2,
        219.5
      ],
      [
        487.6,
        211.8
      ],
      [
        496.8,
        159.4
      ],
      [
        507.4,
        156.8
      ],
      [
        510.3,
        158.5
      ],
      [
        518.2,
        215.7
      ],
      [
        514.2,
        219.5
      ]
    ],
    "cx": 500,
    "cy": 191,
    "neighbors": [
      28,
      82,
      86,
      162,
      167,
      175
    ],
    "income": 14
  },
  {
    "id": 177,
    "originalId": 178,
    "name": "Kopia",
    "fullName": "Kopia Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#e3a89c",
    "burgName": "Kopia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        540.7,
        312.2
      ],
      [
        518.4,
        322.7
      ],
      [
        485.5,
        272.7
      ],
      [
        514.7,
        247.8
      ],
      [
        557.3,
        268
      ],
      [
        540.7,
        312.2
      ]
    ],
    "cx": 522,
    "cy": 277,
    "neighbors": [
      82,
      86,
      90,
      94,
      172
    ],
    "income": 14
  },
  {
    "id": 178,
    "originalId": 179,
    "name": "Halehiehia",
    "fullName": "Halehiehia Land",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ff8a98",
    "burgName": "Halehiehia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        684.8,
        378.2
      ],
      [
        680.1,
        376.3
      ],
      [
        673.1,
        311.8
      ],
      [
        677.6,
        302.9
      ],
      [
        682.8,
        301
      ],
      [
        750.4,
        315.8
      ],
      [
        764.4,
        361.2
      ],
      [
        684.8,
        378.2
      ]
    ],
    "cx": 716,
    "cy": 325,
    "neighbors": [
      103,
      128,
      148,
      149,
      170,
      171,
      179
    ],
    "income": 14
  },
  {
    "id": 179,
    "originalId": 180,
    "name": "Hazionia",
    "fullName": "Hazionia Territory",
    "stateId": 8,
    "stateName": "Yic Guo",
    "stateColor": "#f88c7e",
    "provinceColor": "#ffa97c",
    "burgName": "Hazionia",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        680.1,
        376.3
      ],
      [
        613.1,
        399.5
      ],
      [
        605.3,
        395.3
      ],
      [
        593.8,
        335
      ],
      [
        611.1,
        308
      ],
      [
        673.1,
        311.8
      ],
      [
        680.1,
        376.3
      ]
    ],
    "cx": 634,
    "cy": 334,
    "neighbors": [
      94,
      103,
      104,
      171,
      172,
      178
    ],
    "income": 14
  },
  {
    "id": 180,
    "originalId": 181,
    "name": "Shiwangy",
    "fullName": "Shiwangy Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#e3d5c3",
    "burgName": "Shiwangy",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1379.1,
        0
      ],
      [
        1240.7,
        156.9
      ],
      [
        1239.3,
        156.7
      ],
      [
        1196.7,
        106.5
      ],
      [
        1149.6,
        0
      ],
      [
        1379.1,
        0
      ]
    ],
    "cx": 1259,
    "cy": 119,
    "neighbors": [
      30,
      47,
      49,
      59,
      69,
      142,
      181,
      183,
      189
    ],
    "income": 14
  },
  {
    "id": 181,
    "originalId": 182,
    "name": "Jian Guo",
    "fullName": "Jian Guo Region",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#ffb1c8",
    "burgName": "Chong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1174.5,
        192.6
      ],
      [
        1196.7,
        106.5
      ],
      [
        1239.3,
        156.7
      ],
      [
        1207,
        205.8
      ],
      [
        1193.7,
        208.4
      ],
      [
        1174.5,
        192.6
      ]
    ],
    "cx": 1199,
    "cy": 170,
    "neighbors": [
      59,
      63,
      180,
      183,
      185
    ],
    "income": 14
  },
  {
    "id": 182,
    "originalId": 183,
    "name": "Gaonan",
    "fullName": "Gaonan Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#e4abd7",
    "burgName": "Gaonan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1065.6,
        187.9
      ],
      [
        1113.5,
        147.7
      ],
      [
        1130.9,
        198.5
      ],
      [
        1120.2,
        211.5
      ],
      [
        1084.3,
        206.3
      ],
      [
        1064.6,
        190.6
      ],
      [
        1065.6,
        187.9
      ]
    ],
    "cx": 1104,
    "cy": 177,
    "neighbors": [
      29,
      30,
      50,
      57,
      184,
      185
    ],
    "income": 14
  },
  {
    "id": 183,
    "originalId": 184,
    "name": "Luz Guo",
    "fullName": "Luz Guo Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#cdcfd3",
    "burgName": "Dongchong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1155.9,
        190.5
      ],
      [
        1134.5,
        57.1
      ],
      [
        1140.9,
        0
      ],
      [
        1149.6,
        0
      ],
      [
        1196.7,
        106.5
      ],
      [
        1174.5,
        192.6
      ],
      [
        1155.9,
        190.5
      ]
    ],
    "cx": 1164,
    "cy": 161,
    "neighbors": [
      29,
      30,
      180,
      181,
      185
    ],
    "income": 14
  },
  {
    "id": 184,
    "originalId": 185,
    "name": "Ningzhou",
    "fullName": "Ningzhou Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#f6cbbb",
    "burgName": "Ningzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1069.6,
        270.6
      ],
      [
        1084.3,
        206.3
      ],
      [
        1120.2,
        211.5
      ],
      [
        1126.7,
        232.9
      ],
      [
        1126.6,
        233.8
      ],
      [
        1088.6,
        280.6
      ],
      [
        1069.6,
        270.6
      ]
    ],
    "cx": 1095,
    "cy": 240,
    "neighbors": [
      31,
      57,
      182,
      185,
      186,
      187
    ],
    "income": 14
  },
  {
    "id": 185,
    "originalId": 186,
    "name": "Linxi",
    "fullName": "Linxi Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#d0d2cd",
    "burgName": "Linxi",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1120.2,
        211.5
      ],
      [
        1130.9,
        198.5
      ],
      [
        1155.9,
        190.5
      ],
      [
        1174.5,
        192.6
      ],
      [
        1193.7,
        208.4
      ],
      [
        1183,
        236.9
      ],
      [
        1126.7,
        232.9
      ],
      [
        1120.2,
        211.5
      ]
    ],
    "cx": 1157,
    "cy": 221,
    "neighbors": [
      29,
      31,
      63,
      181,
      182,
      183,
      184
    ],
    "income": 14
  },
  {
    "id": 186,
    "originalId": 187,
    "name": "Xijiang",
    "fullName": "Xijiang Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#ffaecd",
    "burgName": "Xijiang",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1023.8,
        308.4
      ],
      [
        1043.5,
        270.3
      ],
      [
        1069.6,
        270.6
      ],
      [
        1088.6,
        280.6
      ],
      [
        1105.1,
        306.6
      ],
      [
        1105.1,
        307
      ],
      [
        1045.5,
        335.9
      ],
      [
        1024.4,
        316.8
      ],
      [
        1023.8,
        308.4
      ]
    ],
    "cx": 1059,
    "cy": 309,
    "neighbors": [
      54,
      55,
      57,
      65,
      184,
      187,
      188,
      190
    ],
    "income": 14
  },
  {
    "id": 187,
    "originalId": 188,
    "name": "Chenzhou",
    "fullName": "Chenzhou Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#ffb4c3",
    "burgName": "Chenzhou",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1105.1,
        306.6
      ],
      [
        1088.6,
        280.6
      ],
      [
        1126.6,
        233.8
      ],
      [
        1154.7,
        280.1
      ],
      [
        1105.1,
        306.6
      ]
    ],
    "cx": 1127,
    "cy": 266,
    "neighbors": [
      31,
      65,
      184,
      186
    ],
    "income": 14
  },
  {
    "id": 188,
    "originalId": 189,
    "name": "Ting Guo",
    "fullName": "Ting Guo Land",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#cdc8dc",
    "burgName": "Yaoqing",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1045.5,
        335.9
      ],
      [
        1105.1,
        307
      ],
      [
        1107.2,
        312.3
      ],
      [
        1094.5,
        353.4
      ],
      [
        1084,
        359.6
      ],
      [
        1049.4,
        357.6
      ],
      [
        1045.5,
        335.9
      ]
    ],
    "cx": 1075,
    "cy": 342,
    "neighbors": [
      65,
      67,
      68,
      71,
      186,
      190
    ],
    "income": 14
  },
  {
    "id": 189,
    "originalId": 190,
    "name": "Xing",
    "fullName": "Xing Territory",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#f8abd3",
    "burgName": "Xing",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1240.7,
        156.9
      ],
      [
        1379.1,
        0
      ],
      [
        1390.3,
        0
      ],
      [
        1270.5,
        164.7
      ],
      [
        1260.8,
        167.2
      ],
      [
        1240.7,
        156.9
      ]
    ],
    "cx": 1276,
    "cy": 134,
    "neighbors": [
      59,
      60,
      69,
      180
    ],
    "income": 14
  },
  {
    "id": 190,
    "originalId": 191,
    "name": "Sal",
    "fullName": "Sal Region",
    "stateId": 9,
    "stateName": "Shulan Guo",
    "stateColor": "#dfb1c5",
    "provinceColor": "#ebabd7",
    "burgName": "Sal",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1014.6,
        400.4
      ],
      [
        977.5,
        367.1
      ],
      [
        989.8,
        345
      ],
      [
        1024.4,
        316.8
      ],
      [
        1045.5,
        335.9
      ],
      [
        1049.4,
        357.6
      ],
      [
        1030.4,
        399.6
      ],
      [
        1014.6,
        400.4
      ]
    ],
    "cx": 1020,
    "cy": 352,
    "neighbors": [
      34,
      35,
      55,
      58,
      68,
      186,
      188
    ],
    "income": 14
  },
  {
    "id": 191,
    "originalId": 192,
    "name": "Huihuatong",
    "fullName": "Huihuatong Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#f4b1d0",
    "burgName": "Huihuatong",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1199,
        486.6
      ],
      [
        1202.1,
        482.9
      ],
      [
        1296.6,
        513.2
      ],
      [
        1230,
        562
      ],
      [
        1199,
        539.6
      ],
      [
        1199,
        486.6
      ]
    ],
    "cx": 1236,
    "cy": 523,
    "neighbors": [
      2,
      32,
      157,
      159,
      193
    ],
    "income": 14
  },
  {
    "id": 192,
    "originalId": 193,
    "name": "Feng Guo",
    "fullName": "Feng Guo Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff91cd",
    "burgName": "Zhende",
    "isCapital": false,
    "terrain": "forest",
    "polygon": [
      [
        1146.2,
        585.9
      ],
      [
        1174.4,
        558.7
      ],
      [
        1188.4,
        602.6
      ],
      [
        1161.7,
        614.5
      ],
      [
        1146.2,
        585.9
      ]
    ],
    "cx": 1170,
    "cy": 588,
    "neighbors": [
      32,
      33,
      42,
      44
    ],
    "income": 8
  },
  {
    "id": 193,
    "originalId": 194,
    "name": "Dafengli",
    "fullName": "Dafengli Colony",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff89e0",
    "burgName": "Dafengli",
    "isCapital": false,
    "terrain": "forest",
    "polygon": [
      [
        1536,
        730
      ],
      [
        1469.7,
        730
      ],
      [
        1349.5,
        680.9
      ],
      [
        1278.9,
        628.6
      ],
      [
        1231.7,
        572
      ],
      [
        1230,
        562
      ],
      [
        1296.6,
        513.2
      ],
      [
        1467.1,
        485.3
      ],
      [
        1536,
        497.9
      ],
      [
        1536,
        730
      ]
    ],
    "cx": 1269,
    "cy": 568,
    "neighbors": [
      32,
      152,
      159,
      191,
      194,
      197,
      198
    ],
    "income": 8
  },
  {
    "id": 194,
    "originalId": 195,
    "name": "Lianz Guo",
    "fullName": "Lianz Guo Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff97c6",
    "burgName": "Baonan",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1197.2,
        604.1
      ],
      [
        1231.7,
        572
      ],
      [
        1278.9,
        628.6
      ],
      [
        1206.2,
        621.1
      ],
      [
        1197.2,
        604.1
      ]
    ],
    "cx": 1221,
    "cy": 608,
    "neighbors": [
      32,
      33,
      193,
      198
    ],
    "income": 14
  },
  {
    "id": 195,
    "originalId": 196,
    "name": "Huangde",
    "fullName": "Huangde Tribe",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff8dd2",
    "burgName": "Huangde",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1154.5,
        634.2
      ],
      [
        1197.6,
        645.3
      ],
      [
        1204.7,
        659.1
      ],
      [
        1166.6,
        685.9
      ],
      [
        1115,
        694.9
      ],
      [
        1116.3,
        667.8
      ],
      [
        1154.5,
        634.2
      ]
    ],
    "cx": 1179,
    "cy": 657,
    "neighbors": [
      33,
      44,
      45,
      196,
      198,
      199
    ],
    "income": 14
  },
  {
    "id": 196,
    "originalId": 197,
    "name": "Dulansu",
    "fullName": "Dulansu Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff9ec3",
    "burgName": "Dulansu",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1166.6,
        685.9
      ],
      [
        1204.7,
        659.1
      ],
      [
        1236.3,
        672.5
      ],
      [
        1199.2,
        699
      ],
      [
        1166.6,
        685.9
      ]
    ],
    "cx": 1198,
    "cy": 684,
    "neighbors": [
      195,
      197,
      198,
      199
    ],
    "income": 14
  },
  {
    "id": 197,
    "originalId": 198,
    "name": "Zhaoxin Guo",
    "fullName": "Zhaoxin Guo Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff90ce",
    "burgName": "Zhenping",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1204.2,
        730
      ],
      [
        1199.2,
        699
      ],
      [
        1236.3,
        672.5
      ],
      [
        1349.5,
        680.9
      ],
      [
        1469.7,
        730
      ],
      [
        1204.2,
        730
      ]
    ],
    "cx": 1213,
    "cy": 705,
    "neighbors": [
      193,
      196,
      198,
      199
    ],
    "income": 14
  },
  {
    "id": 198,
    "originalId": 199,
    "name": "Jining",
    "fullName": "Jining Territory",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff98c6",
    "burgName": "Jining",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1206.2,
        621.1
      ],
      [
        1278.9,
        628.6
      ],
      [
        1349.5,
        680.9
      ],
      [
        1236.3,
        672.5
      ],
      [
        1204.7,
        659.1
      ],
      [
        1197.6,
        645.3
      ],
      [
        1206.2,
        621.1
      ]
    ],
    "cx": 1218,
    "cy": 637,
    "neighbors": [
      33,
      193,
      194,
      195,
      196,
      197
    ],
    "income": 14
  },
  {
    "id": 199,
    "originalId": 200,
    "name": "Chenzho Guo",
    "fullName": "Chenzho Guo Island",
    "stateId": 10,
    "stateName": "Yanz Guo",
    "stateColor": "#ff8acf",
    "provinceColor": "#ff8bd6",
    "burgName": "Chenzho Guo",
    "isCapital": false,
    "terrain": "plains",
    "polygon": [
      [
        1099.7,
        730
      ],
      [
        1115,
        694.9
      ],
      [
        1166.6,
        685.9
      ],
      [
        1199.2,
        699
      ],
      [
        1204.2,
        730
      ],
      [
        1099.7,
        730
      ]
    ],
    "cx": 1188,
    "cy": 709,
    "neighbors": [
      45,
      81,
      139,
      140,
      195,
      196,
      197
    ],
    "income": 14
  }
];
