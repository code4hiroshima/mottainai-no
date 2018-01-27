/* @flow */
declare var L: Object;
declare var $: Object;

type Latitude = number; // 緯度
type Longitude = number; // 経度
export type Marker = any;
export type Spot = {
  name: string,
  latitude: Latitude,
  longitude: Longitude,
  url: string
};

export type ChildrenCafeteria = Spot;
export type FoodBank = Spot;
export type LossNon = Spot;
