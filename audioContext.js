//Creates instance of audio context
const audioContext = new AudioContext();
const audioElement = document.querySelector('audio');
//Connects audio context with the DOM 'audio' element
const track = audioContext.createMediaElementSource(audioElement);

function audioNodes() {
  //Gain node
  const gainNode = audioContext.createGain();
  const volumeControl = document.querySelector('#volume');

  volumeControl.addEventListener(
    'input',
    function() {
      gainNode.gain.value = this.value;
    },
    false
  );

  //Low pass filter node
  const lowPass = new BiquadFilterNode(audioContext, {
    frequency: 22050
  });
  const lowPassControl = document.querySelector('#lowpass');

  lowPassControl.addEventListener(
    'input',
    function() {
      lowPass.frequency.value = this.value;
    },
    false
  );

  //highPass filter node
  const highPass = new BiquadFilterNode(audioContext, {
    type: 'highpass',
    frequency: 0
  });
  const highPassControl = document.querySelector('#highpass');

  highPassControl.addEventListener(
    'input',
    function() {
      highPass.frequency.value = this.value;
    },
    true
  );

  //Connect all nodes together
  track
    .connect(gainNode)
    .connect(lowPass)
    .connect(highPass)
    .connect(audioContext.destination);
}

audioNodes();

//Play Button
function playButton() {
  const playButton = document.querySelector('button');

  playButton.addEventListener(
    'click',
    function() {
      //Checking if context is in suspended state (Autoplay Policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      //Play or pause track depending on state
      if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
      } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
      }
    },
    false
  );

  //Safeguard to change button state to false when track is over
  audioElement.addEventListener(
    'ended',
    () => {
      playButton.dataset.playing = 'false';
    },
    false
  );
}

playButton();
