import { fetchAuthors } from '../services/googleBooksService.js';

const getAuthors = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const authorsData = await fetchAuthors(query);
    const authorNames = authorsData
      .flatMap((item) => item.volumeInfo.authors || [])
      .filter((name, index, self) => self.indexOf(name) === index);

    res.status(200).json(authorNames);
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

export default { getAuthors };