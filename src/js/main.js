import { searchBooks } from './api.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsSection = document.getElementById('results');
const booksGrid = document.createElement("div");
booksGrid.classList.add("books-grid");

resultsSection.style.display = "none";
resultsSection.appendChild(booksGrid);

// 🔍 Handle Book Search
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultsSection.style.display = "block";
  resultsSection.innerHTML = `<h2>Search Results <span id="searching-text">- Searching...</span></h2>`;
  booksGrid.innerHTML = "";

  const query = input.value.trim();
  if (!query) return;

  const books = await searchBooks(query);
  const searchingText = document.getElementById("searching-text");

  if (!books.length) {
    resultsSection.innerHTML = '<h2>Search Results</h2><p>No results found.</p>';
    return;
  }

  searchingText.style.display = "none";

  books.forEach(book => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-result");
    bookItem.innerHTML = `
      <img src="${book.thumbnail || './images/default-book.png'}" alt="${book.title}">
      <div>
        <h3><a href="book-details.html?id=${encodeURIComponent(book.id)}">${book.title}</a></h3>
        <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
        <p>${book.publishedDate || 'No Date Available'}</p>
        <button class="borrow-btn" data-book-id="${book.id}">Borrow</button> 
      </div>
    `;
    booksGrid.appendChild(bookItem);
  });

  resultsSection.appendChild(booksGrid);

  attachBorrowListeners(); // ✅ Wire up borrow buttons after rendering
});

// 🔐 Attach Borrow Button Functionality
function attachBorrowListeners() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const borrowButtons = document.querySelectorAll(".borrow-btn");

  borrowButtons.forEach(btn => {
    if (currentUser) {
      btn.style.display = "inline-block";
      btn.addEventListener("click", () => {
        const bookId = btn.dataset.bookId;
        handleBorrow(bookId, currentUser.username);
      });

      // ✅ Check if already borrowed & update UI instantly
      const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
      if (borrowedBooks[currentUser.username]?.includes(btn.dataset.bookId)) {
        btn.textContent = "Borrowed ✔";
        btn.disabled = true;
      }
    } else {
      btn.style.display = "none";
    }
  });
}

// 👋 Show User Greeting in Header
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  const greeting = document.createElement("p");
  greeting.textContent = `Welcome, ${currentUser.username}!`;
  document.querySelector("header").appendChild(greeting);

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 5000);
}

// 📚 Handle Book Borrowing
function handleBorrow(bookId, username) {
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
  borrowedBooks[username] = borrowedBooks[username] || [];

  if (!borrowedBooks[username].includes(bookId)) {
    borrowedBooks[username].push(bookId);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    showAlert("Book borrowed successfully!", "green");

    // 🔄 Update Button UI instantly
    const borrowBtn = document.querySelector(`[data-book-id="${bookId}"]`);
    borrowBtn.textContent = "Borrowed ✔";
    borrowBtn.disabled = true;
  } else {
    showAlert("You have already borrowed this book.", "orange");
  }
}

// 🔔 Show Alert Messages
function showAlert(message, color = "#0044cc") {
  const alertBox = document.getElementById("alert-box");
  alertBox.textContent = message;
  alertBox.style.backgroundColor = color;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 5000);
}


document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const borrowedLink = document.querySelector(".borrowed-link");

  if (!currentUser) {
    borrowedLink.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const recommendationsSection = document.getElementById("recommendations");
  const recommendedBooksContainer = document.getElementById("recommended-books");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Hide recommendations if no user is logged in
  if (!currentUser) return;

  recommendationsSection.style.display = "block";

  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
  const userBooks = borrowedBooks[currentUser.username] || [];

  let recommendedList = [];

  if (userBooks.length > 0) {
    recommendedList = getRecommendations(userBooks);
  } else {
    recommendedList = fixedRecommendations(); // Use fallback books
  }

  console.log("Generated recommendations:", recommendedList); // ✅ Debugging line

  if (recommendedList.length === 0) {
    recommendedBooksContainer.innerHTML = "<p>No recommendations available.</p>";
    return;
  }

  recommendedList.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
          <img src="${book.thumbnail}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>${book.authors.join(", ")}</p>
          <p>${book.publishedDate || "No Date Available"}</p>
      `;
    recommendedBooksContainer.appendChild(bookCard);
  });
});





// Example Functions for Recommendations
function getRecommendations(borrowedBooks) {
  const genres = borrowedBooks.map(book => book.genre); // Assuming genre is stored
  return recommendedBooks.filter(book => genres.includes(book.genre)); // Filter by genre match
}

function fixedRecommendations() {
  return [
    { title: "The Great Gatsby", authors: ["F. Scott Fitzgerald"], publishedDate: "1925", thumbnail: "./images/gatsby.png" },
    { title: "1984", authors: ["George Orwell"], publishedDate: "1949", thumbnail: "./images/1984.png" }
  ];
}
