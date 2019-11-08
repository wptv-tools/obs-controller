class OBSSource {
  constructor(connection, sourceName) {
    this.connection = connection;
    this.sourceName = sourceName;
  }

  getSettings() {
    return this.connection.send("GetSourceSettings", {
      sourceName: this.sourceName
    });
  }

  setSetting(name, value) {
    return this.connection.send("SetSourceSettings", {
      sourceName: this.sourceName,
      sourceSettings: { name: value }
    });
  }
}

export default OBSSource;
