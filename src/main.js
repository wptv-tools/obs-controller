// Example scripts
import OBSConnection from './obs/obs-connection';
import OBSSource from './obs/requests/obs-source';

const obsCon = new OBSConnection('localhost', 4444, '1234567890');
obsCon.connect().then( data => {
    const obsSrc = new OBSSource( obsCon, 'Name' );
    obsSrc.setSetting('text', 'Jo man!');
}).catch( err => {
    console.log(err);
});

/*
const obs = new OBSWebSocket();

obs.connect({ address: 'localhost:4444', password: '1234567890' }).then(() => {
    console.log('Success! Connected.');
    obs.disconnect();
}).catch( err => {
    console.log('error');
});

let setSourceSettings = function ( obs ) {
    obs.send('SetSourceSettings',{
        'sourceName': 'Name',
        'sourceSettings': { text: 'Dett iss mein Text' },
    }).then( data => {
        console.log( data );
    }).catch( err => {
        console.log( err );
    });
}

let getSourceSettings = function ( obs ) {
    obs.send('GetSourceSettings',{
        'sourceName': 'Name',
    }).then( data => {
        console.log( data );
    }).catch( err => {
        console.log( err );
    });
}

let getSources = function ( obs ) {
    obs.send('GetCurrentScene').then( data => {
        console.log( data );
    }).catch( err => {
        console.log( err );
    });
}

let startStream = function ( obs ) {
    obs.send('StartStreaming').then( data => {
        console.log( data );
    }).catch( err => {
        console.log( err );
    });
}

let stopStream = function ( obs ) {
    obs.send('StopStreaming').then( data => {
        console.log( data );
    }).catch( err => {
        console.log( err );
    });
}
*/