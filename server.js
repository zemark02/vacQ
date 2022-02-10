const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config({path:'./config/config.env'})

connectDB();

const app = express();

const hospitals = require('./routes/hospitals.js');
const register  = require('./routes/auth');

app.use(express.json())

app.use('/api/v1/hospitals',hospitals)
app.use('/api/v1/auth',register)



const PORT  = process.env.PORT || 5000

const server = app.listen(PORT ,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})

process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error : ${err.message}`);
    server.close(()=>process.exit(1));
})