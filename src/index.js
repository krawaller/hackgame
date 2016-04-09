import Isomer from "./iso"

import Battlement from "./scenes/battlement"
import Player from "./avatars/player"
import Box from "./avatars/box"

let {Point} = Isomer
let canvas = document.getElementById("canvas")

let boardwidth = 5, boardlength = 10

let plrx = 0, plry = 2

let entities = [
	[Box,2,2,2,2], // Avatar, x, y, xlength, ylength
	[Box,7,1,2,2]
];

let isPointOk = (x,y)=> {
	return x >= 0 && x < boardlength && y >= 0 && y < boardwidth && entities.every(e=>{
		return !(x>=e[1] && x<e[1]+e[3] && y>=e[2] && y<e[2]+e[4])
	});
}

let render = ()=> {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	let iso = new Isomer(canvas)
	iso.add(Battlement(Point(0,0,0),boardlength,boardwidth))
	iso.drawAvatars([Player(Point(plrx,plry,0))].concat(entities.map(function(e){
		return e[0](Point(e[1],e[2],0));
	})))
}

window.addEventListener("keydown",function(e){
	var code = e.which || e.keyCode;
	switch(e.which || e.keyCode){
		case 37: isPointOk(plrx,plry+1) && plry++; break; // left
		case 38: isPointOk(plrx+1,plry) && plrx++; break; // up
		case 39: isPointOk(plrx,plry-1) && plry--; break; // right
		case 40: isPointOk(plrx-1,plry) && plrx--; break; // down
	}
	render()
})

render()