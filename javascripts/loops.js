/*jshint esversion: 6 */

const $ = require('jquery');
const Tone = require('tone');
const interface = require('./interfaces');
const fx = require('./tone-fx');

/////Load Chords On Page Load
let arpKeys = [];
let loadChords = () => {
    arpKeys = [];
    for (let i = 0; i < 8; i++) {
        let div = $(`.chord-${i}`);
        arpKeys.push($(`.chord-${i}`).children().filter('.play').attr('value'));
    }
};
/////Change Chords On Click/////
let changeChords = (target) => {
    arpKeys = [];
    target.siblings().removeClass('play');
    target.addClass('play');
    for (let i = 0; i < 8; i++) {
        let div = $(`.chord-${i}`);
        arpKeys.push($(`.chord-${i}`).children().filter('.play').attr('value'));
    }
};


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
}).chain(fx.arpVolPan, fx.delayOne, fx.phaserOne, Tone.Master);

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
let step = [];
let arpLoop = new Tone.Sequence((time, col) => {
    step = [];
    for (let i = 0; i < 4; i++) {
        step.push(interface.sequencer.matrix.pattern[i][col]);
        console.log('LOOP1: ', interface.sequencer.matrix.pattern[i][col]);
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
}).chain(fx.bassVolPan, Tone.Master);

let bassLoop = new Tone.Sequence((time, col) => {
    step = [];
    for (let i = 0; i < 4; i++) {
        step.push(interface.bassSequencer.matrix.pattern[i][col]);
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
}).chain(fx.beatVolPan, Tone.Master);
//Beat Loop//
let step2 = [];
let beatName = ["kick", "snare", "clap", "hihat"];
let drumLoop = new Tone.Sequence((time, col) => {
    step2 = [];
    for (let i = 0; i < 4; i++) {
        step2.push(interface.beatSequencer.matrix.pattern[i][col]);
    }
    for (let i = 0; i < 4; i++) {
        if (step2[i] === true) {
            drums.get(beatName[i]).start(time, 0, "32n", 0);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

///// MASTER CHORD LOOP /////
let chordLoop = new Tone.Sequence((time, col) => {
    console.log('Check: ', col);
    arpLoop.start();
    bassLoop.start();
    drumLoop.start();
    seqKey = noteNames[arpKeys[col]];
    $(`.chord-${col}`).addClass('border');
    $(`.chord-${col}`).siblings().removeClass('border');

}, [0, 1, 2, 3, 4, 5, 6, 7], "1n");

module.exports = {
    arpKeys,
    arpLoop,
    bassLoop,
    drumLoop,
    chordLoop,
    changeChords,
    loadChords
};