
const path = require('path')
const { openStreamDeck } = require('elgato-stream-deck')
const OBSWebSocket = require('obs-websocket-js');
const sharp = require('sharp')
var Jimp = require("jimp");
var fileName = 'test.png';
var fileNameOut = 'out.png';
var ATEM = require('applest-atem');
var atem = new ATEM();
const fs = require('fs');
const {number} = require("sharp/lib/is");
const myStreamDeck = openStreamDeck()
const obs = new OBSWebSocket();
obs.connect({ address: 'localhost:4444', password: '12345678' });
atem.connect('192.168.11.240');
var rec = 0
var myevent
var currentevent

atem.on('stateChanged', function(err, state) {
    //console.log(state.video.ME[0].programInput  ); // catch the ATEM state.
    console.log( typeof (  state.video.ME[0].programInput  ));
    if ( typeof (state.video.ME[0].programInput ) != "undefined" ) {
        switch ( state.video.ME[0].programInput ) {
            case 1:
                obs.send('SetCurrentScene', {
                    'scene-name': "Titel"
                });
                break;
            case 2:
                obs.send('SetCurrentScene', {
                    'scene-name': "Folien"
                });
                break;
            case 3:
                obs.send('SetCurrentScene', {
                    'scene-name': "Speaker"
                });
                break;
        }
    }
});

fs.readFile('event.json', (err, data) => {
    if (err) throw err;
    myevent = JSON.parse(data);
    currentevent = 0
});


obs.on( 'Heartbeat', data => {
    console.log( data )
})

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


function clean_buttons() {

    sharp(path.resolve(__dirname, 'folie-speaker.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(6, buffer)
        })
        .catch(err => {
            console.error(err)
        })
    sharp(path.resolve(__dirname, 'speaker-folie.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(7, buffer)
        })
        .catch(err => {
            console.error(err)
        })

    sharp(path.resolve(__dirname, 'titel.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(10, buffer)
        })
        .catch(err => {
            console.error(err)
        })
    sharp(path.resolve(__dirname, 'folie.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(11, buffer)
        })
        .catch(err => {
            console.error(err)
        })
    sharp(path.resolve(__dirname, 'speaker.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(12, buffer)
        })
        .catch(err => {
            console.error(err)
        })

}


