document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const borrowedBooksContainer = document.getElementById("borrowed-books-grid");
    const noBooksMessage = document.getElementById("no-books-message");

    if (!currentUser) {
        borrowedBooksContainer.innerHTML = "<p>Please log in to view borrowed books.</p>";
        return;
    }

    const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
    const userBooks = borrowedBooks[currentUser.username] || [];

    if (userBooks.length === 0) {
        noBooksMessage.style.display = "block";
        return;
    }

    userBooks.forEach(bookId => {
        fetchBookDetails(bookId).then(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `
          <img src="${book.thumbnail || './images/default-book.png'}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
          <p>${book.publishedDate || 'No Date Available'}</p>
        `;
            borrowedBooksContainer.appendChild(bookCard);
        });
    });
});

// Fetch book details from API using book ID
async function fetchBookDetails(bookId) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();
    return {
        title: data.volumeInfo.title,
        authors: data.volumeInfo.authors,
        publishedDate: data.volumeInfo.publishedDate,
        thumbnail: data.volumeInfo.imageLinks?.thumbnail || ""
    };
}
  