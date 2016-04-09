import {Path, Shape, Point, Collection} from '../iso'

import Grid from '../shapes/grid'

import Stairs from '../shapes/stairs'

let Prism = Shape.Prism

let Battlement = (origin,length,width)=> {
	let ret = new Collection()
	ret.add(Prism(origin.translate(0,width,-1),length,1,2))
	ret.add(Prism(origin.translate(0,0,-1),length,width,1))
	ret.add(Grid(origin,length,width))
	ret.add(Stairs(origin.translate(-1,3,-1)))
	for(let i=0; i<length; i=i+2){
		ret.add(Prism(origin.translate(i,width,1),1,1,1))
	}
	return ret
}

export default Battlement