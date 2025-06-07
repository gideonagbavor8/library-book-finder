import { searchBooks } from './api.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsSection = document.getElementById('results');
const booksGrid = document.createElement("div"); // Create grid container
booksGrid.classList.add("books-grid"); // Assign class for styling

// Hide results section initially
resultsSection.style.display = "none";
resultsSection.appendChild(booksGrid); // Append the grid to resultsSection

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultsSection.style.display = "block"; // Show results section after search starts

  // Add "Search Results - Searching..." text
  resultsSection.innerHTML = `<h2>Search Results <span id="searching-text">- Searching...</span></h2>`;
  booksGrid.innerHTML = ""; // Clear previous results

  const query = input.value.trim();
  if (!query) return;

  const books = await searchBooks(query);
  const searchingText = document.getElementById("searching-text"); // Get the Searching text element

  if (!books.length) {
    resultsSection.innerHTML = '<h2>Search Results</h2><p>No results found.</p>';
    return;
  }

  // Remove "Searching..." text once books are loaded
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
          </div>
      `;
    booksGrid.appendChild(bookItem); // Append each book item to the grid
  });

  resultsSection.appendChild(booksGrid); // Ensure books grid is inside resultsSection
});
