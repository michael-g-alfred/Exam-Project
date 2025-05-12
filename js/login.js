// Variable declarations
const signupForm = $("#signup-form");
const signinForm = $("#signin-form");

const signupFirstname = $("#signup-firstname");
const signupLastname = $("#signup-lastname");
const signupEmail = $("#signup-email");
const signupPassword = $("#signup-password");
const signupConfirmPassword = $("#signup-confirm-password");
const signupSubmit = $("#signup-submit");

const signinEmail = $("#signin-email");
const signinPassword = $("#signin-password");
const signinSubmit = $("#signin-submit");

const keyAllowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

// Pattern Validation
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Prefill form fields from localStorage
if (localStorage.getItem("signupFirstname")) {
  signupFirstname.val(localStorage.getItem("signupFirstname"));
}
if (localStorage.getItem("signupLastname")) {
  signupLastname.val(localStorage.getItem("signupLastname"));
}
if (localStorage.getItem("signupEmail")) {
  signupEmail.val(localStorage.getItem("signupEmail"));
}
if (localStorage.getItem("signupPassword")) {
  signupPassword.val(localStorage.getItem("signupPassword"));
}
if (localStorage.getItem("signupConfirmPassword")) {
  signupConfirmPassword.val(localStorage.getItem("signupConfirmPassword"));
}

// Function definitions
function applyPlaceholderStyle(inputElement) {
  inputElement.addClass("styled-placeholder");
}

function removePlaceholderStyle(inputElement) {
  inputElement.removeClass("styled-placeholder");
}

function handleEmptyField(input, placeholderText, originalPlaceholder) {
  if (input.val().trim() === "") {
    input.attr("placeholder", placeholderText);
    applyPlaceholderStyle(input);
    setTimeout(() => {
      input.attr(
        "placeholder",
        placeholderText === "Required" ? originalPlaceholder : placeholderText
      );
      removePlaceholderStyle(input);
    }, 500);
    return true;
  }
  return false;
}

function resetFields() {
  $(this).css("border-color", "color-mix(in oklab, #0d419d 70%, transparent)");
  const fields = [
    { field: signupFirstname, placeholder: "First Name" },
    { field: signupLastname, placeholder: "Last Name" },
    { field: signupEmail, placeholder: "Example@example.com" },
    {
      field: signupPassword,
      placeholder: "8+ chars, upper, lower, number, symbol",
    },
    {
      field: signupConfirmPassword,
      placeholder: "Re-enter your password to confirm",
    },
  ];
  fields.forEach(({ field, placeholder }) => {
    field.attr("placeholder", placeholder);
    removePlaceholderStyle(field);
  });
}

function validateName(e) {
  if (keyAllowed.includes(e.key)) return;
  if (/\d/.test(e.key)) {
    e.preventDefault();
    $(this).attr("placeholder", "Letters Only");
    applyPlaceholderStyle($(this));
  } else {
    $(this).css(
      "border-color",
      "color-mix(in oklab, #12b76a 70%, transparent)"
    );
    $(this).removeAttr("placeholder");
    removePlaceholderStyle($(this));
  }
}

function validateEmail() {
  const currentValue = $(this).val();
  if (!emailPattern.test(currentValue)) {
    applyPlaceholderStyle($(this));
  } else {
    $(this).css(
      "border-color",
      "color-mix(in oklab, #12b76a 70%, transparent)"
    );
    removePlaceholderStyle($(this));
  }
}

function validatePassword() {
  const currentValue = $(this).val();
  if (!passwordPattern.test(currentValue)) {
    $(this).attr("placeholder", "8+ chars, upper, lower, number, symbol");
    applyPlaceholderStyle($(this));
  } else {
    $(this).css(
      "border-color",
      "color-mix(in oklab, #12b76a 70%, transparent)"
    );
    $(this).removeAttr("placeholder");
    removePlaceholderStyle($(this));
  }
}

function validateConfirmPassword() {
  if (signupConfirmPassword.val() === signupPassword.val()) {
    signupConfirmPassword.css(
      "border-color",
      "color-mix(in oklab, #12b76a 70%, transparent)"
    );
    signupConfirmPassword.removeAttr("placeholder");
    removePlaceholderStyle(signupConfirmPassword);
  } else {
    signupConfirmPassword.attr("placeholder", "Passwords do not match");
    applyPlaceholderStyle(signupConfirmPassword);
  }
}

