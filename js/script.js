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

/**
 * Map設定
 */
var mapConfig = {
  center: [34.395247, 132.457659],
  zoom: 12
};

/**
 * BaseLayer設定
 */
/* 表示しないため、コメントアウト
var pale = {
  name: "淡色地図"
  tileUrl: "http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
  id: "palemap",
  attribution:
    "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
};
var blank = {
  name: "白地図",
  OpenStreetMap: osm
  tileUrl, "http://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
  id: "blankmap",
  attribution:
    "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
);
*/
var osm = {
  name: "OpenStreetMap",
  tileUrl: "http://tile.openstreetmap.jp/{z}/{x}/{y}.png",
  id: "osmmap",
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

/*
 * Overlayレイヤーの設定
 */
var baseLayerConfigList = [
  /*
  pale,
  blank,
  */
  osm
];

var kodomoSyokudo = {
  key: "kodomoSyokudo",
  name: "こども食堂",
  icon: {
    iconUrl: "img/gohan.png",
    iconRetinaUrl: "img/gohan.png",
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0]
  }
};

var foodBank = {
  key: "foodBank",
  name: "フードバンク",
  icon: {
    iconUrl: "img/foodbank.png",
    iconRetinaUrl: "img/foodbank.png",
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0]
  }
};

var lossNon = {
  key: "lossNon",
  name: "食品ロス削減協力",
  icon: {
    iconUrl: "img/loss-non.png",
    iconRetinaUrl: "img/loss-non.png",
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0]
  }
};

var overlayConfigList /*: OverlayConfig[] */ = [
  kodomoSyokudo,
  foodBank,
  lossNon
];

/**
 * Spot情報からMarkerを作成する
 */
function createMarker(attributes) {
  var latitude = attributes.latitude;
  var longitude = attributes.longitude;
  var aIcon = attributes.icon; // iconにするとフォーマッタにes6形式にされてしまう
  var popupHtml = attributes.popupHtml;
  return L.marker([latitude, longitude], { icon: aIcon }).bindPopup(popupHtml);
}

/**
 * Google Mapのurlを作成する
 */
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

/**
 * PopupするHTMLを作成する
 */
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

/**
 * 外部APIを実行して、Spotの一覧を取得する
 */
function getSpotList(aDataType) {
  return $.ajax({
    type: "POST",
    url:
      "https://qopkh74g90.execute-api.us-east-1.amazonaws.com/v1/mottainai-no",
    contentType: "application/json",
    dataType: "json",
    data: { dataType: aDataType }
  });
}

/**
 * configからTileLayreの作成をする
 */
function createTileLayer(tileLayerConfig) {
  return L.tileLayer(tileLayerConfig.tileUrl, tileLayerConfig);
}

/**
 * configからインスタンスを管理する要素を作成する
 */
function createTileLayerItem(tileLayerConfig) {
  return {
    name: tileLayerConfig.name,
    layer: createTileLayer(tileLayerConfig)
  };
}

/**
 * configからOverlayLayerを管理する要素を作成する
 */
function createOverlayLayerItem(overlayConfig) {
  return {
    name: overlayConfig.name,
    key: overlayConfig.key,
    layer: L.layerGroup()
  };
}

/**
 * objectからlayerを取り出す
 */
function extractLayer(object) {
  return object.layer;
}

/**
 * インスタンス管理をする要素からLeafletのControlsに渡す名前とlayerの辞書を作成するreducer
 */
function toMapReducer(acc, layerItem) {
  acc[layerItem.name] = layerItem.layer;
  return acc;
}

/**
 * インスタンス管理をする要素から取得しやすいようにユニークなキーとlayerの辞書を作成するreducer
 */
function toContainerReducer(acc, layerItem) {
  acc[layerItem.key] = layerItem.layer;
  return acc;
}

var baseLayerList = baseLayerConfigList.map(createTileLayerItem);
var baseLayers = baseLayerList.map(extractLayer);
var baseMaps = baseLayerList.reduce(toMapReducer, {});

var overlayLayerList = overlayConfigList.map(createOverlayLayerItem);
var overlayLayers = overlayLayerList.map(extractLayer);
var overlayMaps = overlayLayerList.reduce(toMapReducer, {});
var overlayCantainer = overlayLayerList.reduce(toContainerReducer, {});

var map = L.map("map", {
  center: mapConfig.center,
  zoom: mapConfig.zoom,
  layers: baseLayers.concat(overlayLayers)
});

L.control.layers(baseMaps, overlayMaps).addTo(map);

/* それぞれのアイコンのインスタンスをとりだしやすいように辞書にする */
var iconContainer /*: Object */ = overlayConfigList.reduce(
  function createIconReducer(
    acc /* Object */,
    overlayConfig /*: OverlayConfig */
  ) {
    var icon = overlayConfig.icon;
    var key = overlayConfig.key;
    acc[key] = L.icon(icon);
    return acc;
  },
  {}
);

/**
 * レイヤーにマークを追加する関数を生成する関数
 */
function appendMarkerCreator(layer, dataType) {
  return function appendMarker(spots) {
    layer.clearLayers();
    spots.map(function mapper2(spot) {
      createMarker({
        icon: iconContainer[dataType],
        latitude: spot.latitude,
        longitude: spot.longitude,
        popupHtml: createPopupHtml(spot)
      }).addTo(layer);
      return spot;
    });
  };
}

/* 各レイヤーの情報を取得し、表示を行う */
overlayConfigList.map(function mapper(overlayConfig /*: OverlayConfig */) {
  var key = overlayConfig.key;
  var layer = overlayCantainer[key];
  var dataType = key;
  var appendMarker = appendMarkerCreator(layer, dataType);
  return getSpotList(dataType)
    .then(appendMarker)
    .catch(console.log);
});
