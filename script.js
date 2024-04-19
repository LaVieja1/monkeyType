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

      return `<word>
			${letters.map((letter) => `<letter>${letter}</letter>`).join("")}
		</word>
		`;
    })
    .join("");

  const $firstWord = $paragraph.querySelector("word");
  $firstWord.classList.add("active");
  $firstWord.querySelector("letter").classList.add("active");

  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime === 0) {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function initEvents() {
  document.addEventListener("keydown", () => {
    $input.focus();
  });
  $input.addEventListener("keydown", onKeyDown);
  $input.addEventListener("keyup", onKeyUp);
}

function onKeyDown(event) {
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $currentWord.querySelector("letter.active");

  const { key } = event;
  if (key === " ") {
    event.preventDefault();

    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector("letter");

    $currentWord.classList.remove("active", "marked");
    $currentLetter.classList.remove("active");

    $nextWord.classList.add("active");
    $nextLetter.classList.add("active");

    $input.value = "";

    const hasMissedLetters =
      $currentWord.querySelectorAll("letter:not(.correct)").length > 0;

    const classToAdd = hasMissedLetters ? "marked" : "correct";
    $currentWord.classList.add(classToAdd);
    return;
  }

  if (key === "Backspace") {
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if (!$prevWord && !$prevLetter) {
      event.preventDefault();
      return;
    }

    const $wordMarked = $paragraph.querySelector("word.marked");

    if ($wordMarked && !$prevLetter) {
      event.preventDefault();
      $prevWord.classList.remove("marked");
      $prevWord.classList.add("active");

      const $letterToGo = $prevWord.querySelector("letter:last-child");

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");

      $input.value = [
        ...$prevWord.querySelectorAll("letter.correct, letter.incorrect"),
      ]
        .map(($el) => {
          return $el.classList.contains("correct") ? $el.innerText : "*";
        })
        .join("");
    }
  }
}

function onKeyUp() {
  // recuperamos los elementos actuales
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $currentWord.querySelector("letter.active");

  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;
  console.log({ value: $input.value, currentWord });

  const $allLetters = $currentWord.querySelectorAll("letter");

  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );

  $input.value.split("").forEach((char, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterClass);
  });

  $currentLetter.classList.remove("active", "is-last");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active", "is-last");
    // TODO: gameover si no hay proxima palabra
  }
}

function gameOver() {
  console.log("game over");
}
