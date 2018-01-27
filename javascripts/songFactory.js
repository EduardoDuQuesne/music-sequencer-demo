/*jshint esversion: 6 */

const $ = require('jquery');
let firebaseUrl = "https://terrible-techno.firebaseio.com";

module.exports.storeSettings = (songSettings) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://terrible-techno.firebaseio.com/settings.json`,   
            method: "POST",
            data: JSON.stringify(songSettings)
        }).done((data) => {
            resolve(data);
    
        }).fail((error) => {
            reject(error);
        });
    });
};