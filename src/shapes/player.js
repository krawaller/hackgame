import {Path, Shape, Point, Color} from '../iso'

import Pillar from './pillar'

let Player = (origin)=> {
	let ret = new Shape.Cylinder(origin.translate(0.5,0.5,0),0.5,0,3)
	ret.color = new Color(0,255,0)
	return ret
}

export default Player