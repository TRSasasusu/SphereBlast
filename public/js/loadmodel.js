function loadmodel(obj, mtl, isThereNormal, isNotThereTexture) {
    if(isThereNormal === undefined) {
        isThereNormal = false;
    }

    var onProgress = function(xhr) {
        if(xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function(xhr) {};
    var mtlLoader = new THREE.MTLLoader();
    var result = new ModelResult();

    if(!(mtl in materialCaches)) {
        if(isNotThereTexture) {
            if(mtl == 'star') {
                materialCaches[mtl] = new THREE.MeshBasicMaterial({color: 0xffff55});
            }
        }
        else {
            var texture = new THREE.TextureLoader().load('models/' + mtl + '_colored.png');
            if(mtl == 'sphere2') {
                materialCaches[mtl] = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, side: THREE.BackSide, map: texture});
            }
            else {
                if(isThereNormal) {
                    var normalTexture = new THREE.TextureLoader().load('models/' + mtl + '_normal.png');
                    materialCaches[mtl] = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture, normalMap: normalTexture});
                }
                else {
                    materialCaches[mtl] = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
                }
            }
        }
    }
    var objLoader = new THREE.OBJLoader();
    objLoader.load("models/" + obj + ".obj", function(object) {
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                //child.material = basic;
                child.material = materialCaches[mtl];
            }
        });
        result.object = object;
        object.position.set(0, 0, 0);
        scene.add(object);
        result.isLoaded = true;
    }, onProgress, onError);
    /*mtlLoader.load("models/" + mtl + ".mtl", function(materials) {
        materials.side = THREE.BackSide;
        materials.transparent = true;
        materials.opacity = 0.5;
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        //objLoader.setMaterials(materials);
        texture = new THREE.TextureLoader().load('models/' + mtl + '_colored.png');
        if(!(mtl in materialCaches)) {
            if(mtl == 'sphere2') {
                materialCaches[mtl] = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, side: THREE.BackSide, map: texture});
            }
            else {
                if(isThereNormal) {
                    var normalTexture = new THREE.TextureLoader().load('models/' + mtl + '_normal.png');
                    materialCaches[mtl] = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture, normalMap: normalTexture});
                }
                else {
                    materialCaches[mtl] = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
                }
            }
        }
        //basic = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, side: THREE.BackSide, map: texture});
        objLoader.load("models/" + obj + ".obj", function(object) {
            object.traverse(function(child) {
                if(child instanceof THREE.Mesh) {
                    //child.material = basic;
                    child.material = materialCaches[mtl];
                }
            });
            result.object = object;
            object.position.set(0, 0, 0);
            scene.add(object);
            result.isLoaded = true;
        }, onProgress, onError);
    });*/

    return result;
}

var ModelResult = function() {
    this.object = null;
    this.isLoaded = false;
}