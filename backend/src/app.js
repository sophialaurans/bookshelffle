import express from 'express';
import dotenv from 'dotenv';
import booksRoutes from './routes/index.js';
import authorsRoutes from './routes/authors.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use('/api/books', booksRoutes);
app.use('/api/authors', authorsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;