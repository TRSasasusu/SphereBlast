var Area = function() {
    //this.lowerLeftWalls = makeLowerLeftArea();
    this.lowerLeftWalls = loadmodel('lowerleft', 'lowerleft', true);
    this.mountain = loadmodel('mountain', 'mountain', true);
    this.castle = loadmodel('castle_2', 'castle_2', true);
    this.castleGround = loadmodel('ground_castle', 'ground_castle', true);
    this.users = {};
    this.whichArea = WhichArea.MAZE;
    this.mountainSky = makeSky('milkyway', new THREE.Vector3(-1000, 0, 0));
    this.castleSky = makeSky('castle', new THREE.Vector3(1000, 0, 0));
    this.teleports = [new Teleport(new THREE.Vector3(-2, 0, -8), new THREE.Vector3(-900, 50, 0), WhichArea.MAZE, 1, false),
                      new Teleport(new THREE.Vector3(-930, 20, 0), new THREE.Vector3(-6, 0, -8), WhichArea.MOUNTAIN, 60, true),
                      new Teleport(new THREE.Vector3(6, 4, -2), new THREE.Vector3(975, 50, 0), WhichArea.MAZE, 1, false),
                      new Teleport(new THREE.Vector3(1000, -20, 0), new THREE.Vector3(-8, 4, -8), WhichArea.CASTLE, 140, true)];
    //this.skies = {};
    //this.skyNow;
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
            this.castle.object.scale.set(5, 5, 5);
        }
        if(this.castleGround.isLoaded) {
            this.castleGround.object.position.x = 1000;
            this.castleGround.object.position.y = -40;
            this.castleGround.object.scale.set(80, 80, 80);
        }

        for(var i = 0; i < this.teleports.length; ++i) {
            this.teleports[i].move();
        }
        this.checkAndModifyArea();

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
    this.checkAndModifyArea = function() {
        if(sphere.modelResult.isLoaded) {
            if(sphere.modelResult.object.position.x < -500) {
                if(this.whichArea != WhichArea.MOUNTAIN) {
                    this.whichArea = WhichArea.MOUNTAIN;
                    changeAudio('Nostalgia');
                    //this.changeSky('milkyway');
                }
            }
            else if(sphere.modelResult.object.position.x > 500) {
                if(this.whichArea != WhichArea.CASTLE) {
                    this.whichArea = WhichArea.CASTLE;
                    changeAudio('mataonajiyuugure');
                    //this.changeSky('castle');
                }
            }
            else {
                if(this.whichArea != WhichArea.MAZE) {
                    this.whichArea = WhichArea.MAZE;
                    changeAudio('yorunotobari');
                    //this.disableSky();
                }
            }
        }
    };
    /*this.changeSky = function(skyName) {
        this.disableSky();

        if(!(skyName in this.skies)) {
            var loader = new THREE.TextureLoader();
            var materials = [];
            var skyDirections = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
            for(var i = 0; i < 6; ++i) {
                materials.push(new THREE.MeshBasicMaterial({
                    map: loader.load('/img/sky/' + skyName + '/' + skyDirections[i] + '.jpg'),
                    side: THREE.BackSide
                }));
            }

            //var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MultiMaterial( materials ) );
			//skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, - 1 ) );
            var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), new THREE.MultiMaterial( materials ) );
			scene.add(skyBox);
            this.skies[skyName] = skyBox;
        }

        this.skyNow = this.skies[skyName];
        this.skyNow.visible = true;
    }
    this.disableSky = function() {
        if(this.skyNow != null) {
            this.skyNow.visible = false;
            this.skyNow = null;
        }
    }*/
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

function changeAudio(audioName) {
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

function makeSky(skyName, position) {
    var loader = new THREE.TextureLoader();
    var materials = [];
    var skyDirections = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    for(var i = 0; i < 6; ++i) {
        materials.push(new THREE.MeshBasicMaterial({
            map: loader.load('/img/sky/' + skyName + '/' + skyDirections[i] + '.jpg'),
            side: THREE.BackSide
        }));
    }
    var material = new THREE.MeshFaceMaterial(materials);
    //var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MultiMaterial( materials ) );
    //skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, - 1 ) );
    var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), material);
    scene.add(skyBox);

    skyBox.position.copy(position);

    return skyBox;
}