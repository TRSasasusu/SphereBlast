var Area = function() {
    this.lowerLeftWalls = makeLowerLeftArea();
};

function makeLowerLeftArea() {
    var walls = [];
    walls.push(new Wall(new THREE.Vector3(-1000, 0, 500), new THREE.Vector3(2, 1000, 1000)));
    walls.push(new Wall(new THREE.Vector3(-500, 0, 1000), new THREE.Vector3(1000, 1000, 2)));
    walls.push(new Wall(new THREE.Vector3(-500, 0, 100), new THREE.Vector3(1000, 1000, 2)));
    walls.push(new Wall(new THREE.Vector3(-100, 0, 500), new THREE.Vector3(2, 1000, 1000)));
    return walls;
}