var CastleBird = function(position) {
    this.stand = loadmodel('bird_stand', 'bird_stand');
    this.fly = loadmodel('bird_fly', 'bird_fly');
    this.object = new THREE.Object3D();
    this.destination;
    this.startTime = 0;
    this.isFirstLoaded = true;
    this.move = function() {
        if(!this.stand.modelResult.isLoaded || !this.fly.modelResult.isLoaded) {
            return;
        }
        if(this.isFirstLoaded) {
            this.isFirstLoaded = false;
            this.object.add(this.stand.modelResult.object);
            this.object.add(this.fly.modelResult.object);
        }

        var diffTime = Date.now() - this.startTime;
        if(diffTime < 3000) {
            this.stand.modelResult.object.visible = true;
            this.fly.modelResult.object.visible = false;
        }
    }
}