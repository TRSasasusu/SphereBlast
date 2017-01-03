var MySphere = function(modelResult) {
    this.modelResult = modelResult;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.tmpwall = new Wall(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0.1, 0.1, 0.1));
    this.isFirstLoaded = true;
    this.move = function() {
        if(!this.modelResult.isLoaded) {
            return;
        }
        if(this.isFirstLoaded) {
            this.isFirstLoaded = false;
            this.modelResult.object.add(camera);
        }
        this.modelResult.object.position.add(this.velocity.multiplyScalar(deltatime));

        /*var ray = new THREE.Raycaster(camera.position, forward(camera).normalize().multiplyScalar(-1));
        var objs = ray.intersectObjects(scene.children);
        if(objs.length > 0) {
            objs[0].object.rotation.y += deltatime * 10;
        }*/
        if(forward(camera).dot(forward(this.modelResult.object)) > 0.95) {
            this.velocity = forward(camera).multiplyScalar(0.001);
        }
        else {
            this.velocity = new THREE.Vector3(0, 0, 0);
        }
    };
};

function forward(object) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(object.matrix);
    var direction = new THREE.Vector3(0, 0, 1);
    return matrix.multiplyVector3(direction).normalize().multiplyScalar(-1);
}