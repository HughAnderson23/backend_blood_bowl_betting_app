const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth').router;
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

mongoose.connect('mongodb+srv://hughabcanderson:K7et92spI7rRhYFf@cluster0.yzt4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.get('/', (req, res) => {
  res.send('Blood Bowl Betting App API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
