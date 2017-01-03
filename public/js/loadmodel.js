function loadmodel(filenameWithoutExtension) {
    var onProgress = function(xhr) {
        if(xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function(xhr) {};
    var mtlLoader = new THREE.MTLLoader();
    var result = new ModelResult();
    mtlLoader.load("models/" + filenameWithoutExtension + ".mtl", function(materials) {
        materials.side = THREE.BackSide;
        materials.transparent = true;
        materials.opacity = 0.5;
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        //objLoader.setMaterials(materials);
        texture = new THREE.TextureLoader().load('models/' + filenameWithoutExtension + '_colored.png');
        basic = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, side: THREE.BackSide, map: texture});
        objLoader.load("models/" + filenameWithoutExtension + ".obj", function(object) {
            object.traverse(function(child) {
                if(child instanceof THREE.Mesh) {
                    child.material = basic;
                }
            });
            result.object = object;
            object.position.set(0, 0, 0);
            scene.add(object);
            result.isLoaded = true;
        }, onProgress, onError);
    });

    return result;
}

var ModelResult = function() {
    this.object = null;
    this.isLoaded = false;
}