//var map = L.map('map');

//子供食堂のピンの画像を設定
var ccIcon = L.icon({
    iconUrl: 'img/gohan.png', 
    iconRetinaUrl: 'img/gohan.png',
    iconSize: [50, 50],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0],
});

//フードバンクのピンの画像を設定
var fbIcon = L.icon({
    iconUrl: 'img/foodbank.png', 
    iconRetinaUrl: 'img/foodbank.png',
    iconSize: [50, 50],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0],
});

//食品ロス削減協力店のピンの画像を設定
var lnIcon = L.icon({
    iconUrl: 'img/loss-non.png', 
    iconRetinaUrl: 'img/loss-non.png',
    iconSize: [50, 50],
    iconAnchor: [12, 25],
    popupAnchor: [0, 0],
});

//子ども食堂のピンを追加 childrencafeteria:cc
var cc1 = L.marker([34.392487, 132.475126], { icon: ccIcon }).bindPopup('<a href="https://www.facebook.com/tunago.p/" target="_blank">青い鳥</a><br><a href="https://maps.google.co.jp/maps?ll=34.392487,132.475126&f=d" target="_blank">ここまでの経路</a>'),
    cc2 = L.marker([34.361050, 132.463745], { icon: ccIcon }).bindPopup('<a href="https://www.facebook.com/kururi2093/" target="_blank">くるり食堂</a><br><a href="https://maps.google.co.jp/maps?ll=34.361015,132.463743&f=d" target="_blank">ここまでの経路</a>'),
    cc3 = L.marker([34.385509, 132.452631], { icon: ccIcon }).bindPopup('<a href="https://hiroshimaywca.jimdo.com/" target="_blank">わいわい食堂</a><br><a href="https://maps.google.co.jp/maps?ll=34.385509,132.452631&f=d" target="_blank">ここまでの経路</a>');

//フードバンクのピンを追加 foodbank:fb
var fb1 = L.marker([34.524403, 132.505580], { icon: fbIcon }).bindPopup('<a href="http://www.aiainet.org/" target="_blank">あいあいねっと</a><br><a href="https://maps.google.co.jp/maps?ll=34.524403,132.505580&f=d" target="_blank">ここまでの経路</a>');

//食品ロス削減協力店のピンを追加 lossnon:ln
var ln1 = L.marker([34.362869,132.468328], { icon: lnIcon }).bindPopup('<a href="http://www.city.hiroshima.lg.jp/www/contents/1498549753659/index.html" target="_blank">イオン宇品店</a><br><a href="https://maps.google.co.jp/maps?ll=34.362869,132.468328&f=d" target="_blank">ここまでの経路</a>');

//子ども食堂のレイヤ
var childrencafeteria = L.layerGroup([
    cc1, cc2, cc3
]);

//フードバンクのレイヤ
var foodbank = L.layerGroup([
    fb1
]);

//食品ロス削減協力店のレイヤ
var lossnon = L.layerGroup([
    ln1
]);

var pale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
{id: 'palemap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"}),
    blank = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
{id: 'blankmap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"}),
    osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
{ id: 'osmmap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

var map = L.map('map', {
    layers: [osm, childrencafeteria,foodbank,lossnon]
});

var baseMaps = {
    "淡色地図" : pale,
    "白地図"   : blank,
    "OSM japan"  : osm
};      

var overlayMaps = {
    "こども食堂" : childrencafeteria,
    "フードバンク" : foodbank,
    "食品ロス削減協力店" : lossnon
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

map.setView([34.395247, 132.457659], 12);