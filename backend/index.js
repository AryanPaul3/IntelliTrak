import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { startReminderScheduler } from './scheduler/reminderScheduler.js';

// const { connectDb } = require('./db/connectDb.js');
import { connectDb } from './db/connectDb.js';
import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true
}));

app.use(cookieParser()); // allows us to parse cookies from the request
app.use(express.json());    // allows us to parse incomming requests : req.body
// app.get('/', (req, res) => {    
    //     res.send('Hello World!');
    // });
    
    app.use("/api/jobs", jobRoutes); 
    
    

app.use("/api/users" , userRoutes)

if(process.env.NODE_ENV === 'production') {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    
    app.get('*', (req, res) => {
        // Serve the index.html file for all routes
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));    
    });
}

app.listen(PORT, () => {
    connectDb();
    startReminderScheduler();
    console.log('Server started on port ', PORT);
});
