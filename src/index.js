/* @flow */
/* eslint comma-dangle: "off" */
/* eslint indent: "off" */
/* eslint quote-props: "off" */
/* eslint key-spacing: "off" */
/* eslint quotes: "off" */
/* eslint function-paren-newline: "off" */ // コードフォーマッターとeslintが競合する
/* eslint spaced-comment: "off" */ // flowの型定義とコードフォーマッターが競合する
/* eslint no-console: "off" */ // IE9以上だし、ビルドツールないので、エラーを出力するのに利用する
/* global $ */

import L from "leaflet";
import PanControl from "leaflet.pancontrol";

import "leaflet.pancontrol/src/L.Control.Pan.css";
import "leaflet/dist/leaflet.css";

/**
 * Map設定
 */
const mapConfig = {
  center: [34.395247, 132.457659],
  zoom: 12
};

/**
 * BaseLayer設定
 */
/* 表示しないため、コメントアウト
const pale = {
  name: "淡色地図"
  tileUrl: "http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
  id: "palemap",
  attribution:
    "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
};
const blank = {
  name: "白地図",
  OpenStreetMap: osm
  tileUrl, "http://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
  id: "blankmap",
  attribution:
    "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"
);
*/
const osm = {
  name: "OpenStreetMap",
  tileUrl: "http://tile.openstreetmap.jp/{z}/{x}/{y}.png",
  id: "osmmap",
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

/*
 * Overlayレイヤーの設定
 */
const baseLayerConfigList = [
  /*
  pale,
  blank,
  */
  osm
];

const kodomoSyokudo = {
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

const foodBank = {
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

const lossNon = {
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

const overlayConfigList /*: OverlayConfig[] */ = [
  kodomoSyokudo,
  foodBank,
  lossNon
];

/**
 * Spot情報からMarkerを作成する
 */
function createMarker(attributes) {
  const { latitude, longitude, icon, popupHtml } = attributes;
  return L.marker([latitude, longitude], { icon }).bindPopup(popupHtml);
}

/**
 * Google Mapのurlを作成する
 */
function createGoogleMapUrl(attributes) {
  const { latitude, longitude } = attributes;
  return `https://maps.google.co.jp/maps?q=${latitude},${longitude}&iwloc=J`;
}

/**
 * PopupするHTMLを作成する
 */
function createPopupHtml(attributes) {
  const { url, name } = attributes;
  const googleMapUrl = createGoogleMapUrl(attributes);
  return `
  <table border="1">
    <tr>
      <th>名称</th>
      <td>
        <a href="${url}" target="_blank">
          ${name}
        </a>
      </td>
    </tr>
    <tr>
      <th>案内</th>
      <td>
        <a href="${googleMapUrl}" target="_blank">
          ここまでの経路
        </a>
      </td>
    </tr>
  </table>
  `;
}

/**
 * 外部APIを実行して、Spotの一覧を取得する
 */
function getSpotList(dataType) {
  return $.ajax({
    type: "POST",
    url:
      "https://qopkh74g90.execute-api.us-east-1.amazonaws.com/v1/mottainai-no",
    contentType: "application/json",
    dataType: "json",
    data: { dataType }
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
  const { name } = tileLayerConfig;
  return {
    name,
    layer: createTileLayer(tileLayerConfig)
  };
}

/**
 * configからOverlayLayerを管理する要素を作成する
 */
function createOverlayLayerItem(overlayConfig) {
  const { name, key } = overlayConfig;
  return {
    name,
    key,
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
  const { name, layer } = layerItem;
  acc[name] = layer;
  return acc;
}

/**
 * インスタンス管理をする要素から取得しやすいようにユニークなキーとlayerの辞書を作成するreducer
 */
function toContainerReducer(acc, layerItem) {
  const { key, layer } = layerItem;
  acc[key] = layer;
  return acc;
}

const baseLayerList = baseLayerConfigList.map(createTileLayerItem);
const baseLayers = baseLayerList.map(extractLayer);
const baseMaps = baseLayerList.reduce(toMapReducer, {});

const overlayLayerList = overlayConfigList.map(createOverlayLayerItem);
const overlayLayers = overlayLayerList.map(extractLayer);
const overlayMaps = overlayLayerList.reduce(toMapReducer, {});
const overlayCantainer = overlayLayerList.reduce(toContainerReducer, {});

const map = L.map("map", {
  center: mapConfig.center,
  zoom: mapConfig.zoom,
  layers: [...baseLayers, ...overlayLayers]
});

new PanControl().addTo(map);
L.control.layers(baseMaps, overlayMaps).addTo(map);

/* それぞれのアイコンのインスタンスをとりだしやすいように辞書にする */
const iconContainer /*: Object */ = overlayConfigList.reduce((
  acc /* Object */,
  overlayConfig /*: OverlayConfig */
) => {
  const { icon, key } = overlayConfig;
  acc[key] = L.icon(icon);
  return acc;
}, {});

/**
 * レイヤーにマークを追加する関数を生成する関数
 */
function appendMarkerCreator(layer, dataType) {
  return function appendMarker(spots) {
    layer.clearLayers();
    spots.map(spot => {
      const { latitude, longitude } = spot;
      createMarker({
        icon: iconContainer[dataType],
        latitude,
        longitude,
        popupHtml: createPopupHtml(spot)
      }).addTo(layer);
      return spot;
    });
  };
}

/* 各レイヤーの情報を取得し、表示を行う */
overlayConfigList.map((overlayConfig /*: OverlayConfig */) => {
  const key = overlayConfig.key;
  const layer = overlayCantainer[key];
  const dataType = key;
  const appendMarker = appendMarkerCreator(layer, dataType);
  return getSpotList(dataType)
    .then(appendMarker)
    .catch(console.log);
});
