import { getBookDetails } from './api.js';

const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');
const detailsSection = document.getElementById('book-details');

async function loadDetails() {
    if (!bookId) {
        detailsSection.innerHTML = '<p>Book not found.</p>';
        return;
    }
    detailsSection.innerHTML = 'Loading...';
    const book = await getBookDetails(bookId);
    if (!book) {
        detailsSection.innerHTML = '<p>Book details not found.</p>';
        return;
    }
    detailsSection.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.thumbnail || ''}" alt="Book cover" width="120"/>
    <p><strong>Authors:</strong> ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
    <p><strong>Published:</strong> ${book.publishedDate || 'N/A'}</p>
    <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
  `;
}
loadDetails();