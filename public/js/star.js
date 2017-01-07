var Star = function() {
    this.modelResult = loadmodel('star', 'star', false, true);
    this.move = function(position) {
        if(!this.modelResult.isLoaded) {
            return;
        }

        this.modelResult.object.position.copy(position);
    };
};