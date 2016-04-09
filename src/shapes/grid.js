import {Path, Shape, Point, Color} from '../iso'

let Grid = (origin,maxx,maxy,color)=> {
  let lines = [], x, y, clr = color || new Color(255,0,0)
  for (x = 0; x <= maxx; x++) {
    lines.push(new Path([
      new Point(x, 0, 0),
      new Point(x, maxy, 0),
      new Point(x, 0, 0)
    ]));
  }
  for (y = 0; y <= maxy; y++) {
    lines.push(new Path([
      new Point(0, y, 0),
      new Point(maxx, y, 0),
      new Point(0, y, 0)
    ]));
  }
  let grid = (new Shape(lines)).translate(origin.x, origin.y, origin.z)
  grid.color = clr
  return grid
}

export default Grid