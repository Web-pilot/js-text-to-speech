// navbar
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const textInput = document.getElementById("input");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
const pauseBtn = document.getElementById("pause-btn");
const statusText = document.getElementById("tts-status");
const voiceSelect = document.getElementById("voice-select");
const speedRange = document.getElementById("speed-range");
const speedValue = document.getElementById("speed-value");

let voices = [];
let utterance = new SpeechSynthesisUtterance();
utterance.onend = () => updateStatus("Finished");
utterance.onerror = () => updateStatus("Error");

// update status
function updateStatus(message) {
  statusText.textContent = message;
}

//Load the available voices
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;

    option.textContent = voice.name + " (" + voice.lang + ")";
    voiceSelect.appendChild(option);
  });

  // Set default voice
  if (voices.length > 0) {
    utterance.voice = voices[0];
  }
}

speechSynthesis.onvoiceschanged = loadVoices;

// Speak button function
speakBtn.addEventListener("click", () => {
  const text = textInput.value.trim();

  console.log(text);

  if (text === "") {
    updateStatus("Please enter some text.");
    return;
  }

  // Cancel any existing speech
  speechSynthesis.cancel();

  utterance.text = text;
  utterance.rate = parseFloat(speedRange.value);

  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;

  updateStatus("Speaking…");
  speechSynthesis.speak(utterance);
});

// Pause button function
pauseBtn.addEventListener("click", () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    updateStatus("Paused");
    pauseBtn.textContent = "Resume";
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume();
    updateStatus("Speaking…");
    pauseBtn.textContent = "Pause";
  }
});

// Stop button function
stopBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
  updateStatus("Stopped");
});

// update the slider with the voice range
speedRange.addEventListener("input", () => {
  if ((speedRange.value == 1)) {
    utterance.rate = speedRange.value;
    speedValue.textContent = speedRange.value + ".0x";
  } else {
    utterance.rate = speedRange.value;
    speedValue.textContent = speedRange.value + "x";
  }
});
