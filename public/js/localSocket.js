//socketio.on("connected", function() {});
/*socketio.on("publish", function(id, position) {
    if(!(id in area.users)) {
        area.users[id] = new OtherSphere(loadmodel("sphere2", "sphere_other"));
    }

    if(!area.users[id].modelResult.isLoaded) {
        return;
    }
    area.users[id].modelResult.object.position = position;
});
socketio.on("disconnect", function(id) {
    scene.remove(area.users[id].modelResult.object);

    delete area.users[id];
});*/