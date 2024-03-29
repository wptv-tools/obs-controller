
const path = require('path')
const { openStreamDeck } = require('elgato-stream-deck')
const OBSWebSocket = require('obs-websocket-js')
const sharp = require('sharp')
var Jimp = require('jimp')
var fileName = 'test.png'
var fileNameOut = 'out.png'
const fs = require('fs')
const {number} = require('sharp/lib/is')
const { setServers } = require('dns')
const myStreamDeck = openStreamDeck()
const obs = new OBSWebSocket()
obs.connect({ address: 'localhost:4444', password: '12345678' })
var rec = 0
var myevent
var currentevent


fs.readFile('event.json', (err, data) => {
    if (err) throw err
    myevent = JSON.parse(data)
    currentevent = 0
})


obs.on( 'Heartbeat', data => {
    console.log( data )
})

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// Set Button with Image on Stream Deck
function SetStreamDeckButton(ButtonNo, ButtonImg) {
    sharp(path.resolve(__dirname + '/buttons', ButtonImg))
        .flatten() // Eliminate alpha channel, if any.
        .resize(myStreamDeck.ICON_SIZE, myStreamDeck.ICON_SIZE) // Scale up/down to the right size, cropping if necessary.
        .raw() // Give us uncompressed RGB.
        .toBuffer()
        .then(buffer => {
            myStreamDeck.fillImage(ButtonNo, buffer)
        })
        .catch(err => {
            console.error(err)
        })
}

function clean_buttons() {
    SetStreamDeckButton(6, 'sc_slides_speaker_off.png')
    SetStreamDeckButton(7, 'sc_speaker_slides_off.png')
    SetStreamDeckButton(10, 'sc_title_off.png')
    SetStreamDeckButton(11, 'sc_slides_off.png')
    SetStreamDeckButton(12, 'sc_speaker_off.png')
}


obs.on('SwitchScenes', data => {
    //console.log(data['scene-name'])
    clean_buttons()
    switch ( data['scene-name'] ) {
        case 'Speaker':
            SetStreamDeckButton(12, 'sc_speaker_on.png')
            break
        case 'Titel':
            SetStreamDeckButton(10, 'sc_title_on.png')
            break
        case 'Folien/Speaker':
            SetStreamDeckButton(6, 'sc_slides_speaker_on.png')
            break
        case 'Speaker/Folien':
            SetStreamDeckButton(7, 'sc_speaker_slides_on.png')
            break
        case 'Folien':
            SetStreamDeckButton(11, 'sc_slides_on.png')
            break
    }
})

obs.on('RecordingStopped', err => {
    SetStreamDeckButton(14, 'bt_recording_off.png')
    rec = 0
})

obs.on('RecordingStarted', err => {
    SetStreamDeckButton(14, 'bt_recording_on.png')
    rec = 1
})

myStreamDeck.on('down', keyIndex => {
    console.log('key %d down', keyIndex)

    if (keyIndex == 0 ) {
        if ( currentevent > 0 ) {
            currentevent--
        }
        if (currentevent == 0 ) {
            SetStreamDeckButton(0, 'speaker_prev_off.png')
        } else {
            SetStreamDeckButton(0, 'speaker_prev_on.png')
        }
        SetStreamDeckButton(1, 'speaker_next_on.png')

        Jimp.read(fileName)
            .then(function (image) {
                loadedImage = image
                return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
            })
            .then(function (font) {
                loadedImage.print(font, 10, 10, myevent[currentevent].name)
                loadedImage.print(font, 50, 50, myevent[currentevent].session)
                .write(fileNameOut)
            })
            .catch(function (err) {
                console.error(err)
            })

        obs.send('SetSourceSettings', {
            'sourceName': "Name",
            'sourceSettings': { 'text' : myevent[currentevent].name }
        })
        obs.send('SetSourceSettings', {
            'sourceName': "Session",
            'sourceSettings': { 'text' : myevent[currentevent].session }
        })

    }
    if (keyIndex == 1 ) {
        if ( currentevent < ( myevent.length -1) ) {
            currentevent++
        }
        if (currentevent == ( myevent.length -1) ) {
            SetStreamDeckButton(1, 'speaker_next_off.png')
        } else {
            SetStreamDeckButton(1, 'speaker_next_on.png')
        }
        SetStreamDeckButton(0, 'speaker_prev_on.png')

        Jimp.read(fileName)
            .then(function (image) {
                loadedImage = image
                return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
            })
            .then(function (font) {
                loadedImage.print(font, 10, 10, myevent[currentevent].name)
                loadedImage.print(font, 50, 50, myevent[currentevent].session)
                .write(fileNameOut)
            })
            .catch(function (err) {
                console.error(err)
            })

        obs.send('SetSourceSettings', {
            'sourceName': "Name",
            'sourceSettings': { 'text' : myevent[currentevent].name }
        })
        obs.send('SetSourceSettings', {
            'sourceName': "Session",
            'sourceSettings': { 'text' : myevent[currentevent].session }
        })

    }


    if (keyIndex == 6 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Folien/Speaker"
        })
        clean_buttons()
        SetStreamDeckButton(6, 'sc_slides_speaker_on.png')
    }

    if (keyIndex == 7 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Speaker/Folien"
        })
        clean_buttons()
        SetStreamDeckButton(7, 'sc_speaker_slides_on.png')
    }

    if (keyIndex == 10 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Titel"
        })
        clean_buttons()
        SetStreamDeckButton(10, 'sc_title_on.png')
    }
    if (keyIndex == 11 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Folien"
        })
        clean_buttons()
        SetStreamDeckButton(11, 'sc_slides_on.png')
    }

    if (keyIndex == 12 ) {
        obs.send('SetCurrentScene', {
            'scene-name': "Speaker"
        })
        clean_buttons()
        SetStreamDeckButton(12, 'sc_speaker_on.png')
    }

    if ( keyIndex == 14 ) {
        if ( rec == 0 ) {
            SetStreamDeckButton(14, 'bt_recording_on.png')
            obs.send('StartRecording')
        } else {
            SetStreamDeckButton(14, 'bt_recording_off.png')
            obs.send('StopRecording')
        }
    }
})

myStreamDeck.on('up', keyIndex => {
    console.log('key %d up', keyIndex)
})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('err    or', error => {
    console.error(error)
})


for ( i=0; i<15; i++ ) {
    myStreamDeck.fillColor(i, 0, 0, 0)
}

SetStreamDeckButton(14, 'bt_recording_off.png')
SetStreamDeckButton(3, 'beamer_slides_off.png')
SetStreamDeckButton(4, 'beamer_signage_off.png')
SetStreamDeckButton(0, 'speaker_prev_off.png')
SetStreamDeckButton(1, 'speaker_next_off.png')

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
    })
    obs.send('SetSourceSettings', {
        'sourceName': "Session",
        'sourceSettings': { 'text' : myevent[0].session  }
    })
    SetStreamDeckButton(10, 'sc_title_on.png')

    SetStreamDeckButton(1, 'speaker_next_on.png')

    Jimp.read(fileName)
        .then(function (image) {
            loadedImage = image
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
        })
        .then(function (font) {
            loadedImage.print(font, 10, 10, myevent[currentevent].name)
            loadedImage.print(font, 50, 50, myevent[currentevent].session)
                .write(fileNameOut)
        })
        .catch(function (err) {
            console.error(err)
        })
}
