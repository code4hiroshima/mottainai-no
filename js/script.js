/* @flow */
/* eslint no-var: "off" */
/* eslint comma-dangle: "off" */
/* eslint indent: "off" */
/* eslint quote-props: "off" */
/* eslint key-spacing: "off" */
/* eslint quotes: "off" */
/* eslint function-paren-newline: "off" */ // コードフォーマッターとeslintが競合する
/* eslint vars-on-top: "off" */ // ESModuleが使えないと消しにくい
/* eslint prefer-destructuring: "off" */ // babelを利用しないと消せそうにない
/* eslint spaced-comment: "off" */ // flowの型定義とコードフォーマッターが競合する
/* eslint prefer-template: "off" */ // babelを利用しないとtemplate literal が利用できない
/* eslint prefer-arrow-function: "off" */ // IEはarrow function使えない
/* eslint prefer-arrow-callback: "off" */ // IEはarrow function使えない
/* eslint no-console: "off" */ // IE9以上だし、ビルドツールないので、エラーを出力するのに利用する
/* global L */
/* global $ */
// var map = L.map('map');

// 表示項目情報
var items = {
  kodomoSyokudo: {
    layer: L.layerGroup(),
    icon: L.icon({
      iconUrl: "img/gohan.png",
      iconRetinaUrl: "img/gohan.png",
      iconSize: [40, 40],
      iconAnchor: [12, 25],
      popupAnchor: [0, 0]
    })
  },
  foodBank: {
    layer: L.layerGroup(),
    icon: L.icon({
      iconUrl: "img/foodbank.png",
      iconRetinaUrl: "img/foodbank.png",
      iconSize: [40, 40],
      iconAnchor: [12, 25],
      popupAnchor: [0, 0]
    })
  },
  lossNon: {
    layer: L.layerGroup(),
    icon: L.icon({
      iconUrl: "img/loss-non.png",
      iconRetinaUrl: "img/loss-non.png",
      iconSize: [40, 40],
      iconAnchor: [12, 25],
      popupAnchor: [0, 0]
    })
  }
};

function createMarker(attributes) {
  var latitude = attributes.latitude;
  var longitude = attributes.longitude;
  var mIcon = attributes.icon; // iconにするとフォーマッタにes6形式にされてしまう
  var popupHtml = attributes.popupHtml;
  return L.marker([latitude, longitude], { icon: mIcon }).bindPopup(popupHtml);
}

function createGoogleMapUrl(attributes) {
  var latitude = attributes.latitude;
  var longitude = attributes.longitude;
  // TODO template literalを使いたい
  return (
    "https://maps.google.co.jp/maps?q=" +
    latitude +
    "," +
    longitude +
    "&iwloc=J"
  );
}

function createPopupHtml(attributes) {
  var url = attributes.url;
  var name = attributes.name;
  var googleMapUrl = createGoogleMapUrl(attributes);
  // TODO template literalを使いたい
  return (
    '<table border="1"><tr><th>名称</th><td><a href="' +
    url +
    '" target="_blank">' +
    name +
    '</a></td></tr><tr><th>案内</th><td><a href="' +
    googleMapUrl +
    '" target="_blank">ここまでの経路</a></td></tr></table>'
  );
}

function createMarkerItem(spot, type) {
  return createMarker({
    icon: items[type].icon,
    latitude: spot.latitude,
    longitude: spot.longitude,
    popupHtml: createPopupHtml(spot)
  });
}

function createLayerGroup(list, type) {
  return L.layerGroup(
    list.map(function createMakerWithType(spot) {
      return createMarkerItem(spot, type);
    })
  );
}

function getItemList(aDataType, map) {
  $.ajax({
    type: "POST",
    url:
      "https://qopkh74g90.execute-api.us-east-1.amazonaws.com/v1/mottainai-no",
    contentType: "application/json",
    dataType: "json",
    data: { dataType: aDataType }
  }).then(function createGetItemListCallback(result) {
    items[aDataType].layer = createLayerGroup(result, aDataType);
    map.addLayer(items[aDataType].layer);
  }, console.log);
}

/* 表示しないため、コメントアウト
var pale = L.tileLayer(
  "http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
  {
    id: "palemap",
    attribution:
      "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
  }
);
var blank = L.tileLayer(
  "http://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
  {
    id: "blankmap",
    attribution:
      "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
  }
);
*/
var osm = L.tileLayer("http://tile.openstreetmap.jp/{z}/{x}/{y}.png", {
  id: "osmmap",
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var map = L.map("map", {
  layers: [
    osm,
    items.kodomoSyokudo.layer,
    items.foodBank.layer,
    items.lossNon.layer
  ]
});

var baseMaps = {
  // 淡色地図: pale,
  // 白地図: blank,
  OpenStreetMap: osm
};

var layerConfig = [
  {
    name: "こども食堂",
    id: "kodomoSyokudo"
  },
  {
    name: "フードバンク",
    id: "foodBank"
  },
  {
    name: "食品ロス削減協力",
    id: "lossNon"
  }
];

function createOverlayMaps(layers, item) {
  layers.reduce(function reducer(acc, config) {
    acc[config.name] = item[config.id].layer;
    return acc;
  }, {});
}
var overlayMaps = createOverlayMaps(layerConfig, items);

map.setView([34.395247, 132.457659], 12);

// 子ども食堂のレイヤの追加
getItemList("kodomoSyokudo", map);

// フードバンクのレイヤの追加
getItemList("foodBank", map);

// 食品ロス削減協力店のレイヤの追加
getItemList("lossNon", map);

L.control.layers(baseMaps, overlayMaps).addTo(map);
