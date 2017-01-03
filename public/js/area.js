var Area = function() {
    this.lowerLeftWalls = makeLowerLeftArea();
};

function makeLowerLeftArea() {
    var walls = [];
    walls.push(new Wall(new THREE.Vector3(-100, 0, 50), new THREE.Vector3(2, 100, 100)));
    walls.push(new Wall(new THREE.Vector3(-50, 0, 100), new THREE.Vector3(100, 100, 2)));
    walls.push(new Wall(new THREE.Vector3(-50, 0, 10), new THREE.Vector3(100, 100, 2)));
    walls.push(new Wall(new THREE.Vector3(-10, 0, 50), new THREE.Vector3(2, 100, 100)));
    return walls;
}