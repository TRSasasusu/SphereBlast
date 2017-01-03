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
            this.modelResult.object.position.x = Math.random() * 60 - 80;
            this.modelResult.object.position.z = Math.random() * 60 + 20;
            scene.add(this.cameraDummy);
            this.cameraDummy.add(camera);
        }
        this.modelResult.object.position.add(this.velocity.multiplyScalar(deltatime));
        this.cameraDummy.position.set(this.modelResult.object.position.x, this.modelResult.object.position.y, this.modelResult.object.position.z);
        if(this.modelResult.object.position.z < -1000) {
            console.log(this.velocity);
        }

        /*var ray = new THREE.Raycaster(camera.position, forward(camera).normalize().multiplyScalar(-1));
        var objs = ray.intersectObjects(scene.children);
        if(objs.length > 0) {
            objs[0].object.rotation.y += deltatime * 10;
        }*/
        var cameraDirection = forward(camera);
        var sphereForward = forward(this.modelResult.object);
        var sphereRight = right(this.modelResult.object);
        var sphereUp = up(this.modelResult.object);
        if(cameraDirection.dot(sphereForward) > 0.9) {
            this.velocity.add(sphereForward.multiplyScalar(deltatime * 0.0001));
        }
        else if(cameraDirection.dot(sphereForward) < -0.9) {
            this.velocity.sub(sphereForward.multiplyScalar(deltatime * 0.0001));
        }
        else if(cameraDirection.dot(sphereRight) > 0.9) {
            this.velocity.add(sphereRight.multiplyScalar(deltatime * 0.0001));
        }
        else if(cameraDirection.dot(sphereRight) < -0.9) {
            this.velocity.sub(sphereRight.multiplyScalar(deltatime * 0.0001));
        }
        else if(cameraDirection.dot(sphereUp) > 0.9) {
            this.velocity.add(sphereUp.multiplyScalar(deltatime * 0.0001));
        }
        else if(cameraDirection.dot(sphereUp) < -0.9) {
            this.velocity.sub(sphereUp.multiplyScalar(deltatime * 0.0001));
        }
        this.velocity.clampLength(0, 0.01);

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