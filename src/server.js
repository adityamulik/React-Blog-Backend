import express, { request } from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
app.use(bodyParser.json());

const start = async () => {
  const client = await MongoClient.connect(
    'mongodb://localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
  
  const db = client.db('react-blog-db');
  
  app.get('/api/articles/:name', async (req, res) => {
    const { name: articleName } = req.params;  
    const articlesInfo = await db.collection('articles')
      .findOne({ name: articleName });
    res.status(200).json(articlesInfo);
  });
  
  app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;
    await db.collection('articles').updateOne(
      { name: articleName },
      { $inc:  { upvotes: 1 } }
    );
    const updatedArticle = await db.collection('articles').findOne({ name: articleName })
    res.send(200).json(updatedArticle)
  });
  
  app.post('/api/articles/:name/comments', async (req, res) => {
    const articleName = req.params.name;
    const { postedBy, text } = req.body;
    await db.collection('articles').updateOne(
      { name: articleName },
      { $push: { comments: { postedBy, text } } },
    );
    const updatedArticle = await db.collection('articles').findOne({ name: articleName })
    res.send(200).json(updatedArticle)
  });

  app.listen(8000, () => console.log('Server is listening on port 8000!'));  
}

start();


