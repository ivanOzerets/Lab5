// script.js

const img = new Image(); // used to load image from <input> and draw to canvas


const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

var submit = document.querySelector("[type='submit']");
var reset = document.querySelector("[type='reset']");
var button = document.querySelector("[type='button']");
var select = document.getElementById('voice-selection');

var TopText = document.getElementById("text-top");
var BottomText = document.getElementById("text-bottom");

var volume = document.querySelector("[type='range']");
var volImage = document.getElementsByTagName('img')[0];


var synth = window.speechSynthesis;

var voices = [];

setTimeout(populateVoiceList, 100);

function populateVoiceList() {
  voices = synth.getVoices();
  select.remove(0);

  for(var i = 0; i < voices.length ; i++) {
    

    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    select.appendChild(option);
  }
}



var form = document.getElementById("generate-meme");


form.addEventListener('submit', ()=>{
  event.preventDefault();

  context.font = "40px Impact";
  context.fillStyle = "white";
  context.strokeStyle = "black";

  context.fillText(TopText.value, 50, 50 , canvas.width);
  context.fillText(BottomText.value, 50, canvas.height - 10 , canvas.width);

  context.strokeText(TopText.value, 50, 50 , canvas.width);
  context.strokeText(BottomText.value, 50, canvas.height - 10 , canvas.width);

  context.fill();
  context.stroke();

  toggleButtons();
});




button.addEventListener('click', ()=>{
  var utterThis = new SpeechSynthesisUtterance(TopText.value + " " + BottomText.value);
  var selectedOption = select.selectedOptions[0].getAttribute('data-name');

  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.volume = volume.value / 100;
  synth.speak(utterThis);

});


volume.addEventListener('change', () => {
  if (volume.value >= 67) {
    volImage.src = "icons/volume-level-3.svg";
  } else if (volume.value >= 34) {
    volImage.src = "icons/volume-level-2.svg";
  } else if (volume.value >= 1) {
    volImage.src = "icons/volume-level-1.svg";
  } else {
    volImage.src = "icons/volume-level-0.svg";
  }
})



reset.addEventListener('click', ()=>{
  context.clearRect(0, 0, canvas.width, canvas.height);

  image.value = "";

  toggleButtons();
})

function toggleButtons () {
  
  submit.disabled = !submit.disabled;
  reset.disabled = !reset.disabled;
  button.disabled = !button.disabled;
  select.disabled = !select.disabled;

}


var image = document.getElementById("image-input");

image.addEventListener('change', () => {
  img.src = URL.createObjectURL(image.files[0]);
});


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  var startX = dim.startX;
  var startY = dim.startY;
  var height = dim.height;
  var width = dim.width;

  context.drawImage(img, startX, startY, width, height);

  

  


  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});






/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
