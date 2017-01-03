var Area = function() {
    this.lowerLeftWalls = makeLowerLeftArea();
    this.users = {};
};

function makeLowerLeftArea() {
    var walls = [];
    walls.push(new Wall(new THREE.Vector3(-1000, 0, 500), new THREE.Vector3(20, 1000, 1000)));
    walls.push(new Wall(new THREE.Vector3(-500, 0, 1000), new THREE.Vector3(1000, 1000, 20)));
    walls.push(new Wall(new THREE.Vector3(-500, 0, 100), new THREE.Vector3(1000, 1000, 20)));
    walls.push(new Wall(new THREE.Vector3(-100, 0, 500), new THREE.Vector3(20, 1000, 1000)));

    walls.push(new Wall(new THREE.Vector3(-500, 500, 500), new THREE.Vector3(1000, 20, 1000)));
    walls.push(new Wall(new THREE.Vector3(-500, -500, 500), new THREE.Vector3(1000, 20, 1000)));

    walls.push(new Wall(new THREE.Vector3(-300, 0, 200), new THREE.Vector3(500, 1000, 20)));
    walls.push(new Wall(new THREE.Vector3(-800, 0, 400), new THREE.Vector3(20, 1000, 400)));
    walls.push(new Wall(new THREE.Vector3(-600, 0, 300), new THREE.Vector3(20, 1000, 300)));
    walls.push(new Wall(new THREE.Vector3(-450, 0, 800), new THREE.Vector3(20, 1000, 200)));
    walls.push(new Wall(new THREE.Vector3(-100, 0, 900), new THREE.Vector3(200, 1000, 20)));
    return walls;
}