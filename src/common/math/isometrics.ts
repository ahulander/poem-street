

export interface Point {
  x: number;
  y: number;
}

export function cartesianToIsometric(cartesianPosition: Point){
  let x = cartesianPosition.x - cartesianPosition.y;
  let y = (cartesianPosition.x + cartesianPosition.y) / 2;
  return {x, y};
}

export function isometricToCartesian(isoPosition: Point){
  let x = (2*isoPosition.y + isoPosition.x) / 2;
  let y = (2*isoPosition.y - isoPosition.x) / 2;
  return {x, y};
}