function validationForm(e) {
  e.preventDefault();

  const fields = [
    {
      field: signupFirstname,
      requiredPlaceholder: "Required",
      originalPlaceholder: "First Name",
    },
    {
      field: signupLastname,
      requiredPlaceholder: "Required",
      originalPlaceholder: "Last Name",
    },
    {
      field: signupEmail,
      requiredPlaceholder: "Required",
      originalPlaceholder: "Example@example.com",
    },
    {
      field: signupPassword,
      requiredPlaceholder: "Required",
      originalPlaceholder: "8+ chars, upper, lower, number, symbol",
    },
    {
      field: signupConfirmPassword,
      requiredPlaceholder: "Required",
      originalPlaceholder: "Re-enter your password to confirm",
    },
  ];

  let hasEmptyField = false;

  fields.forEach((el) => {
    if (
      handleEmptyField(el.field, el.requiredPlaceholder, el.originalPlaceholder)
    ) {
      hasEmptyField = true;
    } else {
      el.field.removeAttr("placeholder");
      removePlaceholderStyle(el.field);
    }
  });

  if (!hasEmptyField) {
    if (signupConfirmPassword.val() !== signupPassword.val()) {
      signupConfirmPassword.val("");
      signupConfirmPassword.attr("placeholder", "Passwords do not match");
      applyPlaceholderStyle(signupConfirmPassword);
      return;
    }

    const existingEmail = localStorage.getItem("Email");

    if (signupEmail.val() === existingEmail) {
      signupEmail.val("");
      signupEmail.attr("placeholder", "Email already exists");
      applyPlaceholderStyle(signupEmail);
      return;
    }

    if (!emailPattern.test(signupEmail.val())) {
      signupEmail.val("");
      signupEmail.attr("placeholder", "Invalid email format");
      applyPlaceholderStyle(signupEmail);
      return;
    }

    if (!passwordPattern.test(signupPassword.val())) {
      signupPassword.val("");
      signupPassword.attr("placeholder", "Password does not meet requirements");
      applyPlaceholderStyle(signupPassword);
      return;
    }

    if (signupEmail.val() !== existingEmail) {
      removePlaceholderStyle(signupEmail);
      const allowedKeys = ["Email", "Firstname", "Lastname", "Password"];
      Object.keys(localStorage).forEach((key) => {
        if (!allowedKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    }

    localStorage.setItem("Firstname", signupFirstname.val());
    localStorage.setItem("Lastname", signupLastname.val());
    localStorage.setItem("Email", signupEmail.val());
    localStorage.setItem("Password", signupPassword.val());
    window.location.replace("../pages/ExamPage.html");
  }
}

function validateLoginForm(e) {
  e.preventDefault();

  const storedEmail = localStorage.getItem("Email");
  const storedPassword = localStorage.getItem("Password");

  if (!storedEmail || !storedPassword) {
    signinEmail.val("");
    signinEmail.attr("placeholder", "No account found");
    applyPlaceholderStyle(signinEmail);
    return;
  }

  let valid = true;

  if (signinEmail.val().trim() === "") {
    signinEmail.attr("placeholder", "Required");
    applyPlaceholderStyle(signinEmail);
    valid = false;
  } else if (signinEmail.val() !== storedEmail) {
    signinEmail.val("");
    signinEmail.attr("placeholder", "Email not found");
    applyPlaceholderStyle(signinEmail);
    valid = false;
  } else {
    signinEmail.removeAttr("placeholder");
    removePlaceholderStyle(signinEmail);
  }

  if (signinPassword.val().trim() === "") {
    signinPassword.attr("placeholder", "Required");
    applyPlaceholderStyle(signinPassword);
    valid = false;
  } else if (signinPassword.val() !== storedPassword) {
    signinPassword.val("");
    signinPassword.attr("placeholder", "Incorrect Password");
    applyPlaceholderStyle(signinPassword);
    valid = false;
  } else {
    signinPassword.removeAttr("placeholder");
    removePlaceholderStyle(signinPassword);
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

$("input").on("blur", resetFields);
signupFirstname.on("keydown", validateName);
signupLastname.on("keydown", validateName);
signupEmail.on("input", validateEmail);
signupPassword.on("input", validatePassword);
signupConfirmPassword.on("input", validateConfirmPassword);

$(document).ready(function () {
  signinForm.on("submit", validateLoginForm);
});
