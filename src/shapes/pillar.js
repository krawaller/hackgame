import {Path, Shape, Point} from '../iso'

let Pillar = (origin,height)=> {
	return new Shape.Cylinder(origin.translate(0.5,0.5,0),0.5,0,height)
}

export default Pillar