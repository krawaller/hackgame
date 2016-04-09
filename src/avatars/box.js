import {Shape, Point, Color} from '../iso'

let Box = (origin)=> {
	let ret = new Shape.Prism(origin,2,2,2)
	ret.color = new Color(139,69,19)
	ret.x = origin.x
	ret.y = origin.y
	ret.depth = 2
	return ret
}

export default Box