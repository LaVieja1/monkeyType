$time = document.querySelector("time");
$paragraph = document.querySelector("p");
$input = document.querySelector("input");

const INITIAL_TIME = 30;

const TEXT =
  "the quick brown fox jumps over the lazy dog and the lazy dog jumps over the quick brown fox";

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
  words = TEXT.split(" ").slice(0, 32);
  currentTime = INITIAL_TIME;

  $time.textContent = currentTime;

  $paragraph.innerHTML = words
    .map((word, index) => {
      const letters = word.split("");

      return `<x-word>
			${letters.map((letter) => `<x-letter>${letter}</x-letter>`).join("")}
		</x-word>
		`;
    })
    .join("");

  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime === 0) {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function initEvents() {}

function gameOver() {
  console.log("game over");
}
