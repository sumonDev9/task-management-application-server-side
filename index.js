const express = require('express');
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('task management application server is runing')
  })
  
  app.listen(port, () => {
    console.log(`task management application server is runing  on port ${port}`)
  })