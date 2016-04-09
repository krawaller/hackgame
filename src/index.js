import Isomer from "./iso"

import Battlement from "./scenes/battlement"
import Player from "./avatars/player"
import Box from "./avatars/box"

import map from "lodash/map"

import engine from "./engine"

let {Point} = Isomer
let canvas = document.getElementById("canvas")

let level = {
	boardwidth: 5,
	boardlength: 10
}

let scene = Battlement(Point(0,0,0),level.boardlength,level.boardwidth);

let entities = {
	box1: [Box,2,2,2,2], // Avatar, x, y, xlength, ylength, cons
	box2: [Box,7,1,2,2],
	plr:  [Player,0,2,1,1]
}

let render = ()=> {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	let iso = new Isomer(canvas)
	iso.add(scene.background)
	iso.drawAvatars(map(entities,function(e,name){
		return e[0](Point(e[1],e[2],0));
	}))
	iso.add(scene.foreground)
}

window.addEventListener("keydown",function(e){
	switch(e.which || e.keyCode){
		case 37: 
			entities = engine.applyConsequences( engine.getMoveConsequences('plr',1,level,entities), entities );
			break;
		case 38:
			entities = engine.applyConsequences( engine.getMoveConsequences('plr',2,level,entities), entities );
			break;
		case 39:
			entities = engine.applyConsequences( engine.getMoveConsequences('plr',3,level,entities), entities );
			break;
		case 40:
			entities = engine.applyConsequences( engine.getMoveConsequences('plr',4,level,entities), entities );
			break;
	}
	render()
})

render()