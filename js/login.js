// Variable declarations
const signupForm = $("#signup-form");
const signinForm = $("#signin-form");

const signupFirstname = document.getElementById("signup-firstname");
const signupLastname = document.getElementById("signup-lastname");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById(
  "signup-confirm-password"
);
const signupSubmit = document.getElementById("signup-submit");

const signinEmail = document.getElementById("singin-email");
const signinPassword = document.getElementById("singin-password");
const signinSubmit = document.getElementById("signin-submit");

const keyAllowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

// Pattern Validation
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Prefill form fields from localStorage
if (localStorage.getItem("signupFirstname")) {
  signupFirstname.value = localStorage.getItem("signupFirstname");
}
if (localStorage.getItem("signupLastname")) {
  signupLastname.value = localStorage.getItem("signupLastname");
}
if (localStorage.getItem("signupEmail")) {
  signupEmail.value = localStorage.getItem("signupEmail");
}
if (localStorage.getItem("signupPassword")) {
  signupPassword.value = localStorage.getItem("signupPassword");
}
if (localStorage.getItem("signupConfirmPassword")) {
  signupConfirmPassword.value = localStorage.getItem("signupConfirmPassword");
}

// Function definitions
function applyPlaceholderStyle(inputElement) {
  inputElement.addClass("styled-placeholder");
}

function removePlaceholderStyle(inputElement) {
  inputElement.removeClass("styled-placeholder");
}

function resetBorderColor() {
  this.style.borderColor = "color-mix(in oklab, #0d419d 70%, transparent)";
  signupFirstname.setAttribute("placeholder", "First Name");
  signupLastname.setAttribute("placeholder", "Last Name");
  signupEmail.setAttribute("placeholder", "example@example.com");
  signupPassword.setAttribute(
    "placeholder",
    "8+ chars, upper, lower, number, symbol"
  );
}

// Reset all signup fields' placeholders and remove placeholder styles
function resetFields() {
  signupFirstname.setAttribute("placeholder", "First Name");
  signupLastname.setAttribute("placeholder", "Last Name");
  signupEmail.setAttribute("placeholder", "example@example.com");
  signupPassword.setAttribute(
    "placeholder",
    "8+ chars, upper, lower, number, symbol"
  );
  signupConfirmPassword.setAttribute("placeholder", "");
  removePlaceholderStyle($(signupFirstname));
  removePlaceholderStyle($(signupLastname));
  removePlaceholderStyle($(signupEmail));
  removePlaceholderStyle($(signupPassword));
  removePlaceholderStyle($(signupConfirmPassword));
}

function validateName(e) {
  if (keyAllowed.includes(e.key)) return;
  if (/\d/.test(e.key)) {
    e.preventDefault();
    this.style.borderColor = "color-mix(in oklab, #0d419d 70%, transparent)";
    this.setAttribute("placeholder", "Letters Only");
    applyPlaceholderStyle($(this));
  } else {
    this.style.borderColor = "color-mix(in oklab, #12b76a 70%, transparent)";
    this.removeAttribute("placeholder");
    removePlaceholderStyle($(this));
  }
}

function validateEmail() {
  const currentValue = this.value;
  if (!emailPattern.test(currentValue)) {
    this.style.borderColor = "color-mix(in oklab, #0d419d 70%, transparent)";
    this.setAttribute("placeholder", "example@example.com");
    applyPlaceholderStyle($(this));
  } else {
    this.style.borderColor = "green";
    this.removeAttribute("placeholder");
    removePlaceholderStyle($(this));
  }
}

function validatePassword() {
  const currentValue = this.value;
  if (!passwordPattern.test(currentValue)) {
    this.style.borderColor = "color-mix(in oklab, #0d419d 70%, transparent)";
    this.setAttribute("placeholder", "8+ chars, upper, lower, number, symbol");
    applyPlaceholderStyle($(this));
  } else {
    this.style.borderColor = "green";
    this.removeAttribute("placeholder");
    removePlaceholderStyle($(this));
  }
}

function validateConfirmPassword() {
  if (signupConfirmPassword.value === signupPassword.value) {
    signupConfirmPassword.style.borderColor = "green";
    signupConfirmPassword.removeAttribute("placeholder");
    removePlaceholderStyle($(signupConfirmPassword));
  }
}

