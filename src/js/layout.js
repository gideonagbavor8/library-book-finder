const featuredBooks = [
    {
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        cover: "./images/javaScript.png"
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        cover: "./images/cleancode.png"
    },
    {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        cover: "./images/javaScript-eloq.png"
    }
];

function displayFeaturedBooks() {
    const bookList = document.querySelector(".book-list");

    featuredBooks.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-card");
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
        `;
        bookList.appendChild(bookItem);
    });
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", displayFeaturedBooks);
