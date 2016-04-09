import {Path, Shape, Point, Collection} from '../iso'

import Grid from '../shapes/grid'

import Stairs from '../shapes/stairs'

let Prism = Shape.Prism

let Battlement = (origin,length,width)=> {
	let bg = new Collection()
	bg.add(Prism(origin.translate(0,width,-1),length,1,2))
	bg.add(Prism(origin.translate(-1,-1,0),length,width,1))
	bg.add(Grid(origin,length,width))
	bg.add(Stairs(origin.translate(-1,3,-1)))
	for(let i=0; i<length; i=i+2){
		bg.add(Prism(origin.translate(i,width,1),1,1,1))
	}
	let fg = new Collection()
	//fg.add(Prism(origin.translate(0,-1,-1),length,1,2))
	for(let i=0; i<length; i=i+2){
	//	fg.add(Prism(origin.translate(i,-1,1),1,1,1))
	}
	return {
		background: bg,
		foreground: fg
	}
}

export default Battlement