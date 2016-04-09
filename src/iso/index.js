import Isomer from 'isomer'

// add Collection class
Isomer.Collection = function(shapes){
	this.shapes = shapes || [];
}
Isomer.Collection.prototype.add = function(shape){
	this.shapes = this.shapes.concat(shape);
}

// Allow merging of shapes
Isomer.Shape.prototype.merge = function(otherShape){
	this.paths = this.paths.concat(otherShape.paths)
}

// Hack add to respect shape and path colors, and support Collection
Isomer.prototype.add = function(item, baseColor) {
	if (Object.prototype.toString.call(item) == '[object Array]') {
		for (var i = 0; i < item.length; i++) {
			this.add(item[i], baseColor);
		}
	} else if (item instanceof Isomer.Path) {
		this._addPath(item, item.color || baseColor);
	} else if (item instanceof Isomer.Collection){
		this.add(item.shapes);
	} else if (item instanceof Isomer.Shape) {
		/* Fetch paths ordered by distance to prevent overlaps */
		var paths = item.orderedPaths();
		for (var j = 0; j < paths.length; j++) {
			this._addPath(paths[j], item.color || baseColor);
		}
	}
};

Isomer.prototype.drawAvatars = function(avatars){
	console.log("AVATAAARS!",avatars)
	var sorted = avatars.sort(function(a1,a2){
		return a1.x+a1.y < a2.x+a2.y ? 1 : a1.x+a1.y > a2.x+a2.y ? -1 : a1.depth < a2.depth ? 1 : -1;
	})
	console.log("SORT",sorted)
	sorted.map(function(i){
		this.add(i);
	}.bind(this));
}

export let {Point,Shape,Path,Color,Canvas,Vector,Collection} = Isomer
export default Isomer