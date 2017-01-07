var CastleBird = function() {
    this.stand = loadmodel('bird_stand', 'bird_stand');
    this.fly = loadmodel('bird_fly', 'bird_fly');
    this.object = new THREE.Object3D();
    this.isFirstLoaded = true;
    this.move = function(position, rotationX, rotationY, rotationZ, isFlying) {
        if(!this.stand.isLoaded || !this.fly.isLoaded) {
            return;
        }
        if(this.isFirstLoaded) {
            this.isFirstLoaded = false;
            this.object.add(this.stand.object);
            this.object.add(this.fly.object);
            scene.add(this.object);
        }

        this.stand.object.visible = !isFlying;
        this.fly.object.visible = isFlying;

        this.object.position.copy(position);
        this.object.rotation.x = rotationX;
        this.object.rotation.y = rotationY;
        this.object.rotation.z = rotationZ;
    };
};