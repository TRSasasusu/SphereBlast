var Wall = function(position, scale) {
    this.object = makeBox(position, scale);
}

function makeBox(position, scale) {
    var geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
    if(!('wall' in materialCaches)) {
        materialCaches['wall'] = new THREE.MeshPhongMaterial({ color: 0xafdfe4, specular: 0xffffff, shininess: 100});
    }
    //var material = new THREE.MeshPhongMaterial({ color: 0xafdfe4, specular: 0xffffff, shininess: 100});
    //var object = new THREE.Mesh(geometry, material);
    var object = new THREE.Mesh(geometry, materialCaches['wall']);
    object.position.set(position.x, position.y, position.z);
    //object.castShadow = true;
    //object.receiveShadow = true;
    scene.add(object);

    return object;
}