obs.on( 'SwitchScenes', data => {
    //console.log(data['scene-name']);
    clean_buttons()
    switch ( data['scene-name'] ) {
        case 'Speaker':
            sharp(path.resolve(__dirname, 'speaker-active.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(12, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            break;
        case 'Titel':
            sharp(path.resolve(__dirname, 'titel-active.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(10, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            break;
        case 'Folien/Speaker':
            sharp(path.resolve(__dirname, 'folie-speaker-active.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(6, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            break;
        case 'Speaker/Folien':
            sharp(path.resolve(__dirname, 'speaker-folie-active.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(7, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            break;
        case 'Folien':
            sharp(path.resolve(__dirname, 'folie-active.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(11, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            break;
    }
});

obs.on('RecordingStopped', err => {
    sharp(path.resolve(__dirname, 'rec-off.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(14, buffer)
        })
        .catch(err => {
            console.error(err)
        })
    rec = 0
});

obs.on('RecordingStarted', err => {
    sharp(path.resolve(__dirname, 'rec-on.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(14, buffer)
        })
        .catch(err => {
            console.error(err)
        })
    rec = 1
});

myStreamDeck.on('down', keyIndex => {
    console.log('key %d down', keyIndex)

    if (keyIndex == 0 ) {
        if ( currentevent > 0 ) {
            currentevent--
        }
        if (currentevent == 0 ) {
            sharp(path.resolve(__dirname, 'vorheriger-off.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(0, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            sharp(path.resolve(__dirname, 'vorheriger.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(0, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        sharp(path.resolve(__dirname, 'naechster.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(1, buffer)
            })
            .catch(err => {
                console.error(err)
            })

        Jimp.read(fileName)
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            })
            .then(function (font) {
                loadedImage.print(font, 10, 10, myevent[currentevent].name)
                loadedImage.print(font, 50, 50, myevent[currentevent].session)
                    .write(fileNameOut);
            })
            .catch(function (err) {
                console.error(err);
            });

        obs.send('SetSourceSettings', {
            'sourceName': "Name",
            'sourceSettings': { 'text' : myevent[currentevent].name  }
        });
        obs.send('SetSourceSettings', {
            'sourceName': "Session",
            'sourceSettings': { 'text' : myevent[currentevent].session  }
        });

    }
    if (keyIndex == 1 ) {
        if ( currentevent < ( myevent.length -1) ) {
            currentevent++
        }
        if (currentevent == ( myevent.length -1) ) {
            sharp(path.resolve(__dirname, 'naechster-off.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(1, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            sharp(path.resolve(__dirname, 'naechster.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(1, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        sharp(path.resolve(__dirname, 'vorheriger.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(0, buffer)
            })
            .catch(err => {
                console.error(err)
            })

        Jimp.read(fileName)
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            })
            .then(function (font) {
                loadedImage.print(font, 10, 10, myevent[currentevent].name)
                loadedImage.print(font, 50, 50, myevent[currentevent].session)
                    .write(fileNameOut);
            })
            .catch(function (err) {
                console.error(err);
            });

        obs.send('SetSourceSettings', {
            'sourceName': "Name",
            'sourceSettings': { 'text' : myevent[currentevent].name  }
        });
        obs.send('SetSourceSettings', {
            'sourceName': "Session",
            'sourceSettings': { 'text' : myevent[currentevent].session  }
        });

    }


    if (keyIndex == 6 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Folien/Speaker"
        });

        clean_buttons()
        sharp(path.resolve(__dirname, 'folie-speaker-active.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(6, buffer)
            })
            .catch(err => {
                console.error(err)
            })
    }

    if (keyIndex == 7 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Speaker/Folien"
        });
        clean_buttons()
        sharp(path.resolve(__dirname, 'speaker-folie-active.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(7, buffer)
            })
            .catch(err => {
                console.error(err)
            })
    }

    if (keyIndex == 10 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Titel"
        });
        clean_buttons()
        atem.changeProgramInput(1);
        sharp(path.resolve(__dirname, 'titel-active.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(10, buffer)
            })
            .catch(err => {
                console.error(err)
            })
    }
    if (keyIndex == 11 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Folien"
        });
        clean_buttons()
        atem.changeProgramInput(2);
        sharp(path.resolve(__dirname, 'folie-active.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(11, buffer)
            })
            .catch(err => {
                console.error(err)
            })
    }

    if (keyIndex == 12 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Speaker"
        });
        clean_buttons()
        atem.changeProgramInput(3);
        sharp(path.resolve(__dirname, 'speaker-active.png'))
            .flatten() // Eliminate alpha channel, if any.
            .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
            .raw() // Give us uncompressed RGB.
            .toBuffer()
            .then(buffer => {
                myStreamDeck.fillImage(12, buffer)
            })
            .catch(err => {
                console.error(err)
            })
    }


    if ( keyIndex == 14 ) {
        if ( rec == 0 ) {
            sharp(path.resolve(__dirname, 'rec-on.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(14, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            obs.send('StartRecording');
        } else {
            sharp(path.resolve(__dirname, 'rec-off.png'))
                .flatten() // Eliminate alpha channel, if any.
                .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
                .raw() // Give us uncompressed RGB.
                .toBuffer()
                .then(buffer => {
                    myStreamDeck.fillImage(14, buffer)
                })
                .catch(err => {
                    console.error(err)
                })
            obs.send('StopRecording');
        }
    }
})

myStreamDeck.on('up', keyIndex => {
    console.log('key %d up', keyIndex)
})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('error', error => {
    console.error(error)
})






for ( i=0; i<15; i++ ) {
    myStreamDeck.fillColor(i, 0, 0, 0)
}
sharp(path.resolve(__dirname, 'rec-off.png'))
    .flatten() // Eliminate alpha channel, if any.
    .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
    .raw() // Give us uncompressed RGB.
    .toBuffer()
    .then(buffer => {
        myStreamDeck.fillImage(14, buffer)
    })
    .catch(err => {
        console.error(err)
    })


sharp(path.resolve(__dirname, 'beamer-folien.png'))
    .flatten() // Eliminate alpha channel, if any.
    .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
    .raw() // Give us uncompressed RGB.
    .toBuffer()
    .then(buffer => {
        myStreamDeck.fillImage(3, buffer)
    })
    .catch(err => {
        console.error(err)
    })
sharp(path.resolve(__dirname, 'beamer-signage.png'))
    .flatten() // Eliminate alpha channel, if any.
    .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
    .raw() // Give us uncompressed RGB.
    .toBuffer()
    .then(buffer => {
        myStreamDeck.fillImage(4, buffer)
    })
    .catch(err => {
        console.error(err)
    })
sharp(path.resolve(__dirname, 'vorheriger-off.png'))
    .flatten() // Eliminate alpha channel, if any.
    .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
    .raw() // Give us uncompressed RGB.
    .toBuffer()
    .then(buffer => {
        myStreamDeck.fillImage(0, buffer)
    })
    .catch(err => {
        console.error(err)
    })
sharp(path.resolve(__dirname, 'naechster.png'))
    .flatten() // Eliminate alpha channel, if any.
    .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
    .raw() // Give us uncompressed RGB.
    .toBuffer()
    .then(buffer => {
        myStreamDeck.fillImage(1, buffer)
    })
    .catch(err => {
        console.error(err)
    })


    init()



async function init(){
    clean_buttons()
    await sleep(500)
    obs.send('SetCurrentScene', {
        'scene-name': "Titel"
    }).catch(err => {
        console.error(err)
    })
    obs.send('SetSourceSettings', {
        'sourceName': "Name",
        'sourceSettings': { 'text' : myevent[0].name  }
    });
    obs.send('SetSourceSettings', {
        'sourceName': "Session",
        'sourceSettings': { 'text' : myevent[0].session  }
    });
    sharp(path.resolve(__dirname, 'titel-active.png'))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(10, buffer)
        })
        .catch(err => {
            console.error(err)
        })

    Jimp.read(fileName)
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        })
        .then(function (font) {
            loadedImage.print(font, 10, 10, myevent[currentevent].name)
            loadedImage.print(font, 50, 50, myevent[currentevent].session)
                .write(fileNameOut);
        })
        .catch(function (err) {
            console.error(err);
        });
}
