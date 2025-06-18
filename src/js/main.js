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
    bookItem.classList.add("book-card");
    bookItem.innerHTML = `
      <img src="${book.thumbnail || './images/default-book.png'}" alt="${book.title}">
      <h3>
        <a href="book-details.html?id=${encodeURIComponent(book.id)}">${book.title}</a> <!-- ✅ Title is clickable -->
      </h3>
      <p><strong>Author:</strong> ${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
      <p><strong>Published:</strong> ${book.publishedDate || 'No Date Available'}</p>
    `;
    booksGrid.appendChild(bookItem);
  });


  resultsSection.appendChild(booksGrid);
  setTimeout(() => attachBorrowListeners(), 100);
  // attachBorrowListeners();
});

// 🎯 **Fetch Recommended Books from JSON**
fetch('./js/books.json')
  .then(response => response.json())
  .then(books => displayRecommendedBooks(books))
  .catch(error => console.error("Error loading book data:", error));

function displayRecommendedBooks(books) {
  const recommendedBooksContainer = document.getElementById("recommended-books");
  recommendedBooksContainer.innerHTML = "";

  books.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
      <img src="${book.cover_image}" alt="${book.title}" width="120">
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Published:</strong> ${book.publication_year}</p>
      <p><strong>Rating:</strong> ${book.rating} ⭐ (${book.reviews} reviews)</p>
    `;
    recommendedBooksContainer.appendChild(bookCard);
  });

  attachBorrowListeners();
}





// Borrowing function
function attachBorrowListeners() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const borrowButtons = document.querySelectorAll(".borrow-btn");

  if (!borrowButtons.length) {
    console.error("No borrow buttons found in DOM!");
    return;
  }

  borrowButtons.forEach(btn => {
    if (currentUser) {
      btn.style.display = "inline-block";
      btn.addEventListener("click", () => {
        const bookId = btn.dataset.bookId;
        const book = books.find(b => b.id === bookId);
        if (!book) {
          console.error("Book data missing for ID:", bookId);
          return;
        }
        handleBorrow(book, currentUser.username);
      });

      const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
      if (borrowedBooks[currentUser.username]?.some(b => b.book_id === btn.dataset.bookId)) {
        btn.textContent = "Borrowed ✔";
        btn.disabled = true;
      }
    } else {
      btn.style.display = "none";
    }
  });
}


// Search History
function saveSearchHistory(query) {
  let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searches.includes(query)) {
    searches.unshift(query); // Add to the start of the list
    if (searches.length > 5) searches.pop(); // Limit to last 5 searches
    localStorage.setItem("searchHistory", JSON.stringify(searches));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("search-history");
  const searches = JSON.parse(localStorage.getItem("searchHistory")) || [];

  historyContainer.innerHTML = searches.map(q => `<li>${q}</li>`).join("");
});

document.addEventListener("DOMContentLoaded", () => {
  const lastBook = JSON.parse(localStorage.getItem("lastVisitedBook"));
  if (lastBook) {
    document.getElementById("last-book-container").innerHTML = `
          <h3>Last Viewed: ${lastBook.title}</h3>
          <a href="book-details.html?id=${lastBook.id}">Continue Reading</a>
      `;
  }
});
