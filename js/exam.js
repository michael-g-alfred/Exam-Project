import { Question } from "./question.js";

const userFirstName = localStorage.getItem("Firstname");
const userLastName = localStorage.getItem("Lastname");

$(".userInfo").text(`${userFirstName} ${userLastName}`);

$("#logoutBtn").on("click", function () {
  window.location.replace("../index.html");
});

let questions = [];
let currentIndex = 0;
const markedQuestions = {};
const disabledMarks = {};

async function init() {
  try {
    let response = await fetch("../json/questions.json");
    let responseParsed = await response.json();
    let questionsResponse = shuffleArray(responseParsed);

    questions = questionsResponse.map(
      (q) => new Question(q.QId, q.question, q.answers)
    );

    startTimer();
    showQuestion(currentIndex);
    updateButtonStates();
    bindEvents();
  } catch (e) {
    console.log("Error fetching questions:", e);

    $(".errorImg").show();
    $(`.timerLoader`).hide();
    $(`#questionsContainer`).hide();
    $(`#questionsSeriesContainer`).hide();
    $(`#progressContainer`).hide();
    $(`.upperdock`).hide();
    $(`.markList_Title`).hide();
  }
}

function shuffleArray(array) {
  for (let current = array.length - 1; current > 0; current--) {
    let next = Math.floor(Math.random() * (current + 1));
    [array[current], array[next]] = [array[next], array[current]];
  }
  return array;
}

function showQuestion(index) {
  renderQuestionContent(index);

  updateQuestionsSeries();

  let questionHeader = document.querySelector(".questionContainer h1");
  let questionNumber = index + 1;
  if (markedQuestions[questionNumber]) {
    questionHeader.classList.add("mark");
  }
}

function renderQuestionContent(index) {
  let { QId, question, answers } = questions[index];

  let container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  let questionDiv = document.createElement("div");
  questionDiv.classList.add("questionContainer");

  let questionHeading = document.createElement("h1");
  questionHeading.textContent = `Q${index + 1}: ${question}`;

  questionDiv.appendChild(questionHeading);

  let answersContainer = document.createElement("div");
  answersContainer.classList.add("answersContainer");

  answers.forEach((answer, index) => {
    let answerId = `${QId}_ansOption${index + 1}`;

    let answerDiv = document.createElement("div");
    answerDiv.className = "answerContainer";

    let input = document.createElement("input");
    input.type = "radio";
    input.className = "answer";
    input.id = answerId;
    input.name = `ans_Q_${QId}`;
    input.value = index + 1;

    let savedAnswer = localStorage.getItem(`Question ${QId}`);
    if (savedAnswer === String(index + 1)) {
      input.checked = true;
    }

    let label = document.createElement("label");
    label.htmlFor = answerId;
    label.textContent = answer.text;

    answerDiv.appendChild(input);
    answerDiv.appendChild(label);
    answersContainer.appendChild(answerDiv);
  });

  questionDiv.appendChild(answersContainer);

  let markBtn = document.createElement("button");
  markBtn.className = "markBtn";
  markBtn.textContent = "mark";

  let questionNumber = index + 1;
  if (disabledMarks[questionNumber]) {
    markBtn.disabled = true;
    markBtn.textContent = "marked";
  }

  questionDiv.appendChild(markBtn);
  container.appendChild(questionDiv);
}

function handleAnswerClick(event) {
  let input = event.target;
  let selectedValue = input.value;
  let questionId = input.name.replace("ans_Q_", "");
  localStorage.setItem(`Question ${questionId}`, selectedValue);
}

function handleNextClick() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
    updateButtonStates();
  }
}

function handlePrevClick() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
    updateButtonStates();
  }
}

function updateButtonStates() {
  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled =
    currentIndex === questions.length - 1;
}

function handleQuestionNavClick(e) {
  const index = parseInt($(e.target).text()) - 1;
  currentIndex = index;
  showQuestion(currentIndex);
  updateButtonStates();
}

function handleMarkClick() {
  const $questionHeader = $(this).siblings("h1");
  $questionHeader.toggleClass("mark");

  const questionNumber = $questionHeader.text().match(/^Q(\d+):/)[1];
  markedQuestions[questionNumber] = $questionHeader.hasClass("mark");
  disabledMarks[questionNumber] = true;
  $(this).prop("disabled", true).text("marked");

  const $markEntry = $("<div>")
    .addClass("marked-summary")
    .attr("data-qid", questionNumber);
  $markEntry.append(
    $("<span>").text(`mrk-Q${questionNumber}`),
    $("<button>").addClass("unmarkBtn").text("unmark")
  );
  $(".markList_Content").append($markEntry);
}

