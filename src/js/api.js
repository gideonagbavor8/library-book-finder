export async function searchBooks(query) {
    // Google Books API
    const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const googleData = await googleRes.json();
    if (!googleData.items) return [];

    // Map Google Books results to a common format
    return googleData.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        publishedDate: item.volumeInfo.publishedDate,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    }));
}

export async function getBookDetails(bookId) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();
    console.log("Raw API response:", data); // ✅ Debugging output

    // Validate missing fields and provide defaults
    return {
        title: data.volumeInfo?.title || "Unknown Title",
        authors: data.volumeInfo?.authors || ["Unknown Author"],
        publishedDate: data.volumeInfo?.publishedDate || "N/A",
        description: data.volumeInfo?.description || "No description available.",
        thumbnail: data.volumeInfo?.imageLinks?.thumbnail || "./images/default-book.png"
    };
}