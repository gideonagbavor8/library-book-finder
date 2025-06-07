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

export async function getBookDetails(id) {
    // Google Books API for details
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    const data = await res.json();
    if (!data.volumeInfo) return null;

    // Optionally, fetch more metadata from Library of Congress here

    return {
        id: data.id,
        title: data.volumeInfo.title,
        authors: data.volumeInfo.authors,
        publishedDate: data.volumeInfo.publishedDate,
        thumbnail: data.volumeInfo.imageLinks?.thumbnail,
        description: data.volumeInfo.description,
    };
}






  // You can add Library of Congress API integration for book-details page