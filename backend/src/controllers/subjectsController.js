import { fetchSubjects } from '../services/googleBooksService.js';

const getSubjects = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const subjectsData = await fetchSubjects(query);
    const subjectCategory = subjectsData
      .flatMap((item) => item.volumeInfo.categories || [])
      .filter((subject, index, self) => self.indexOf(subject) === index);

    res.status(200).json(subjectCategory);
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export default { getSubjects };