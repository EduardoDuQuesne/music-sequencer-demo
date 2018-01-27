/*jshint esversion: 6 */

const $ = require('jquery');
const Nexus = require('nexusui');
const Tone = require('tone');
const store = require('./songFactory');
const firebase = require("./config/fbConfig");
const auth = require('./userFactory');

/////Master Transport/////
Nexus.context = Tone.context;
Tone.Transport.start();

//// INST and FX Sounds////
let delayOne = new Tone.FeedbackDelay();
delayOne.wet.value = 0;

let phaserOne = new Tone.Phaser();
phaserOne.wet.value = 0;

let arpVolPan = new Tone.PanVol();
let bassVolPan = new Tone.PanVol();
let beatVolPan = new Tone.PanVol();

/////Log In and Out/////
let logIn = new Nexus.TextButton('#login-btn' ,{
    'size': [150,50],
    'state': false,
    'text': 'Log In',
    'alternate': false
});
let logOut = new Nexus.TextButton('#logout-btn' ,{
    'size': [150,50],
    'state': false,
    'text': 'Log Out',
    'alternate': false
});

/////User Settings////
let storeBtn = new Nexus.TextButton('#store-btn' ,{
    'size': [150,50],
    'state': false,
    'text': 'Store Song',
    'alternate': false
});

/////Tempo Interface/////
let tempoKnob = new Nexus.Number('#tempo', {
    'size': [70, 50],
    'value': 120,
    'min': 60,
    'max': 180,
    'step': 1
});

/////Sequencer Interfaces/////
let sequencer = new Nexus.Sequencer('#sequencer', {
    'size': [800, 200],
    'mode': 'toggle',
    'rows': 4,
    'columns': 16,
});
let bassSequencer = new Nexus.Sequencer('#bass-sequencer', {
    'size': [800, 200],
    'mode': 'toggle',
    'rows': 4,
    'columns': 16,
});
let beatSequencer = new Nexus.Sequencer('#beat-sequencer', {
    'size': [800, 200],
    'mode': 'toggle',
    'rows': 4,
    'columns': 16,
});
/////Stop and Start Interface/////
let playButton = new Nexus.TextButton('#play', {
    'size': [150, 50],
    'state': false,
    'text': 'Play',
    'alternate': false
});
let stopButton = new Nexus.TextButton('#stop', {
    'size': [150, 50],
    'state': false,
    'text': 'Stop',
    'alternate': false
});
/////Select Interfaces
let selectFx = new Nexus.Select('#one-fx-select', {
    'size': [75, 25],
    'options': ['Default', 'Delay', 'Phaser']
});

let selectSeq = new Nexus.Select('#select-sequencer', {
    'size': [75, 25],
    'options': ['Arpeggiator', 'Bass', 'Rhythm']
});
/////Delay Interface/////
let dialDelayWet = new Nexus.Dial('#delay-wet', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
});
let dialDelayFeedback = new Nexus.Dial('#delay-feedback', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
});
let dialDelayTime = new Nexus.Dial('#delay-time', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
});
/////Phaser Interface/////
let dialPhaserWet = new Nexus.Dial('#phaser-wet', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
});
let dialPhaserOctaves = new Nexus.Dial('#phaser-octaves', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 1,
    'max': 5,
    'step': 0,
    'value': 0
});
let dialPhaserFrequency = new Nexus.Dial('#phaser-frequency', {
    'size': [25, 25],
    'interaction': 'radial',
    'mode': 'relative',
    'min': 0,
    'max': 1,
    'step': 0,
    'value': 0
});

///// VOLUME/PAN AXIS INTERFACE /////
let arpVolPanKnob = new Nexus.Position('#arp-volpan', {
    'size': [200, 198],
    'mode': 'absolute',
    'x': 0.5,
    'minX': 0,
    'maxX': 1,
    'stepX': 0,
    'y': 0.5,
    'minY': 0,
    'maxY': 1,
    'stepY': 0
});

let bassVolPanKnob = new Nexus.Position('#bass-volpan', {
    'size': [200, 198],
    'mode': 'absolute',
    'x': 0.5,
    'minX': 0,
    'maxX': 1,
    'stepX': 0,
    'y': 0.5,
    'minY': 0,
    'maxY': 1,
    'stepY': 0
});

let beatVolPanKnob = new Nexus.Position('#beat-volpan', {
    'size': [200, 198],
    'mode': 'absolute',
    'x': 0.5,
    'minX': 0,
    'maxX': 1,
    'stepX': 0,
    'y': 0.5,
    'minY': 0,
    'maxY': 1,
    'stepY': 0
});


