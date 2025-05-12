// Get Data From Local Storage
const userFirstName = localStorage.getItem("Firstname") || "Guest";
const userLastName = localStorage.getItem("Lastname") || "Guest";
const fullname = `${userFirstName} ${userLastName}`;
const correctAnswers = localStorage.getItem("correctAnswers") || "Default";
const failedAnswers = localStorage.getItem("failedAnswers") || "Default";
const gradePercentage = localStorage.getItem("gradePercentage");
const parseGrade = parseFloat(gradePercentage) || 0;

// Display the results
const fullNameSpan = document.querySelector(".name");
const correctAnswersOutput = document.querySelector(".correctAnswers");
const failedAnswersOutput = document.querySelector(".failedAnswers");
const gradePercentageOutput = document.querySelector(".gradePercentage");

fullNameSpan.textContent = fullname;
correctAnswersOutput.textContent = `Correct Answers: ${correctAnswers}`;
failedAnswersOutput.textContent = `Failed Answers: ${failedAnswers}`;
gradePercentageOutput.textContent = `Grade: ${parseGrade}%`;
