const globals = {
  numPanel: document.querySelector(".select-nums"),
  options: document.querySelector("#select-options"),
  count: document.querySelector("#count"),
  viewSlip: document.querySelector(".view-slip"),
  emptySlip: document.querySelector(".empty"),
  cancel: document.querySelector(".cancel"),
  numArray: [],
  textArray: [],
  min: 0,
  selectedOption: document.querySelector("#select-options").value,
  results: document.querySelector(".results"),
  resultsNumbers: document.querySelectorAll(".pop"),
  add: document.querySelector("#add"),
  playButton: document.querySelector("#play"),
  slip: document.querySelector(".slip"),
  interval: null,
  numBalls: -1,
  currentNumbers: [],
  numberCounter: 0,
};

let finalArray = [];

globals.add.disabled = true;
globals.playButton.disabled = true;

globals.viewSlip.addEventListener("click", () => {
  globals.slip.style.display = "block";
});

globals.cancel.addEventListener("click", () => {
  globals.slip.style.display = "none";
});

const addNumbers = () => {
  for (let i = 1; i <= 49; i++) {
    const num = document.createElement("div");
    num.classList.add("nums");
    num.innerHTML = i;
    globals.numPanel.append(num);
    globals.numArray.push(i.toString());
  }

  globals.add.addEventListener("click", () => {
    addToSlip();
    globals.numberCounter++;
    globals.count.innerHTML = globals.numberCounter;
  });

  const addToSlip = () => {
    const row = document.createElement("div");
    const winOrLose = document.createElement("div");
    winOrLose.classList.add("win-or-lose");
    row.classList.add("row");

    for (let i = 0; i < globals.currentNumbers.length; i++) {
      const rowContent = document.createElement("div");
      rowContent.innerHTML = globals.currentNumbers[i];
      rowContent.classList.add("row-content");
      row.appendChild(rowContent);
    }

    row.appendChild(winOrLose);
    globals.slip.appendChild(row);
    globals.currentNumbers = [];
    const numbers = document.querySelectorAll(".nums");
    numbers.forEach((num) => {
      num.classList.remove("selected");
      globals.min = 0;
    });
    globals.add.disabled = true;
    globals.playButton.disabled = false;
  };
};

addNumbers();

globals.options.addEventListener("change", () => {
  globals.add.disabled = true;
  globals.currentNumbers = [];
  document.querySelectorAll(".nums").forEach((num) => {
    num.classList.remove("selected");
  });
  globals.min = 0;
  globals.selectedOption = globals.options.value;
});

const colorGenerator = () => {
  const r = Math.floor(Math.random() * 250);
  const g = Math.floor(Math.random() * 250);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r},${g},${b})`;
};

const randomizeNumbers = () => {
  let count = 0;

  while (count < 6) {
    const text = globals.numArray[Math.floor(Math.random() * globals.numArray.length)];
    if (!globals.textArray.includes(text)) {
      globals.textArray.push(text);
      count++;
    }
  }
  setTimeout(() => {
    createBall(globals.textArray);
  }, 100);
  return globals.textArray;
};

const createBall = (textArray) => {
  globals.numBalls++;

  if (globals.numBalls >= textArray.length) {
    globals.playButton.disabled = false;
    return;
  }
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colorGenerator();
  const ballInner = document.createElement("div");
  ballInner.classList.add("ball-inner");
  ballInner.innerHTML = textArray[globals.numBalls];

  setTimeout(() => {
    document.querySelectorAll(".row-content").forEach((content) => {
      if (content.innerHTML === ballInner.innerHTML) content.style.border = "4px solid green";
    });
  });

  ball.appendChild(ballInner);
  globals.results.appendChild(ball);

  setTimeout(() => {
    globals.resultsNumbers[globals.numBalls].innerHTML = textArray[globals.numBalls];
    globals.resultsNumbers[globals.numBalls].style.transform = "scale(1)";
    globals.resultsNumbers[globals.numBalls].style.borderRadius = "0%";
  }, 1200);

  let rollCount = 0;
  let rotate = 360;

  const play = () => {
    rollCount += 10;
    rotate -= 30;
    ball.style.top = "10px";
    ball.style.right = `${rollCount}px`;
    ball.style.transform = `rotate(${rotate}deg)`;
    const thresholds = [420, 350, 280, 210, 140, 70];

    for (let i = 0; i < thresholds.length; i++) {
      if (globals.numBalls === 4) {
        if (globals.interval !== null) {
          setTimeout(() => {
            finalArray = [...globals.textArray.sort()];
            const intervalArray = [1200, 1000, 800, 600, 400, 200];
            for (let i = 0; i < globals.resultsNumbers.length - 1; i++) {
              setTimeout(() => {
                globals.resultsNumbers[i].style.transform = "scale(0)";
              }, intervalArray[i]);
            }
          }, 4000);
          setTimeout(() => {
            const intervalArray = [200, 400, 600, 800, 1000, 1200];
            for (let i = 0; i < globals.resultsNumbers.length - 1; i++) {
              setTimeout(() => {
                globals.resultsNumbers[i].style.transform = "scale(1)";
              }, intervalArray[i]);
            }
          }, 7000);
        }
      }
      if (rollCount === thresholds[i] && globals.numBalls === i) {
        rollCount = 0;
        rotate = 360;
        clearInterval(globals.interval);
        createBall(globals.textArray);
        return;
      }
    }

    if (rollCount === 70 && globals.numBalls === 5) {
      rotate = 360;
      rollCount = 0;
      alert("yes");
      clearInterval(globals.interval);
      globals.playButton.disabled = false;
    }
  };

  setTimeout(() => {
    globals.interval = setInterval(play, 50);
  }, 1000);
};

globals.playButton.addEventListener("click", () => {
  globals.playButton.disabled = true;
  randomizeNumbers();
});

const finalResults = () => {
  const rowContent = document.querySelectorAll(".row-content");
  rowContent.forEach((content) => {
    if (content.innerHTML === textArray[count - 1]) {
      content.style.border = "4px solid";
      content.style.color = "green";
    } else {
      content.style.color = "rgb(255, 166, 166)";
      content.style.border = "4px solid";
    }
  });
};

const numbers = document.querySelectorAll(".nums");

numbers.forEach((num) => {
  num.addEventListener("click", () => {
    if (globals.min < parseInt(globals.selectedOption)) {
      num.classList.toggle("selected");
      if (num.classList.contains("selected")) {
        globals.min++;
        globals.currentNumbers.push(num.innerHTML);
      } else {
        globals.min--;
        num.classList.remove("selected");
        globals.currentNumbers.splice(globals.currentNumbers.indexOf(num.innerHTML), 1);
      }
    } else {
      if (num.classList.contains("selected")) {
        globals.min--;
        num.classList.remove("selected");
        globals.currentNumbers.splice(globals.currentNumbers.indexOf(num.innerHTML), 1);
      }
    }
    if (globals.min === parseInt(globals.selectedOption)) {
      globals.add.disabled = false;
    } else {
      globals.add.disabled = true;
    }
    console.log(globals.currentNumbers);
  });
});

setInterval(() => {
  if (globals.numberCounter === 0) {
    globals.emptySlip.style.display = "block";
  } else {
    globals.emptySlip.style.display = "none";
  }
}, 200);
