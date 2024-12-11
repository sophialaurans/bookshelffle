import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/books', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
