import fetch from 'node-fetch';

const fetchBooks = async (query) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}&key=${apiKey}&maxResults=40`
  );
  const data = await response.json();
  return data.items || [];
};

const fetchAuthors = async (query) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}&key=${apiKey}&maxResults=40`
  );
  const data = await response.json();
  return data.items || [];
};

export { fetchBooks, fetchAuthors };