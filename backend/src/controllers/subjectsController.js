import { fetchSubjects } from '../services/googleBooksService.js';
import levenshtein from 'fast-levenshtein';

const cache = new Map();

const getSubjects = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (cache.has(query)) {
    return res.status(200).json(cache.get(query));
  }

  try {
    const subjectsData = await fetchSubjects(query);
    const subjectCategory = subjectsData
      .flatMap((item) => item.volumeInfo.categories || [])
      .filter((subject, index, self) => self.indexOf(subject) === index);

    const sortedSubjects = subjectCategory
      .filter(subject => subject.toLowerCase().includes(query.toLowerCase()))
      .map((subject) => ({ subject, distance: levenshtein.get(query, subject) }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.subject);

    cache.set(query, sortedSubjects);
    setTimeout(() => cache.delete(query), 300000);

    res.status(200).json(sortedSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export default { getSubjects };