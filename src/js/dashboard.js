document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const borrowedBooksContainer = document.getElementById("borrowed-books-grid");
    const noBooksMessage = document.getElementById("no-books-message");
    const usernameDisplay = document.getElementById("username");
    const logoutBtn = document.getElementById("logout-btn");

    // Check if user is logged in
    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    usernameDisplay.textContent = currentUser.username;

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
                <img src="${book.thumbnail}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                <p>${book.publishedDate || 'No Date Available'}</p>
                <button class="return-btn" data-book-id="${bookId}">Return Book</button>
            `;
            borrowedBooksContainer.appendChild(bookCard);
        });
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "auth.html";
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("return-btn")) {
            const bookId = event.target.dataset.bookId;
            removeBorrowedBook(bookId, currentUser.username);
        }
    });
});

// Fetch book details
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

// Remove book from borrowed list
function removeBorrowedBook(bookId, username) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
    borrowedBooks[username] = borrowedBooks[username].filter(id => id !== bookId);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    showAlert("Book returned successfully!", "green");
    setTimeout(() => location.reload(), 1000);
}

// Show alert messages
function showAlert(message, color = "#0044cc") {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.style.backgroundColor = color;
    alertBox.classList.add("show");
    setTimeout(() => alertBox.classList.remove("show"), 5000);
}
