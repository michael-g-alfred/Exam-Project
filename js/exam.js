import { Question } from "./question.js";

const userFirstName = localStorage.getItem("Firstname");
const userLastName = localStorage.getItem("Lastname");

$(".userInfo").text(`${userFirstName} ${userLastName}`);

$("#logoutBtn").on("click", function () {
  window.location.replace("../index.html");
});

let currentIndex = 0;
let questions = [];
const markedQuestions = {};
const disabledMarks = {};
let countdownTime = eval(30 * 60);
const $timeLeft = $("#timeLeft");
let timeLeft = parseInt(localStorage.getItem("timeLeft")) || countdownTime;

//////////////////
async function init() {
  try {
    const response = await fetch("../json/questions.json");
    const dataParsing = await response.json();
    const questionsResponse = shuffleArray(dataParsing);

    questions = questionsResponse.map(
      (q) => new Question(q.QId, q.question, q.answers)
    );

    startTimer();
    showQuestion(currentIndex);
    updateButtonStates();
    bindEvents();
  } catch (e) {
    console.error("Error loading questions:", e);

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
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderQuestionContent(index) {
  const { QId, question, answers } = questions[index];
  const $container = $("#questionsContainer").empty();

  const $questionDiv = $("<div>").addClass("questionContainer");
  $questionDiv.append($("<h2>").text(`Q${index + 1}: ${question}`));

  const $answersContainer = $("<div>").addClass("answersContainer");

  answers.forEach((answer, i) => {
    const answerId = `${QId}_ansOption${i + 1}`;
    const $input = $("<input>", {
      type: "radio",
      class: "answer",
      id: answerId,
      name: `ans_Q_${QId}`,
      value: i + 1,
    });

    const savedAnswer = localStorage.getItem(`Question ${QId}`);
    if (savedAnswer === String(i + 1)) {
      $input.prop("checked", true);
    }

    const $label = $("<label>", {
      for: answerId,
      text: answer.text,
    });

    const $answerDiv = $("<div>").addClass("answerContainer");
    $answerDiv.append($input, $label);
    $answersContainer.append($answerDiv);
  });

  $questionDiv.append($answersContainer);

  const $markBtn = $("<button>").addClass("markBtn").text("mark");
  const questionNumber = index + 1;

  if (disabledMarks[questionNumber]) {
    $markBtn.prop("disabled", true).text("marked");
  }

  $questionDiv.append($markBtn);
  $container.append($questionDiv);
}

function showQuestion(index) {
  renderQuestionContent(index);

  updateQuestionsSeries();

  const $questionHeader = $(".questionContainer h2");
  const questionNumber = index + 1;
  if (markedQuestions[questionNumber]) {
    $questionHeader.addClass("mark");
  }
}

function startTimer() {
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

function handleAnswerClick(e) {
  const $input = $(e.target);
  console.log($input);
  const questionId = $input.attr("name").replace("ans_Q_", "");
  const selectedValue = $input.val();
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

function handleQuestionNavClick(e) {
  const index = parseInt($(e.target).text()) - 1;
  currentIndex = index;
  showQuestion(currentIndex);
  updateButtonStates();
}

function handleMarkClick() {
  const $questionHeader = $(this).siblings("h2");
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

  const $currentHeader = $(".questionContainer h2");
  const currentNumber = $currentHeader.text().match(/^Q(\d+):/)[1];
  if (questionNumber === currentNumber) {
    $currentHeader.removeClass("mark");
    $(".markBtn").prop("disabled", false).text("mark");
  }
}

function handleSubmitClick() {
  calculateGrade();
  window.location.replace("../pages/resultPage.html");
}

function bindEvents() {
  $(document).on("click", ".answer", handleAnswerClick);

  $("#nextBtn").on("click", handleNextClick);

  $("#prevBtn").on("click", handlePrevClick);

  $(document).on("click", ".questionNavBtn", handleQuestionNavClick);

  $(document).on("click", ".markBtn", handleMarkClick);

  $(document).on("click", ".marked-summary", handleMarkedSummaryClick);

  $(document).on("click", ".markList_Title", function () {
    $(".markList_Content").slideToggle();
  });

  $(document).on("click", ".questionsSeriesContainer_Title", function () {
    $(".questionsSeriesContainer_Content").slideToggle();
  });

  $(document).on("click", ".unmarkBtn", handleUnmarkClick);

  $("#submitBtn").on("click", handleSubmitClick);
}

function updateButtonStates() {
  $("#prevBtn").prop("disabled", currentIndex === 0);
  $("#nextBtn").prop("disabled", currentIndex === questions.length - 1);
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

function calculateGrade() {
  let correctCount = 0;
  let failedCount = 0;

  questions.forEach((q, index) => {
    const savedAnswer = localStorage.getItem(`Question ${q.QId}`);
    const correctIndex = q.answers.findIndex((a) => a.isCorrect);

    if (savedAnswer && parseInt(savedAnswer) === correctIndex + 1) {
      correctCount++;
    } else {
      failedCount++;
    }
  });

  const grade = (correctCount / questions.length) * 100;
  console.log(`Your grade is: ${grade.toFixed(2)}%`);

  localStorage.setItem("correctAnswers", correctCount);
  localStorage.setItem("failedAnswers", failedCount);
  localStorage.setItem("gradePercentage", grade.toFixed(2));

  return grade;
}

window.addEventListener("load", init);
