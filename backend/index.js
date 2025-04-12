import express from 'express';
import cors from 'cors';
import addDefRoute from './routes/addDefinitions.js';
import getDefRoute from './routes/getDefinitions.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use(addDefRoute);
app.use(getDefRoute);

app.get('/', (req, res) => {
    res.send('✨ Backend is running!');
  });

app.listen(port, () => {
  console.log(`🚀 Express server running at http://localhost:${port}`);
});
