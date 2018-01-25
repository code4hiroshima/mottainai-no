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
/* global L */
// var map = L.map('map');

// 子供食堂のピンの画像を設定
var ccIcon = L.icon({
  iconUrl: "img/gohan.png",
  iconRetinaUrl: "img/gohan.png",
  iconSize: [40, 40],
  iconAnchor: [12, 25],
  popupAnchor: [0, 0]
});

// フードバンクのピンの画像を設定
var fbIcon = L.icon({
  iconUrl: "img/foodbank.png",
  iconRetinaUrl: "img/foodbank.png",
  iconSize: [40, 40],
  iconAnchor: [12, 25],
  popupAnchor: [0, 0]
});

// 食品ロス削減協力店のピンの画像を設定
var lnIcon = L.icon({
  iconUrl: "img/loss-non.png",
  iconRetinaUrl: "img/loss-non.png",
  iconSize: [40, 40],
  iconAnchor: [12, 25],
  popupAnchor: [0, 0]
});

// 子ども食堂のピンを追加 childrencafeteria:cc
// var cc1 = L.marker([34.392487, 132.475126], { icon: ccIcon }).bindPopup('<a href="https://www.facebook.com/tunago.p/" target="_blank">青い鳥</a><br><a href="https://maps.google.co.jp/maps?ll=34.392487,132.475126&f=d" target="_blank">ここまでの経路</a>'),
// cc2 = L.marker([34.361050, 132.463745], { icon: ccIcon }).bindPopup('<a href="https://www.facebook.com/kururi2093/" target="_blank">くるり食堂</a><br><a href="https://maps.google.co.jp/maps?ll=34.361015,132.463743&f=d" target="_blank">ここまでの経路</a>'),
// cc3 = L.marker([34.385509, 132.452631], { icon: ccIcon }).bindPopup('<a href="https://hiroshimaywca.jimdo.com/" target="_blank">わいわい食堂</a><br><a href="https://maps.google.co.jp/maps?ll=34.385509,132.452631&f=d" target="_blank">ここまでの経路</a>');

var ccList /*: ChildrenCafeteria[] */ = [
  {
    name: "青い鳥",
    latitude: 34.392487,
    longitude: 132.475126,
    url: "https://www.facebook.com/tunago.p/"
  },
  {
    name: "くるり食堂",
    latitude: 34.36105,
    longitude: 132.463745,
    url: "https://www.facebook.com/kururi2093/"
  },
  {
    name: "わいわい食堂",
    latitude: 34.385509,
    longitude: 132.452631,
    url: "https://hiroshimaywca.jimdo.com/"
  }
];

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

function createChilrdenCafeteriaMarker(
  cc /*: ChildrenCafeteria */
) /*: Marker */ {
  return createMarker({
    icon: ccIcon,
    latitude: cc.latitude,
    longitude: cc.longitude,
    popupHtml: createPopupHtml(cc)
  });
}

// フードバンクのピンを追加 foodbank:fb
var fbList /* FoobBank[] */ = [
  {
    name: "あいあいねっと(フードバンク広島)",
    latitude: 34.524403,
    longitude: 132.50558,
    url: "http://www.aiainet.org/"
  }
];

function createFoodBankMarker(fb /*: FoodBank */) /*: Marker */ {
  return createMarker({
    icon: fbIcon,
    latitude: fb.latitude,
    longitude: fb.longitude,
    popupHtml: createPopupHtml(fb)
  });
}

// 食品ロス削減協力店のピンを追加 lossnon:ln
var lnList = [
  {
    name: "イオン宇品店",
    latitude: 34.362869,
    longitude: 132.468328,
    url: "http://www.city.hiroshima.lg.jp/www/contents/1498549753659/index.html"
  }
];

function createLossNonMarker(ln /*: LossNon */) /*: Marker */ {
  return createMarker({
    icon: lnIcon,
    latitude: ln.latitude,
    longitude: ln.longitude,
    popupHtml: createPopupHtml(ln)
  });
}

// 子ども食堂のレイヤ
var childrencafeteria = L.layerGroup(ccList.map(createChilrdenCafeteriaMarker));

// フードバンクのレイヤ
var foodbank = L.layerGroup(fbList.map(createFoodBankMarker));

// 食品ロス削減協力店のレイヤ
var lossnon = L.layerGroup(lnList.map(createLossNonMarker));

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
var osm = L.tileLayer("http://tile.openstreetmap.jp/{z}/{x}/{y}.png", {
  id: "osmmap",
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var map = L.map("map", {
  layers: [osm, childrencafeteria, foodbank, lossnon]
});

var baseMaps = {
  淡色地図: pale,
  白地図: blank,
  "OSM japan": osm
};

var overlayMaps = {
  こども食堂: childrencafeteria,
  フードバンク: foodbank,
  食品ロス削減協力店: lossnon
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

map.setView([34.395247, 132.457659], 12);
