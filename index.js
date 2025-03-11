import express from 'express';
import { run } from './gemini.cjs';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const app = express();

app.post('/',  upload.single('image'), async (req, res) => {
  const filepath = req.file.path;

  const response = await run(filepath);
  res.send(response);
});

app.get('/', async (req, res) => {
  res.send("Hello");
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});