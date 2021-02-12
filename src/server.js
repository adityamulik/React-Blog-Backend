import express, { request } from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
app.use(bodyParser.json());

app.get('/api/articles/:name', async (req, res) => {
  const { name: articleName } = req.params;
  const client = await MongoClient.connect(
    'mongodb://localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
  const db = client.db('react-blog-db');
  const articlesInfo = await db.collection('articles')
    .findOne({ name: articleName });
  res.status(200).json(articlesInfo);
});

app.post('/api/articles/:name/upvote', (req, res) => {
  const articleName = req.params.name;
  articlesInfo[articleName].upvotes += 1;
  res.status(200).send(`Success! ${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
});

app.post('/api/articles/:name/comments', (req, res) => {
  const articleName = req.params.name;
  const { postedBy, text } = req.body;
  articlesInfo[articleName].comments.push({
    postedBy,
    text
  });
  res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Server is listening on port 8000!'));
