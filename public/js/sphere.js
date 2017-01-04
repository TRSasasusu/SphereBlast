var MySphere = function(modelResult) {
    this.modelResult = modelResult;
    this.velocity = new THREE.Vector3(0, 0, 0);
    //this.tmpwall = new Wall(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0.1, 0.1, 0.1));
    this.isFirstLoaded = true;
    this.cameraDummy = new THREE.Object3D();
    this.move = function() {
        if(!this.modelResult.isLoaded) {
            return;
        }
        if(this.isFirstLoaded) {
            this.isFirstLoaded = false;
            //this.modelResult.object.add(camera);
            //this.modelResult.object.position.x = Math.random() * 600 - 800;
            //this.modelResult.object.position.z = Math.random() * 600 + 200;
            scene.add(this.cameraDummy);
            this.cameraDummy.add(camera);
            //socketio.emit("connected", this.modelResult.object.position);
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
            if(objs[i].distance < 1 && objs[i].object.name != "球") {
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
                if(objInChild[j].distance < 1 && objInChild[j].object.name != "球") {
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