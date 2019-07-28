const OBSWebSocket = require('obs-websocket-js');

class OBSConnection {
    
    constructor( host = 'localhost', port = '4444', password = '' ) {
        this.host     = host;
        this.port     = port;
        this.password = password;
    }

    connect() {
        this.connection = new OBSWebSocket();
        return this.connection.connect(
            { 
                address: this.host + ':' + this.port,
                password: this.password 
            }
        );
    }
}

export default OBSConnection;