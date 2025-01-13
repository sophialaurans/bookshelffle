import fetch from 'node-fetch';

const fetchAuthors = async (query) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}&key=${apiKey}&maxResults=40`
  );
  const data = await response.json();

  return data.items || [];
};

const fetchSubjects = async (categoryQuery) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${categoryQuery}&key=${apiKey}&maxResults=40`
  );
  const data = await response.json();
  return data.items || [];
};

const fetchBooks = async (bookQuery) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${bookQuery}&key=${apiKey}&maxResults=40`
  );
  const data = await response.json();
  return data.items || [];
};

export { fetchAuthors, fetchBooks, fetchSubjects };