document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const borrowedBooksContainer = document.getElementById("borrowed-books-grid");
    const noBooksMessage = document.getElementById("no-books-message");

    if (!currentUser) {
        borrowedBooksContainer.innerHTML = "<p>Please log in to view borrowed books.</p>";
        return;
    }

    // Retrieve borrowed books from LocalStorage
    const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
    const userBooks = borrowedBooks[currentUser.username] || [];

    if (userBooks.length === 0) {
        noBooksMessage.style.display = "block";
        return;
    }

    // Display borrowed books using stored full details
    userBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <div class="book-card-inner">
                <div class="front">
                    <img src="${book.thumbnail || './images/default-book.png'}" alt="${book.title}">
                    <h3>${book.title}</h3>
                </div>
                <div class="back">
                    <p><strong>Author:</strong> ${book.authors.join(', ')}</p>
                    <p><strong>Published:</strong> ${book.publishedDate || 'No Date Available'}</p>
                </div>
            </div>
        `;
        borrowedBooksContainer.appendChild(bookCard);
    });
});

// 📚 Handle Book Borrowing - Stores full book details in LocalStorage
export function handleBorrow(book, username) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
    borrowedBooks[username] = borrowedBooks[username] || [];

    if (!borrowedBooks[username].some(b => b.book_id === book.book_id)) {
        borrowedBooks[username].push(book); // ✅ Store full book details
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        showAlert("Book borrowed successfully!", "green");
    }
}


function showAlert(message, color = "#0044cc") {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.style.backgroundColor = color;
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 5000);
}
