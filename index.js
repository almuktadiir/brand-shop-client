const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
console.log(process.env);
const brands = require('./brand.json');

//middleware
app.use(cors());
app.use(express.json());



// brands category
app.get('/brand', (req, res)=>{
    res.send(brands);
})

app.get('/', (req, res)=> {
    res.send('fashion server is running');
})

app.listen(port, (req, res)=>{
    console.log(`fashion server is running on : ${port}`);
})