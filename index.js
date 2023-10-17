const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
console.log(process.env)

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send('fashion server is running');
})

app.listen(port, (req, res)=>{
    console.log(`fashion server is running on : ${port}`);
})