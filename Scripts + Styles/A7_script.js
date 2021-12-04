"use strict";

// Turn theremin on
function thereminOn(oscillator,oscillator2) {
    oscillator.play();
    oscillator2.play();
}

// Control the theremin
function thereminControl(e, oscillator, oscillator2, semitone_choice, min_fr, max_fr, theremin) {
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x, y);

    let minFrequency = parseFloat(min_fr);
    let maxFrequency = parseFloat(max_fr);
    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + (x / theremin.clientWidth) * freqRange;
    let thereminFreq2 = thereminFreq;

    if(semitone_choice=="3"){
        thereminFreq2 = interval(thereminFreq,3);
    }else if (semitone_choice=="4"){
        thereminFreq2 = interval(thereminFreq,4);
    }else if (semitone_choice=="5"){
        thereminFreq2 = interval(thereminFreq,5);
    }else if (semitone_choice=="7"){
        thereminFreq2 = interval(thereminFreq,7);
    }

    let thereminVolume = 1.0 - (y / theremin.clientHeight);

    console.log("Frequency: ", thereminFreq);
    oscillator.frequency = thereminFreq;
    oscillator2.frequency = thereminFreq2;

    console.log("Volume: ", thereminVolume);
    oscillator.volume = thereminVolume;
    oscillator2.volume = thereminVolume;

    document.getElementById("frequency").innerHTML = "Frequency of current note: <strong>"+thereminFreq+"</strong>";
    document.getElementById("noteName").innerHTML = "Approximate Note Name of pitch (according to Western equal tempered 12-tone scale): <strong>"+noteFromFrequency(thereminFreq)+"</strong>";
}

// Turn theremin off
function thereminOff(oscillator, oscillator2) {
    oscillator.stop();
    oscillator2.stop();
}

function runAfterLoadingPage() {

    let oscillator_type = "";
    let semitone_choice = "";
    let minimum_fr = "";
    let maximum_fr = "";
    //?semitone_choice=maj_third&osc_type=sine&min_freq=220&max_freq=880

    let params = (new URL(document.location)).searchParams;
    if (params.has('semitone_choice')) {
        semitone_choice = params.get('semitone_choice');
    }
    if (params.has("osc_type")){
        oscillator_type = params.get('osc_type');
    }
    if (params.has("min_freq")){
        minimum_fr = params.get("min_freq");
    }else {
        minimum_fr = "220";
    }
    if (params.has("max_freq")){
        maximum_fr = params.get("max_freq");
    } else {
        maximum_fr = "880";
    }

    console.log(maximum_fr);
    console.log(minimum_fr);

    // Instantiate a sine wave with pizzicato.js
    const oscillator = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillator_type,
            frequency: 220
        }
    });

    const oscillator2 = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillator_type,
            frequency: 220
        }
    });

    // Get the theremin div from the html
    const theremin = document.getElementById("thereminZone");

    // Theremin plays when the mouse enters the theremin div
    theremin.addEventListener("mouseenter", function () {
        thereminOn(oscillator, oscillator2);
    });

    // Theremin is controlled while the mouse is inside the theremin div
    theremin.addEventListener("mousemove", function (e) {
        thereminControl(e, oscillator, oscillator2, semitone_choice, minimum_fr, maximum_fr, theremin);
    });

    // Theremin stops when the mouse leaves the theremin div
    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator, oscillator2);
    });
}

window.onload = runAfterLoadingPage;