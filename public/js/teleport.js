var Teleport = function(position, targetPositions, whichAreaThisIsIn, scaleScalar, isAreaTeleport) {
    this.object = new THREE.Object3D();
    makeTeleport(this.object, isAreaTeleport);
    this.object.position.set(position.x, position.y, position.z);
    this.object.scale.set(scaleScalar, scaleScalar, scaleScalar);
    this.targetPositions = targetPositions;
    this.isAreaTeleport = isAreaTeleport;
    this.move = function() {
        //materialCaches['teleport_bottom'].map.offset.x += 0.01 * deltatime;
        //materialCaches['teleport_bottom'].map.offset.y += 0.01 * deltatime;
        this.object.rotation.y += 0.005 * deltatime;

        area.checkAndModifyArea();
        if(!sphere.modelResult.isLoaded || whichAreaThisIsIn != area.whichArea) {
            return;
        }
        if(!isAreaTeleport && this.object.position.distanceTo(sphere.modelResult.object.position) < 0.7) {
            var tmpIndex = Math.floor(Math.random() * this.targetPositions.length);
            sphere.modelResult.object.position.set(this.targetPositions[tmpIndex].x, this.targetPositions[tmpIndex].y, this.targetPositions[tmpIndex].z);
        }
        if(isAreaTeleport && Math.pow(sphere.modelResult.object.position.x - this.object.position.x, 2) + Math.pow(sphere.modelResult.object.position.z - this.object.position.z, 2) > scaleScalar * 0.6 * scaleScalar) {
            sphere.modelResult.object.position.set(this.targetPositions[0].x, this.targetPositions[0].y, this.targetPositions[0].z);
        }
    };
    
};

function makeTeleport(object, isAreaTeleport) {
    if(!('teleport_bottom' in materialCaches)) {
        var loader = new THREE.TextureLoader();
        var textureBottom = loader.load('img/teleport_bottom.png');
        materialCaches['teleport_bottom'] = new THREE.MeshBasicMaterial({
            map: textureBottom,
            color: 0x7777ff,
            transparent: true,
            //depthWrite: false
        });
        materialCaches['teleport_bottom'].map.wrapS = materialCaches['teleport_bottom'].map.wrapT = THREE.RepeatWrapping;
    }
    var suffix = isAreaTeleport ? '_area' : '';
    if(!(('teleport_cylinder' + suffix) in materialCaches)) {
        var loader = new THREE.TextureLoader();
        var textureCylinder = loader.load('img/teleport_cylinder' + suffix + '.png');
        materialCaches['teleport_cylinder' + suffix] = new THREE.MeshBasicMaterial({
            map: textureCylinder,
            color: 0x9999ff,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false
        });
    }
    var bottomGeo = new THREE.TorusGeometry(1.7, 1.4, 2, 50);
    var bottom = new THREE.Mesh(bottomGeo, materialCaches['teleport_bottom']);
    bottom.rotation.x = 90 * Math.PI / 180;
    bottom.position.y = -0.99;

    var cylinderGeo = new THREE.CylinderGeometry(0.8, 0.9, 2, 40, 40, true);
    var cylinder = new THREE.Mesh(cylinderGeo, materialCaches['teleport_cylinder' + suffix]);

    bottom.renderOrder = -2;
    scene.add(bottom);
    cylinder.renderOrder = -1;
    scene.add(cylinder);
    scene.add(object);
    object.add(bottom);
    object.add(cylinder);
    //debugTest();
    bottom.name = "mysphere";
    cylinder.name = "mysphere";
}

function debugTest() {
    var cube = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50, transparent: true, opacity: 0.5});

            var mesh = new THREE.Mesh(cube, material);
            mesh.position.set(0, 0, -1);
            scene.add(mesh);
}