function validationForm(e) {
  e.preventDefault();

  if (signupFirstname.value.trim() === "") {
    signupFirstname.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupFirstname));
    setTimeout(() => {
      signupFirstname.setAttribute("placeholder", "First Name");
      removePlaceholderStyle($(signupFirstname));
    }, 500);
  } else {
    removePlaceholderStyle($(signupFirstname));
    signupFirstname.removeAttribute("placeholder");
  }
  if (signupLastname.value.trim() === "") {
    signupLastname.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupLastname));
    setTimeout(() => {
      signupLastname.setAttribute("placeholder", "Last Name");
      removePlaceholderStyle($(signupLastname));
    }, 500);
  } else {
    removePlaceholderStyle($(signupLastname));
    signupLastname.removeAttribute("placeholder");
  }

  let existingEmail = localStorage.getItem("Email");
  if (signupEmail.value.trim() === "") {
    signupEmail.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupEmail));
    setTimeout(() => {
      signupEmail.setAttribute("placeholder", "example@example.com");
      removePlaceholderStyle($(signupEmail));
    }, 500);
  } else if (signupEmail.value === existingEmail) {
    signupEmail.setAttribute("placeholder", "Email already exists");
    applyPlaceholderStyle($(signupEmail));
    setTimeout(() => {
      signupEmail.setAttribute("placeholder", "example@example.com");
      removePlaceholderStyle($(signupEmail));
    }, 500);
  } else if (!emailPattern.test(signupEmail.value)) {
    signupEmail.setAttribute("placeholder", "Please enter email: xxx@xxx.xxx");
    applyPlaceholderStyle($(this));
    setTimeout(() => {
      signupEmail.setAttribute("placeholder", "example@example.com");
      removePlaceholderStyle($(signupEmail));
    }, 500);
  } else {
    removePlaceholderStyle($(signupEmail));
    signupEmail.removeAttribute("placeholder");
  }

  if (signupPassword.value.trim() === "") {
    signupPassword.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupPassword));
    setTimeout(() => {
      signupPassword.setAttribute(
        "placeholder",
        "8+ chars, upper, lower, number, symbol"
      );
      removePlaceholderStyle($(signupPassword));
    }, 500);
  } else if (signupPassword.value.trim() === 0) {
    signupPassword.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupPassword));
    setTimeout(() => {
      signupPassword.setAttribute(
        "placeholder",
        "8+ chars, upper, lower, number, symbol"
      );
      removePlaceholderStyle($(signupPassword));
    }, 500);
  } else {
    removePlaceholderStyle($(signupPassword));
    signupPassword.removeAttribute("placeholder");
  }

  if (signupConfirmPassword.value.trim() === "") {
    signupConfirmPassword.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signupConfirmPassword));
    setTimeout(() => {
      signupConfirmPassword.setAttribute("placeholder", "");
      removePlaceholderStyle($(signupConfirmPassword));
    }, 500);
  } else if (signupConfirmPassword.value !== signupPassword.value) {
    signupConfirmPassword.setAttribute("placeholder", "Passwords do not match");
    applyPlaceholderStyle($(signupConfirmPassword));
    setTimeout(() => {
      signupConfirmPassword.setAttribute("placeholder", "");
      removePlaceholderStyle($(signupConfirmPassword));
    }, 500);
  } else {
    removePlaceholderStyle($(signupConfirmPassword));
    signupConfirmPassword.removeAttribute("placeholder");
  }

  // Remove all localStorage keys except Email, Firstname, Lastname, Password if email has changed
  existingEmail = localStorage.getItem("Email");
  if (signupEmail.value !== existingEmail) {
    const allowedKeys = ["Email", "Firstname", "Lastname", "Password"];
    Object.keys(localStorage).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  if (signupEmail.value === localStorage.getItem("Email")) {
    signupEmail.setAttribute("placeholder", "Email already exists");
    applyPlaceholderStyle($(signupEmail));
    return;
  }

  if (
    signupFirstname.value &&
    signupLastname.value &&
    passwordPattern.test(signupPassword.value) &&
    emailPattern.test(signupEmail.value) &&
    signupConfirmPassword.value === signupPassword.value
  ) {
    localStorage.setItem("Firstname", signupFirstname.value);
    localStorage.setItem("Lastname", signupLastname.value);
    localStorage.setItem("Email", signupEmail.value);
    localStorage.setItem("Password", signupPassword.value);
    window.location.replace("../pages/ExamPage.html");
  }
}

function validateLoginForm(e) {
  e.preventDefault();

  const storedEmail = localStorage.getItem("Email");
  const storedPassword = localStorage.getItem("Password");

  let valid = true;

  if (signinEmail.value.trim() === "") {
    signinEmail.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signinEmail));
    valid = false;
  } else if (signinEmail.value !== storedEmail) {
    signinEmail.setAttribute("placeholder", "Email not found");
    applyPlaceholderStyle($(signinEmail));
    valid = false;
  } else {
    signinEmail.removeAttribute("placeholder");
    removePlaceholderStyle($(signinEmail));
  }

  if (signinPassword.value.trim() === "") {
    signinPassword.setAttribute("placeholder", "Required");
    applyPlaceholderStyle($(signinPassword));
    valid = false;
  } else if (signinPassword.value !== storedPassword) {
    signinPassword.setAttribute("placeholder", "Incorrect Password");
    applyPlaceholderStyle($(signinPassword));
    valid = false;
  } else {
    signinPassword.removeAttribute("placeholder");
    removePlaceholderStyle($(signinPassword));
  }

  if (valid) {
    const allowedKeys = ["Email", "Firstname", "Lastname", "Password"];
    Object.keys(localStorage).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    window.location.replace("../pages/ExamPage.html");
  }
}

// Switching between Forms
signupForm.on("click", "a", function (e) {
  e.preventDefault();
  signupForm.hide();
  signinForm.show();
});
signinForm.on("click", "a", function (e) {
  e.preventDefault();
  signinForm.hide();
  signupForm.show();
});

signupFirstname.addEventListener("blur", resetBorderColor);
signupLastname.addEventListener("blur", resetBorderColor);
signupEmail.addEventListener("blur", resetBorderColor);
signupPassword.addEventListener("blur", resetBorderColor);
signupConfirmPassword.addEventListener("blur", resetBorderColor);

signupFirstname.addEventListener("keydown", validateName);
signupLastname.addEventListener("keydown", validateName);
signupEmail.addEventListener("input", validateEmail);
signupPassword.addEventListener("input", validatePassword);
signupConfirmPassword.addEventListener("input", validateConfirmPassword);

signinForm.on("submit", validateLoginForm);
signupForm.on("submit", validationForm);
