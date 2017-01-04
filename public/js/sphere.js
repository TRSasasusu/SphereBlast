var MySphere = function(modelResult) {
    this.modelResult = modelResult;
    this.velocity = new THREE.Vector3(0, 0, 0);
    //this.tmpwall = new Wall(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0.1, 0.1, 0.1));
    this.isFirstLoaded = true;
    this.cameraDummy = new THREE.Object3D();
    this.anotherCanvas = new AnotherCanvas();
    this.ui = new THREE.Sprite();
    this.move = function() {
        if(!this.modelResult.isLoaded) {
            return;
        }
        if(this.isFirstLoaded) {
            this.isFirstLoaded = false;
            //this.modelResult.object.add(camera);
            //this.modelResult.object.position.x = Math.random() * 600 - 800;
            //this.modelResult.object.position.z = Math.random() * 600 + 200;
            var randomX = [0, -8, 1.979, 2, 4];
            var randomY = [0, 0, 4, 4, 0];
            var randomZ = [0, 6, 4, 4, 8];
            //var randomRY = [0, 0, 180, 0, 180];
            var randomIndex = Math.floor(Math.random() * randomX.length);
            this.modelResult.object.position.set(randomX[randomIndex], randomY[randomIndex], randomZ[randomIndex]);

            scene.add(this.cameraDummy);
            this.cameraDummy.add(camera);

            //this.cameraDummy.rotation.y = randomRY[randomIndex];
            //socketio.emit("connected", this.modelResult.object.position);
            /*var loader = new THREE.FontLoader();
            loader.load("fonts/helvetiker_bold.typeface.json", function(font){
                this.textGeometry = new THREE.TextGeometry("This is a 3D text", {

                    font: font,

                    size: 50,
                    height: 10,
                    curveSegments: 12,

                    bevelThickness: 1,
                    bevelSize: 1,
                    bevelEnabled: true

                });

                var textMat = new THREE.MeshLambertMaterial({color: 0xFF00FF});

                var textMesh = new THREE.Mesh(this.textGeometry, textMat);

                scene.add(textMesh);
                this.isTextLoaded = true;
            });*/
            /*var textGeometry = new THREE.TextGeometry("Players: ", {
                //size: 10, height: 4, font: "helvetiker", weight: "bold", style: "normal"
            });
            var textMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
            var text = new THREE.Mesh(this.textGeometry, textMaterial);
            scene.add(text);*/
            scene.add(this.ui);
            this.ui.scale.set(0.4, 0.4, 1);
            this.ui.name = "ui";
            camera.add(this.ui);
            this.ui.position.z = -0.5;
            //this.ui.position.y = 0.125;
            //camera.add(this.ui);
            //this.ui.position.z = -2;
        }
        var tmpVelocity2 = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
        this.modelResult.object.position.add(tmpVelocity2.multiplyScalar(deltatime));
        this.cameraDummy.position.set(this.modelResult.object.position.x, this.modelResult.object.position.y, this.modelResult.object.position.z);
        if(this.modelResult.object.position.z < -1000) {
            console.log(this.velocity);
        }

        var cameraDirection = forward(camera);
        var sphereForward = forward(this.modelResult.object);
        var sphereRight = right(this.modelResult.object);
        var sphereUp = up(this.modelResult.object);
        materialCaches['sphere2'].opacity = 1;
        if(cameraDirection.dot(sphereForward) > 0.9) {
            this.velocity.add(sphereForward.multiplyScalar(deltatime * 0.00001));
        }
        else if(cameraDirection.dot(sphereForward) < -0.9) {
            this.velocity.sub(sphereForward.multiplyScalar(deltatime * 0.00001));
        }
        else if(cameraDirection.dot(sphereRight) > 0.9) {
            this.velocity.add(sphereRight.multiplyScalar(deltatime * 0.00001));
        }
        else if(cameraDirection.dot(sphereRight) < -0.9) {
            this.velocity.sub(sphereRight.multiplyScalar(deltatime * 0.00001));
        }
        else if(cameraDirection.dot(sphereUp) > 0.9) {
            this.velocity.add(sphereUp.multiplyScalar(deltatime * 0.00001));
        }
        else if(cameraDirection.dot(sphereUp) < -0.9) {
            this.velocity.sub(sphereUp.multiplyScalar(deltatime * 0.00001));
        }
        else {
            //this.modelResult.object.material.opacity = 0.5;
            materialCaches['sphere2'].opacity = 0.3;
        }
        this.velocity.clampLength(0, 0.002);

        var tmpVelocity = (new THREE.Vector3()).set(this.velocity.x, this.velocity.y, this.velocity.z);
        var ray = new THREE.Raycaster(this.modelResult.object.position, tmpVelocity.normalize());
        var objs = ray.intersectObjects(scene.children);
        for(var i = 0; i < objs.length; ++i) {
            if(objs[i].distance < 1 && objs[i].object.name != "mysphere" && objs[i].object.name != "ui") {
                this.velocity.multiplyScalar(-0.1 + (objs[i].distance - 1));
                /*var vx = this.modelResult.object.position.x - objs[i].point.x,
                    vy = this.modelResult.object.position.y - objs[i].point.y,
                    vz = this.modelResult.object.position.z - objs[i].point.z;
                this.velocity.set(vx, vy, vz).clampLength(0, 0.003);*/
                break;
            }
        }
        for(var i = 0; i < scene.children.length; ++i) {
            var objInChild = ray.intersectObjects(scene.children[i].children);
            for(var j = 0; j < objInChild.length; ++j) {
                if(objInChild[j].distance < 1 && objInChild[j].object.name != "mysphere") {
                    this.velocity.multiplyScalar(-0.1 + (objInChild[j].distance - 1));
                    /*var vx = this.modelResult.object.position.x - objInChild[j].point.x,
                        vy = this.modelResult.object.position.y - objInChild[j].point.y,
                        vz = this.modelResult.object.position.z - objInChild[j].point.z;
                    this.velocity.set(vx, vy, vz).clampLength(0, 0.003);*/
                    break;
                }
            }
        }

        /*var sphereDirection = forward(this.modelResult.object);
        var dot = cameraDirection.dot(sphereDirection);
        if(dot > 0.9) {
            var diff = cameraDirection.sub(sphereDirection);
            this.modelResult.object.rotation.x += diff.y * 0.001 * deltatime;
            this.modelResult.object.rotation.y -= diff.x * 0.001 * deltatime;
            //var lerpedDirection = sphereDirection.lerp(cameraDirection, 0.1).multiplyScalar(5);
            //this.modelResult.object.lookAt(this.modelResult.object.position.add(lerpedDirection));
            if(dot > 0.95) {
                this.velocity = sphereDirection.multiplyScalar(0.001);
            }
            else {
                this.velocity = new THREE.Vector3(0, 0, 0);
            }
        }*/
        
        /*else if(dot > 0.9) {
            var diff = cameraDirection.sub(sphereDirection);
            this.modelResult.object.rotation.x += diff.y * deltatime;
            this.modelResult.object.rotation.y += diff.x * deltatime;
        }*/
        /*else {
            this.velocity = new THREE.Vector3(0, 0, 0);
        }*/

        if(this.velocity.z < -500) {
            console.log(this.velocity);
        }

        /*if(this.isTextLoaded) {
            this.textGeometry.text = "Players: " + area.users.length;
        }*/
        this.ui.material = this.anotherCanvas.draw("Players: " + (Object.keys(area.users).length + 1), this.modelResult.object.position);

        socketio.emit("publish", this.modelResult.object.position);
    };
};

