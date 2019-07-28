(function () {
    'use strict';

    const React = require('react');
    const ReactDOM = require('react-dom');

    const obs = new OBSWebSocket();

    obs.connect({ address: 'localhost:4444', password: '1234567890' }).then(() => {
        console.log('Success! Connected.');
        obs.disconnect();
    }).catch( err => {
        console.log('error');
    });

}());
