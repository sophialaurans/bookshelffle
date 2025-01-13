import { fetchBooks } from '../services/googleBooksService.js';

const getBooks = async (req, res) => {
  const { query } = req.query;

  try {
    const booksData = await fetchBooks(query);
    res.status(200).json(booksData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export { getBooks };
