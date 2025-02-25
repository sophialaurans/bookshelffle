import { fetchAuthors } from '../services/googleBooksService.js';
import levenshtein from 'fast-levenshtein';

const cache = new Map();

const getAuthors = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (cache.has(query)) {
    return res.status(200).json(cache.get(query));
  }

  try {
    const authorsData = await fetchAuthors(query);
    const authorNames = authorsData
      .flatMap((item) => item.volumeInfo.authors || [])
      .filter((name, index, self) => self.indexOf(name) === index);

    const sortedAuthors = authorNames
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .map((name) => ({ name, distance: levenshtein.get(query, name) }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.name);

    cache.set(query, sortedAuthors);
    setTimeout(() => cache.delete(query), 300000);

    res.status(200).json(sortedAuthors);
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

export default { getAuthors };
