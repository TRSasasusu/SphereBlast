var Teleport = function(position, targetPosition) {
    this.object = new THREE.Object3D();
    makeTeleport(this.object);
    this.object.position.set(position.x, position.y, position.z);
    this.targetPosition = targetPosition;
    this.move = function() {
        //materialCaches['teleport_bottom'].map.offset.x += 0.01 * deltatime;
        //materialCaches['teleport_bottom'].map.offset.y += 0.01 * deltatime;
        this.object.rotation.y += 0.005 * deltatime;

        if(!sphere.modelResult.isLoaded) {
            return;
        }
        if(this.object.position.distanceTo(sphere.modelResult.object.position) < 0.5) {
            sphere.modelResult.object.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
        }
    };
    
};

function makeTeleport(object) {
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

        var textureCylinder = loader.load('img/teleport_cylinder.png');
        materialCaches['teleport_cylinder'] = new THREE.MeshBasicMaterial({
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
    var cylinder = new THREE.Mesh(cylinderGeo, materialCaches['teleport_cylinder']);

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