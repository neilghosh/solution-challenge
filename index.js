import express from 'express';
import run from './gemini.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const app = express();

app.post('/id',  upload.single('image'), async (req, res) => {
  console.log("POST");
  const filepath = req.file.path;
  const response = await run(filepath);
  console.log(response);
  res.send(response);
});


app.get('/health', async (req, res) => {
  console.log("Health");
  res.send('{"status": "UP"}');
});

app.get('/', async (req, res) => {
  console.log("GET");
  res.send("Hello World");
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});