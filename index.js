const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.md_user}:${process.env.md_pass}@cluster0.yxc4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri);

const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    //console.log('Connected to MongoDB!');
    const database = client.db('movieDB');
    const moviesCollection = database.collection('movies');


    // Add movie endpoint
    app.post('/movies', async (req, res) => {
      
      try {
        const movieData = req.body;
        console.log( movieData);
        
        const result = await moviesCollection.insertOne(movieData);
        res.status(201).json({ message: 'Movie added successfully!', id: result.insertedId });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Fetch movies endpoint

  } catch (error) {
   
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Movie API is running!');
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await moviesCollection.find().toArray();
    res.send(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
