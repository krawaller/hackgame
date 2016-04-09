import cloneDeep from 'lodash/cloneDeep'
import forEach from 'lodash/forEach'

let engine = {
	findEntityIdAtPoint: function(entities,point){
		let [x,y] = point
		for(var id in entities){
			let e = entities[id]
			if (x>=e[1] && x<e[1]+e[3] && y>=e[2] && y<e[2]+e[4]) {
				return id;
			}
		}
	},
	findPointsNextToEntity: function(e,dir){ // 1 = north, 2 = east, ...
		let ret = [], x, y
		switch(dir){
			case 1: y = e[2]+e[4]; for(x=e[1];x<e[1]+e[3];x++){ ret.push([x,y]); } break;
			case 2: x = e[1]+e[3]; for(y=e[2];y<e[2]+e[4];y++){ ret.push([x,y]); } break;
			case 3: y = e[2]-1;    for(x=e[1];x<e[1]+e[3];x++){ ret.push([x,y]); } break;
			case 4: x = e[1]-1;    for(y=e[2];y<e[2]+e[4];y++){ ret.push([x,y]); } break;
		}
		return ret;
	},
	isPointInBounds: function(level,point){
		let [x,y] = point
		return !(x<0 || x>= level.boardlength || y<0 || y>= level.boardwidth)
	},
	getMoveConsequences: function(moverid,dir,level,entities){
		let targetpoints = engine.findPointsNextToEntity(entities[moverid],dir)
		let ret = {moves:{[moverid]:dir}};
		for(var t=0;t<targetpoints.length;t++){
			let point = targetpoints[t];
			if (!engine.isPointInBounds(level,point)){
				return {block:true};
			}
			let affectedEntityId = engine.findEntityIdAtPoint(entities,point)
			if (affectedEntityId){
				let chainreactions = engine.getMoveConsequences(affectedEntityId,dir,level,entities);
				if (chainreactions.block){
					return chainreactions;
				} else {
					ret.moves = Object.assign(ret.moves,chainreactions.moves)
				}
			}
		}
		return ret
	},
	applyConsequences: function(consequences,entities){
		let ret = cloneDeep(entities);
		forEach(consequences.moves,(dir,id)=>{
			ret[id][1] = ret[id][1] + ["FOO",0,1,0,-1][dir]
			ret[id][2] = ret[id][2] + ["FOO",1,0,-1,0][dir]
		})
		return ret
	}
}

export default engine;