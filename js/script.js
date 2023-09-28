let round = 1; // current game round
let speed = 700; // flashing speed in ms
let speedFast = false; // fast mode status
let strict = false; // strict mode status
let colorsActive = false; // colored game button activation status
let playList = []; // generated sequence for the game
let userClicks = []; // user's sequence of button clicks
let currentIndex = 0; // index for iterating `playList`

// DOM elements for game status
const roundNumber = document.querySelector("#roundNumber");
const strictStatus = document.querySelector("#strictStatus");
const speedStatus = document.querySelector("#speedStatus");
const message = document.querySelector("h1");

// toggle speed and update display
const speedButton = document.querySelector("#speed");
speedButton.addEventListener("click", () => {
  speedFast = !speedFast;
  speed = speedFast ? 400 : 700; // toggle fast 400ms and slow 700ms
  speedStatus.innerText = speedFast ? "Fast" : "Slow";
});

// toggle strict mode and update display
const strictButton = document.querySelector("#strict");
strictButton.addEventListener("click", () => {
  strict = !strict;
  strictStatus.innerText = strict ? "On" : "Off";
});

// static and flashing colors for colored game buttons
const buttons = {
  red: { static: "#cc0606", flashing: "#ed8782" },
  green: { static: "#12990d", flashing: "#89ff94" },
  blue: { static: "#060b9b", flashing: "#89c9ff" },
  yellow: { static: "#cccc06", flashing: "#fbff89" },
};

// DOM elements for four colored game buttons
const red = document.querySelector("#red");
const green = document.querySelector("#green");
const blue = document.querySelector("#blue");
const yellow = document.querySelector("#yellow");

// flash a game button for 250ms
const flash = (button, color) => {
  // destructured `buttons` object data
  const { static: staticColor, flashing: flashingColor } = color;
  button.style.backgroundColor = flashingColor;
  setTimeout(() => {
    button.style.backgroundColor = staticColor; // return to static color after 250ms delay
  }, 250);
};

// reset game state
const reset = () => {
  colorsActive = false; // disable colored game buttons
  round = 1;
  roundNumber.innerText = "1";
  playList = [];
  currentIndex = 0;
  // enable strict, start, and speed buttons
  strictButton.disabled = false;
  startButton.disabled = false;
  speedButton.disabled = false;
  message.innerText = "Ready To Play!";
  message.style.display = "block";
};

// reset button functionality
document.querySelector("#reset").addEventListener("click", () => reset());

// generate a random number between 0 and 3 for the game sequence
// corresponds with `buttonRef` index number for color
const random = () => playList.push(Math.floor(Math.random() * 4));

// button references for function calls
const buttonRef = [
  [red, "red"],
  [green, "green"],
  [blue, "blue"],
  [yellow, "yellow"],
];

// execute current sequence recursively to maintain minimal call stack
const execute = () => {
  // base case: sequence end reached
  if (currentIndex === playList.length) {
    currentIndex = 0;
    setTimeout(() => {
      colorsActive = true; // activate game buttons after 700ms delay
    }, 700);
    return;
  }
  // destructure `buttonRef` data to get button element and color from `playList` index
  const [buttonElement, colorKey] = buttonRef[playList[currentIndex]];
  // flash current button based on sequence
  flash(buttonElement, buttons[colorKey]);
  currentIndex++;
  // recursive call for next flash in sequence
  setTimeout(() => {
    execute();
  }, speed);
};

// initialize game and each round
const init = () => {
  userClicks = []; // clear data for new round
  currentIndex = 0;
  random(); // add to sequence
  execute(); // flash current sequence
};

// start button functionality
const startButton = document.querySelector("#start");
startButton.addEventListener("click", (event) => {
  // disable start, strict and speed buttons
  event.currentTarget.disabled = true;
  strictButton.disabled = true;
  speedButton.disabled = true;
  message.style.display = "none";
  setTimeout(() => {
    init(); // initialize play after 500ms delay
  }, 500);
});

// move to next round
const nextRound = () => {
  round++; // increment round number
  roundNumber.innerText = round;
  setTimeout(() => {
    init(); // initialize next round of play after 1000ms delay
  }, 1000);
};

// replay current round when strict mode is disabled
const replayRound = () => {
  message.innerText = "Wrong, Try Again!";
  message.style.display = "block";
  setTimeout(() => {
    userClicks = []; // clear data
    message.style.display = "none";
    execute(); // replay round after 2000ms delay
  }, 2000);
};

// declare win condition
const win = () => {
  message.innerText = "YOU WIN!!!";
  message.style.display = "block";
  setTimeout(() => {
    reset(); // reset game after 2000ms delay
  }, 2000);
};

// declare loss condition
const lose = () => {
  message.innerText = "You Lose! Play Again!!";
  message.style.display = "block";
  setTimeout(() => {
    reset();
  }, 2000); // reset game after 2000ms delay
};

// compare user's sequence to generated sequence
const compare = () => {
  let correct = true;
  // iterate over generated sequence
  for (let i = 0; i < playList.length; i++) {
    if (userClicks[i] !== playList[i]) {
      correct = false;
      break; // break with first invalid entry
    }
  }
  // if user sequence matched generated sequence
  if (correct) {
    // if game reached 20 rounds declare win, else advance to next round
    playList.length === 20 ? win() : nextRound();
  } else {
    // if strict mode is active declare loss, else replay the round
    strict ? lose() : replayRound();
  }
};

// validate if user has completed sequence
const clickCheck = () => {
  // if user completed sequence, disable game buttons and compare sequences
  if (userClicks.length === playList.length) {
    colorsActive = false;
    compare();
  }
};

// game button functionality
// iterate over `buttonRef` array of button variables and colors
buttonRef.forEach((el, index) => {
  el[0].addEventListener("click", (event) => {
    if (colorsActive) {
      flash(event.currentTarget, buttons[el[1]]);
      userClicks.push(index);
      clickCheck(); // validate if user has finished click sequence
    }
  });
});
