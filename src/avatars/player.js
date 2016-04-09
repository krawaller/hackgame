import {Path, Shape, Point, Color, Collection} from '../iso'

import Pillar from '../shapes/pillar'

let Player = (origin)=> {
	let body = new Shape.Cylinder(origin.translate(0.5,0.5,0),0.5,0,3)
	body.color = new Color(0,255,0)
	let hat = new Shape.Pyramid(origin.translate(0,0,3))
	hat.color = new Color(255,0,0)
	let ret = new Collection([body,hat]);
	ret.x = origin.x
	ret.y = origin.y
	ret.depth = 1
	return ret
}

export default Player