function forward(object) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(object.matrix);
    var direction = new THREE.Vector3(0, 0, 1);
    //return matrix.multiplyVector3(direction).normalize().multiplyScalar(-1);
    return direction.applyMatrix4(matrix).normalize().multiplyScalar(-1);
}

function right(object) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(object.matrix);
    var direction = new THREE.Vector3(1, 0, 0);
    //return matrix.multiplyVector3(direction).normalize().multiplyScalar(-1);
    return direction.applyMatrix4(matrix).normalize().multiplyScalar(-1);
}

function up(object) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(object.matrix);
    var direction = new THREE.Vector3(0, 1, 0);
    //return matrix.multiplyVector3(direction).normalize().multiplyScalar(-1);
    return direction.applyMatrix4(matrix).normalize().multiplyScalar(-1);
}

var OtherSphere = function(modelResult) {
    this.modelResult = modelResult;
    this.beMoved = function(position) {
        if(!this.modelResult.isLoaded) {
            return;
        }
        this.modelResult.object.position = position;
    }
}

var AnotherCanvas = function() {
    this.textureCanvas = document.createElement('canvas');
    this.ctx = this.textureCanvas.getContext('2d');

    this.textureCanvas.width = 256;
    this.textureCanvas.height = 256;

    this.ctx.fillStyle = '#22ff22';
    this.text = "";

    this.texture = new THREE.Texture();
    this.material = new THREE.SpriteMaterial({color: 0xffffff/*, transparent: true, opacity: 0.5*/});
    this.draw = function(text, spherePosition) {
        /*if(this.text == text) {
            return this.material;
        }*/

        this.text = text;
        this.ctx.clearRect(0, 0, 256, 256);

        //this.ctx.fillStyle = '#2233ff';
        //this.ctx.fillRect(0, 0, 256, 256);

        this.ctx.strokeStyle = '#000055';
        this.ctx.beginPath();
        this.ctx.arc(128, 128, 80, 0, Math.PI * 2, false);
        this.ctx.stroke();

        this.ctx.fillStyle = '#0000bb';
        this.ctx.beginPath();
        this.ctx.arc(128, 128, 5, 0, Math.PI * 2, false);
        this.ctx.fill();
        for(var key in area.users) {
            if(area.users[key].modelResult.isLoaded && area.users[key].modelResult.object.position.distanceTo(spherePosition) < 20) {
                this.ctx.fillStyle = 'yellow';
                this.ctx.beginPath();
                this.ctx.arc(
                    (area.users[key].modelResult.object.position.x - spherePosition.x) / 20 * 80 + 128,
                    (area.users[key].modelResult.object.position.y - spherePosition.y) / 20 * 80 + 128,
                    5, 0, Math.PI * 2, false
                );
                this.ctx.fill();
            }
        }

        this.ctx.fillStyle = '#22ff22';
        this.ctx.font = "20px 'Roboto Slab'";
        this.ctx.fillText(text, 0, 20, 256);

        this.texture.image = this.textureCanvas;
        if(this.material.map == null) {
            //this.material.map.dispose();
            this.material.map = this.texture;
        }
        //this.material.map = new THREE.Texture(this.textureCanvas);
        this.material.map.needsUpdate = true;
        return this.material;
    }
}