function handleMarkedSummaryClick(e) {
  if ($(e.target).hasClass("unmarkBtn")) return;
  const questionNumber = $(this).attr("data-qid");
  const index = parseInt(questionNumber) - 1;
  currentIndex = index;
  showQuestion(currentIndex);
  updateButtonStates();
}

function handleUnmarkClick() {
  const $entry = $(this).closest(".marked-summary");
  const questionNumber = $entry.attr("data-qid");

  $entry.remove();

  markedQuestions[questionNumber] = false;
  disabledMarks[questionNumber] = false;

  const $currentHeader = $(".questionContainer h1");
  const currentNumber = $currentHeader.text().match(/^Q(\d+):/)[1];
  if (questionNumber === currentNumber) {
    $currentHeader.removeClass("mark");
    $(".markBtn").prop("disabled", false).text("mark");
  }
}

function updateQuestionsSeries() {
  const $seriesContainer = $(".questionsSeriesContainer_Content").empty();
  questions.forEach((el, index) => {
    const $btn = $("<button>", {
      text: index + 1,
      class: "questionNavBtn",
      disabled: index === currentIndex,
    }).toggleClass("active", index === currentIndex);

    $seriesContainer.append($btn);
  });
}

function startTimer() {
  let examTime = 30;
  let countdownTime = examTime * 60;
  const $timeLeft = $("#timeLeft");
  let timeLeft = parseInt(localStorage.getItem("timeLeft")) || countdownTime;

  const $slider = $(".timerSlider");

  const timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    $timeLeft.text(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );

    const percentagePassed = ((countdownTime - timeLeft) / countdownTime) * 100;
    $slider.css("width", `${percentagePassed}%`);
    if (percentagePassed >= 90) {
      $slider.css(
        "background-color",
        "color-mix(in oklab, #d92d20 70%, black)"
      );
      $("#timeLeft").css("color", "color-mix(in oklab, #d92d20 70%, black)");
    } else if (percentagePassed >= 70) {
      $slider.css(
        "background-color",
        "color-mix(in oklab, #facc15 70%, black)"
      );
      $("#timeLeft").css("color", "color-mix(in oklab, #facc15 70%, black)");
    }

    localStorage.setItem("timeLeft", timeLeft);
    timeLeft--;

    if (timeLeft < -1) {
      clearInterval(timer);
      localStorage.removeItem("timeLeft");
      calculateGrade();
      window.location.replace("../pages/timeoutPage.html");
    }
  }, 1000);
}

function handleSubmitClick() {
  calculateGrade();
  window.location.replace("../pages/resultPage.html");
}

function calculateGrade() {
  let correctCount = 0;
  let failedCount = 0;

  questions.forEach((q) => {
    let savedAnswer = localStorage.getItem(`Question ${q.QId}`);
    let correctIndex = q.answers.findIndex((a) => a.isCorrect);

    if (savedAnswer && parseInt(savedAnswer) === correctIndex + 1) {
      correctCount++;
    } else {
      failedCount++;
    }
  });

  let grade = (correctCount / questions.length) * 100;

  localStorage.setItem("correctAnswers", correctCount);
  localStorage.setItem("failedAnswers", failedCount);
  localStorage.setItem("gradePercentage", grade.toFixed(2));
}

function bindEvents() {
  $(document).on("click", ".answer", handleAnswerClick);

  $("#nextBtn").on("click", handleNextClick);

  $("#prevBtn").on("click", handlePrevClick);

  $(document).on("click", ".questionNavBtn", handleQuestionNavClick);

  $(document).on("click", ".markBtn", handleMarkClick);

  $(document).on("click", ".marked-summary", handleMarkedSummaryClick);

  $(document).on("click", ".markList_Title", function () {
    $(".markList_Content").stop(true, true).slideToggle(300, "swing");
  });

  $(document).on("click", ".questionsSeriesContainer_Title", function () {
    $(".questionsSeriesContainer_Content")
      .stop(true, true)
      .slideToggle(300, "swing");
  });

  $(document).on("click", ".unmarkBtn", handleUnmarkClick);

  $("#submitBtn").on("click", handleSubmitClick);
}

window.addEventListener("load", init);
