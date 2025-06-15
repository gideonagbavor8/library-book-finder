const form = document.getElementById("auth-form");

// Retrieve users from localStorage or initialize empty array
let users = JSON.parse(localStorage.getItem("libraryUsers")) || [];

// Handle login/register
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Basic validation
  if (username.length < 3 || password.length < 6) {
    showFeedback("Username must be at least 3 characters and password 6+ characters.", "crimson");
    return;
  }

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    if (existingUser.password === password) {
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      showFeedback(`Welcome back, ${username}!`, "green");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    } else {
      showFeedback("Incorrect password. Try again.", "crimson");
    }
  } else {
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem("libraryUsers", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    showFeedback(`Account created! Welcome, ${username}.`, "#0044cc");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 5000);
  }
});

// Reusable feedback function for consistency
function showFeedback(message, color = "#0044cc") {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.style.backgroundColor = color;
    alertBox.classList.add("show");
  
    setTimeout(() => {
      alertBox.classList.remove("show");
    }, 5000);
  }
  
