const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const  helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit') 
const hpp = require('hpp')
const cors = require('cors')

//swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//Load env vars
dotenv.config({path:'./config/config.env'})

connectDB();
const app = express();

const swaggerOptions={
    swaggerDefinition:{
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers:[
            {
                url: 'http://localhost:5000/api/v1'
            }
        ],
    },
    apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//add cookie parser
app.use(cookieParser());

const hospitals = require('./routes/hospitals.js');
const register  = require('./routes/auth');
const auth = require('./routes/auth')
const appointments = require('./routes/appointments')

//Body paarser
app.use(express.json())

//Sanitize data
app.use(mongoSanitize())

//Set security headers
app.use(helmet())

//prevent XSS attacks
app.use(xss())

//Rate Limiting 
const limiter = rateLimit({
    windowsMs:10*60*1000, //10 mins
    max:5
})
app.use(limiter);

//Prevent http param pollutions
app.use(hpp())

//Enable CORS
app.use(cors())



app.use('/api/v1/hospitals',hospitals)
app.use('/api/v1/auth',register)
app.use('/api/v1/appointments',appointments)



const PORT  = process.env.PORT || 5000

const server = app.listen(PORT ,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})

process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error : ${err.message}`);
    server.close(()=>process.exit(1));
})