///// Arpeggiator One /////
//Sounds to be replaced later//
let notes = new Tone.Players({
    "A": "../audio/A1.[mp3|ogg]",
    "A#": "../audio/As1.[mp3|ogg]",
    "B": "../audio/B1.[mp3|ogg]",
    "C": "../audio/C2.[mp3|ogg]",
    "C#": "../audio/Cs2.[mp3|ogg]",
    "D": "../audio/D2.[mp3|ogg]",
    "D#": "../audio/Ds2.[mp3|ogg]",
    "E": "../audio/E2.[mp3|ogg]",
    "F": "../audio/F2.[mp3|ogg]",
    "F#": "../audio/Fs2.[mp3|ogg]",
    "G": "../audio/G2.[mp3|ogg]",
    "G#": "../audio/Gs1.[mp3|ogg]"
}, {
        "volume": -10,
        "fadeOut": "64n"
    }).chain(arpVolPan, delayOne, phaserOne, Tone.Master);

///// Arpeggiator One ////
//Note Names Arrays//
let noteNames = {
    Imaj: ["A", "C#", "E", "G#"],
    // ASmin: ["A#", "C#", "F", "G#"],
    iimin: ["B", "D", "F#", "A"],
    // Cmaj: ["C", "E", "G", "B"],
    iiimin: ["C#", "E", "G#", "B"],
    IVmaj: ["D", "F#", "A", "C#"],
    // DSmin: ["D#", "F#", "A#", "C#"],
    Vdom: ["E", "G#", "B", "D"],
    // Fmaj: ["F", "G#", "C", "D#"],
    vimin: ["F#", "A", "C#", "E"],
    // Gmaj: ["G", "A#", "C#", "F"],
    viiminb5: ["G#", "B", "D", "F"]
};
let seqKey = [];
let arpKeys = [];
let step = [];
let arpLoop = new Tone.Sequence((time, col) => {
    step = [];
    for (let i = 0; i < 4; i++) {
        step.push(sequencer.matrix.pattern[i][col]);
    }
    for (let i = 0; i < 4; i++) {
        if (step[i] === true) {
            notes.get(seqKey[i]).start(time, 0, "32n", 0);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

///// BASS LOOP /////
//Sounds and notes//
let notes2 = new Tone.Players({
    "A": "../audio/A1.[mp3|ogg]",
    "A#": "../audio/As1.[mp3|ogg]",
    "B": "../audio/B1.[mp3|ogg]",
    "C": "../audio/C2.[mp3|ogg]",
    "C#": "../audio/Cs2.[mp3|ogg]",
    "D": "../audio/D2.[mp3|ogg]",
    "D#": "../audio/Ds2.[mp3|ogg]",
    "E": "../audio/E2.[mp3|ogg]",
    "F": "../audio/F2.[mp3|ogg]",
    "F#": "../audio/Fs2.[mp3|ogg]",
    "G": "../audio/G2.[mp3|ogg]",
    "G#": "../audio/Gs1.[mp3|ogg]"
}, {
        "volume": -10,
        "fadeOut": "64n"
    }).chain(bassVolPan, Tone.Master);

let bassLoop = new Tone.Sequence((time, col) => {
    step = [];
    for (let i = 0; i < 4; i++) {
        step.push(bassSequencer.matrix.pattern[i][col]);
    }
    for (let i = 0; i < 4; i++) {
        if (step[i] === true) {
            notes2.get(seqKey[i]).start(time, 0, "32n", 0);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

///// DRUM LOOP /////
//Sounds//
let drums = new Tone.Players({
    "kick": "../audio/drums/kick-vinyl02.wav",
    "snare": "../audio/drums/snare-vinyl01.wav",
    "clap": "../audio/drums/clap-808.wav",
    "hihat": "../audio/drums/hihat-acoustic01.wav"
}, {
        "volume": -10,
        "fadeOut": "64n"
    }).chain(beatVolPan, Tone.Master);
//Beat Loop//
let step2 = [];
let beatName = ["kick", "snare", "clap", "hihat"];
let drumLoop = new Tone.Sequence((time, col) => {
    step2 = [];
    for (let i = 0; i < 4; i++) {
        step2.push(beatSequencer.matrix.pattern[i][col]);
    }
    for (let i = 0; i < 4; i++) {
        if (step2[i] === true) {
            drums.get(beatName[i]).start(time, 0, "32n", 0);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

///// MASTER CHORD LOOP /////
let chordLoop = new Tone.Sequence((time, col) => {
    arpLoop.start();
    bassLoop.start();
    drumLoop.start();
    seqKey = noteNames[arpKeys[col]];
    $(`.chord-${col}`).addClass('border');
    $(`.chord-${col}`).siblings().removeClass('border');

}, [0, 1, 2, 3, 4, 5, 6, 7], "1n");

///// Start and Stop /////
$('#play').on("click", () => {
    chordLoop.start();
});
$('#stop').on("click", () => {
    arpLoop.stop();
    chordLoop.stop();
    bassLoop.stop();
    drumLoop.stop();
});

///// EVENT LISTENERS /////
//Authorization//
logIn.on("click", function() {
    auth.logIn()
    .then(result => {
    })
    .catch(error => {
        console.log('Error: ', error );
    });
});
logOut.on("click", function() {
    auth.logOut()
    .then(result => {
    });
});
firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user );
    if (user ) {
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#store-btn").show();
    } else {
        $("#login-btn").show();
        $("#logout-btn").hide();
        $("#store-btn").hide();
    }
  });



//tempo//
tempoKnob.on("change", function () {
    Tone.Transport.bpm.value = tempoKnob.value;
});
//Set class to play on all 'Iman' chords on startup//
$(document).ready(function () {
    arpKeys = [];
    for (let i = 0; i < 8; i++) {
        let div = $(`.chord-${i}`);
        arpKeys.push($(`.chord-${i}`).children().filter('.play').attr('value'));
    }
});
/////Reassign Chords Array on Grid/////
$('p.chord').on('click', function () {
    arpKeys = [];
    $(this).siblings().removeClass('play');
    $(this).addClass('play');
    for (let i = 0; i < 8; i++) {
        let div = $(`.chord-${i}`);
        arpKeys.push($(`.chord-${i}`).children().filter('.play').attr('value'));
    }
});
//DELAY//
dialDelayWet.on('change', function () {
    delayOne.wet.value = dialDelayWet.value;

});
dialDelayFeedback.on('change', function () {
    delayOne.feedback.value = dialDelayFeedback.value;

});
dialDelayTime.on('change', function () {
    delayOne.delayTime.value = dialDelayTime.value;
});

//Phaser// 
dialPhaserWet.on('change', function () {
    phaserOne.wet.value = dialPhaserWet.value;

});
dialPhaserOctaves.on('change', function () {
    phaserOne.octaves = dialPhaserOctaves.value;
});
dialPhaserFrequency.on('change', function () {
    phaserOne.frequency.value = dialPhaserFrequency.value;
});
//Select Button Listeners//
selectFx.on('change', function (select) {
    $(`.show-${select.value}`).show();
    $(`.show-${select.value}`).siblings().hide();
});
selectSeq.on('change', function (select) {
    $(`#${select.value}`).show();
    $(`#${select.value}`).siblings().hide();
});

//VOL AND PAN//
arpVolPanKnob.on('change', function () {
    arpVolPan.volume.input.value = arpVolPanKnob.y;
    arpVolPan.pan.value = arpVolPanKnob.x;
});
bassVolPanKnob.on('change', function () {
    bassVolPan.volume.input.value = bassVolPanKnob.y;
    bassVolPan.pan.value = bassVolPanKnob.x;
});
beatVolPanKnob.on('change', function () {
    beatVolPan.volume.input.value = beatVolPanKnob.y;
    beatVolPan.pan.value = beatVolPanKnob.x;
});

//// Visual Spectogram ////
let spectogram = new Nexus.Spectrogram('#spectogram', {
    'size': [100, 50]
});
spectogram.connect(Tone.Master);


let storeSettings = () => {
    let settings = {
    uid: firebase.auth().currentUser.uid,
    tempo: Tone.Transport.bpm.value,
    tempoDisplay: tempoKnob.value,
    arpMatrix: sequencer.matrix.pattern,
    arpPan: arpVolPan.pan.value,
    arpPanDisplay: arpVolPanKnob.x,
    arpVol: arpVolPan.volume.input.value,
    arpVolDisplay: arpVolPanKnob.y,
    bassMatrix: bassSequencer.matrix.pattern,
    bassPan: bassVolPan.pan.value,
    bassPanDisplay: bassVolPanKnob.x,
    bassVol: bassVolPan.volume.input.value,
    bassVolDisplay: bassVolPanKnob.y,  
    beatMatrix: beatSequencer.matrix.pattern,
    beatPan: beatVolPan.pan.value,
    beatPanDisplay: beatVolPanKnob.x,
    beatVol: beatVolPan.volume.input.value,
    beatVolDisplay: beatVolPanKnob.y,  
    delayOneWet: delayOne.wet.value, 
    delayOneDisplay: dialDelayWet.value,
    delayOneFB: delayOne.feedback.value,
    delayOneTime: delayOne.delayTime.value,
    delayOneTimeDisplay: dialDelayTime.value,
    delayOneFBDisplay: dialDelayFeedback.value
    };
    return settings;
};

//User Settings//
storeBtn.on("click", function() {
    let settings = storeSettings();
    store.storeSettings(settings);
 });