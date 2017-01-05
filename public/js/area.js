var Area = function() {
    //this.lowerLeftWalls = makeLowerLeftArea();
    this.lowerLeftWalls = loadmodel('lowerleft', 'lowerleft', true);
    this.mountain = loadmodel('mountain', 'mountain', true);
    this.castle = loadmodel('castle', 'castle', true);
    this.users = {};
    this.teleport = new Teleport(new THREE.Vector3(-2, 0, -8), new THREE.Vector3(-1000, 50, 0));
    this.whichArea = WhichArea.MAZE;
    this.move = function() {
        if(this.lowerLeftWalls.isLoaded) {
            //this.lowerLeftWalls.object.position.set(-)
        }
        if(this.mountain.isLoaded) {
            this.mountain.object.position.x = -1000;
            this.mountain.object.scale.set(70, 70, 70);
        }
        if(this.castle.isLoaded) {
            this.castle.object.position.x = 1000;
            this.castle.object.scale.set(70, 70, 70);
        }

        this.teleport.move();
        if(sphere.modelResult.isLoaded) {
            if(sphere.modelResult.object.position.x < -500) {
                if(this.whichArea != WhichArea.MOUNTAIN) {
                    this.whichArea = WhichArea.MOUNTAIN;
                    ChangeAudio('Nostalgia');
                }
            }
            else if(sphere.modelResult.object.position.x > 500) {
                this.whichArea = WhichArea.CASTLE;
                if(this.whichArea != WhichArea.CASTLE) {
                    this.whichArea = WhichArea.CASTLE;
                    ChangeAudio('mataonajiyuugure');
                }
            }
            else {
                this.whichArea = WhichArea.MAZE;
                if(this.whichArea != WhichArea.MAZE) {
                    this.whichArea = WhichArea.MAZE;
                    ChangeAudio('yorunotobari');
                }
            }
        }

        for(var key in this.users) {
            if(this.users[key].previousTime < 0) {
                continue;
            }
            if(Date.now() - this.users[key].previousTime > 1000 * 60) {
                scene.remove(this.users[key].modelResult.object);
                delete this.users[key];
            }
        }
    };
};

var WhichArea = {
    MAZE: 0, MOUNTAIN: 1, CASTLE: 2
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

function ChangeAudio(audioName) {
    audio.pause();
    audio.currentTime = 0;
    if(audio.canPlayType("audio/mp3") == 'maybe') {
        audio.src = "sounds/music/" + audioName + ".mp3";
    }
    else {
        audio.src = "sounds/music/" + audioName + ".ogg";
    }
    audio.play();
}