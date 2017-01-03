var MySphere = function(modelResult) {
    this.modelResult = modelResult;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.move = function() {
        if(!this.modelResult.isLoaded) {
            return;
        }
        this.modelResult.object.position += deltatime * this.velocity;

        var ray = new THREE.Raycaster(camera.position, forward(camera).normalize().multiplyScalar(-1));
        var objs = ray.intersectObjects(scene.children);
        if(objs.length > 0) {
            objs[0].object.rotation.y += deltatime * 10;
        }
    };
};

function forward(object) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(object.matrix);
    var direction = new THREE.Vector3(0, 0, 1);
    return matrix.multiplyVector3(direction);
}