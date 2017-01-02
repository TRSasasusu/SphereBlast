var MySphere = function(modelResult) {
    this.modelResult = modelResult;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.move = function() {
        if(!this.modelResult.isLoaded) {
            return;
        }
        this.modelResult.object.position += deltatime * this.velocity;
    };
};