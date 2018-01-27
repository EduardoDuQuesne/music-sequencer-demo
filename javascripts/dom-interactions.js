/*jshint esversion: 6 */

const $ = require('jquery');
const interface = require('./interfaces');
const fx = require('./tone-fx');
const firebase = require("./config/fbConfig");
const auth = require('./userFactory');
const store = require('./songFactory');
const Nexus = require('nexusui');
const Tone = require('tone');
const loops = require('./loops');

Nexus.context = Tone.context;
Tone.Transport.start();
// interface.spectogram.connect(Tone.Master);

///// EVENT LISTENERS /////
//Authorization//
interface.logIn.on("click", function () {
    auth.logIn()
        .then(result => {})
        .catch(error => {
            console.log('Error: ', error);
        });
});
interface.logOut.on("click", function () {
    auth.logOut()
        .then(result => {});
});
firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user);
    if (user) {
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
interface.tempoKnob.on("change", function () {
    Tone.Transport.bpm.value = interface.tempoKnob.value;
});

///// Start and Stop /////
$('#play').on("click", () => {
    loops.chordLoop.start();
});
$('#stop').on("click", () => {
    loops.arpLoop.stop();
    loops.chordLoop.stop();
    loops.bassLoop.stop();
    loops.drumLoop.stop();
});

//User Settings//
interface.storeBtn.on("click", function () {
    let settings = storeSettings();
    store.storeSettings(settings);
});

//Set class to play on all 'Iman' chords on startup//
$(document).ready(function () {
    loops.loadChords();
});

/////Reassign Chords Array on Grid/////
$('p.chord').on('click', function () {
    let target = $(this);
    loops.changeChords(target);
});

//DELAY//
interface.dialDelayWet.on('change', function () {
    fx.delayOne.wet.value = interface.dialDelayWet.value;

});
interface.dialDelayFeedback.on('change', function () {
    fx.delayOne.feedback.value = interface.dialDelayFeedback.value;

});
interface.dialDelayTime.on('change', function () {
    fx.delayOne.delayTime.value = interface.dialDelayTime.value;
});

//Phaser// 
interface.dialPhaserWet.on('change', function () {
    fx.phaserOne.wet.value = interface.dialPhaserWet.value;

});
interface.dialPhaserOctaves.on('change', function () {
    fx.phaserOne.octaves = interface.dialPhaserOctaves.value;
});
interface.dialPhaserFrequency.on('change', function () {
    fx.phaserOne.frequency.value = interface.dialPhaserFrequency.value;
});
//Select Button Listeners//
interface.selectFx.on('change', function (select) {
    $(`.show-${select.value}`).show();
    $(`.show-${select.value}`).siblings().hide();
});
interface.selectSeq.on('change', function (select) {
    $(`#${select.value}`).show();
    $(`#${select.value}`).siblings().hide();
});

//VOL AND PAN//
interface.arpVolPanKnob.on('change', function () {
    fx.arpVolPan.volume.input.value = interface.arpVolPanKnob.y;
    fx.arpVolPan.pan.value = interface.arpVolPanKnob.x;
});
interface.bassVolPanKnob.on('change', function () {
    fx.bassVolPan.volume.input.value = interface.bassVolPanKnob.y;
    fx.bassVolPan.pan.value = interface.bassVolPanKnob.x;
});
interface.beatVolPanKnob.on('change', function () {
    fx.beatVolPan.volume.input.value = interface.beatVolPanKnob.y;
    fx.beatVolPan.pan.value = interface.beatVolPanKnob.x;
});