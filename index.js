// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
 .then(() => console.log('MongoDB connected...'))
 .catch((err) => console.error(err));

//define mongoose schema object
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },

 location: {
    type: String,
    required: true,
    },
 cuisine: {
    type: String,
    required: true,
    },
 rating: {
    type: Number,
    required: true,
    },
   
 menu:{
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true }
      }
    ]
  },
 });

const User = mongoose.model('User', userSchema);

//monmgose validation


app.use((req, res, next) => {
  const { name, location, cuisine, rating,} = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Validation failed: name is required' });
  } else if (!location) {
    return res.status(400).json({ error: 'Validation failed: location is required' });
  } else if (!cuisine) {
    return res.status(400).json({ error: 'Validation failed: cuisine is required' });
  } else if (!rating) {
    return res.status(400).json({ error: 'Validation failed: rating is required' });
  }
  next();
});

//post-to create a new item
app.post('/items', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get-to get all items
app.get('/items', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//put-to update an item
app.put('/items/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }
    user.name = req.body.name || user.name;
    user.location = req.body.location || user.location;
    user.cuisine = req.body.cuisine || user.cuisine;
    user.rating = req.body.rating || user.rating;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server started on port http://localhost:3000');
});
