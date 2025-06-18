document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    fetchBookDetails(bookId);
});

async function fetchBookDetails(bookId) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();
    const book = {
        id: bookId,
        title: data.volumeInfo.title,
        authors: data.volumeInfo.authors,
        publishedDate: data.volumeInfo.publishedDate,
        genre: data.volumeInfo.categories,
        thumbnail: data.volumeInfo.imageLinks?.thumbnail || "./images/default-book.png"
    };

    // ✅ Update UI with Book Data
    document.getElementById("book-thumbnail").src = book.thumbnail;
    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = book.authors?.join(", ");
    document.getElementById("book-date").textContent = book.publishedDate || "No Date Available";
    document.getElementById("book-genre").textContent = book.genre?.join(", ") || "Unknown Genre";

    // ✅ Attach Borrow Functionality
    document.getElementById("borrow-btn").addEventListener("click", () => {
        handleBorrow(book);
    });
}

function handleBorrow(book) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        showStyledAlert("Please log in to borrow books.", "#cc0000"); // ❌ Error alert
        return;
    }

    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || {};
    borrowedBooks[currentUser.username] = borrowedBooks[currentUser.username] || [];

    if (!borrowedBooks[currentUser.username].some(b => b.id === book.id)) {
        borrowedBooks[currentUser.username].push(book);
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        showStyledAlert("Book borrowed successfully!", "#008000"); // ✅ Success alert
        document.getElementById("borrow-btn").textContent = "Borrowed ✔";
        document.getElementById("borrow-btn").disabled = true;
    } else {
        showStyledAlert("You have already borrowed this book.", "#ffa500"); // ⚠️ Warning alert
    }
}


function showStyledAlert(message, color = "#0044cc") {
    let alertBox = document.getElementById("styled-alert");

    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "styled-alert";
        document.body.appendChild(alertBox);
    }

    alertBox.textContent = message;
    alertBox.style.backgroundColor = color;
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 5000);
}

// Save the last visited book to localStorage
function saveLastVisited(book) {
    localStorage.setItem("lastVisitedBook", JSON.stringify(book));
}
