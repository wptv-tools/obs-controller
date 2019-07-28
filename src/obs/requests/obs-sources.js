class OBSSource {

    constructor( connection, sourceName ) {
        this.connection = connection;
        this.sourceName = sourceName;
    }

    getSettings() {
        return this.connection.send('GetSourceSettings',{
            'sourceName': this.sourceName,
        });
    }

    setSettings(name, value) {
        return this.connection.send('SetSourceSettings',{
            'sourceName': this.sourceName,
            'sourceSettings': { name: value },
        });
    }
}

export default new ObsScenes();