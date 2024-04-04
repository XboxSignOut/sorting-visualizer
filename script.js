const n = 50;
const array = [];

init();

let audioCtx = null;

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext)();
  }

  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  osc.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500);
  playNote(200 + array[j] * 500);

  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

function showBars(move) {
  container.innerHTML = " ";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 200 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}

function bubbleSortBtn() {
  const copy = [...array];
  const moves = bubbleSort(copy);
  animate(moves);
}

//Bubble Sort
function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({ indices: [i - 1, i], type: "comp" });
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: "swap" });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

function selectionSortBtn() {
  const copy = [...array];
  const moves = selectionSort(copy);
  animate(moves);
}

// Selection Sort
function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [i, j], type: "comp" });
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      moves.push({ indices: [i, minIndex], type: "swap" });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return moves;
}

function insertionSortBtn() {
  const copy = [...array];
  const moves = insertionSort(copy);
  animate(moves);
}

// Insertion Sort
function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    moves.push({ indices: [i, j], type: "comp" });
    while (j >= 0 && array[j] > key) {
      moves.push({ indices: [j + 1, j], type: "swap" });
      array[j + 1] = array[j];
      j = j - 1;
    }
    array[j + 1] = key;
  }
  return moves;
}
