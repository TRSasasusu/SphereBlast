var Wall = function(position, scale) {
    this.object = makeBox(position, scale);
}

function makeBox(position, scale) {
    var geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50});
    var object = new THREE.Mesh(geometry, material);
    object.position.set(position.x, position.y, position.z);
    scene.add(object);

    return object;
}