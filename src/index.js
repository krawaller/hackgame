import Isomer from "./iso"

import Battlement from "./scenes/battlement"
import Player from "./shapes/player"

let {Point} = Isomer
let canvas = document.getElementById("canvas")

let boardwidth = 5
let boardlength = 10

let plrx = 0
let plry = 2


let render = ()=> {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	let iso = new Isomer(canvas)
	iso.add(Battlement(Point(0,0,0),boardlength,boardwidth))
	iso.add(Player(Point(plrx,plry,0)))
}

window.addEventListener("keydown",function(e){
	var code = e.which || e.keyCode;
	switch(e.which || e.keyCode){
		case 37: plry = Math.min(plry+1,boardwidth-1); break; // left
		case 38: plrx = Math.min(plrx+1,boardlength-1); break; // up
		case 39: plry = Math.max(plry-1,0); break; // right
		case 40: plrx = Math.max(plrx-1,0); break; // down
	}
	console.log("CODE",code)
	render()
})

render()