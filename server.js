import express from 'express';
import cors from 'cors';
require('dotenv').config(); 
const indexRoute = require('./routes');
const configDB = require('./config/configDB')

const app = express();
const port = process.env.PORT || 8888;
// Middleware
// Config cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

configDB.connectDB();
indexRoute(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})