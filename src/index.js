import express from 'express';
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from "cors";

import { connectDB } from './lib/db.js';

import { initializeSocket } from './lib/socket.js';

dotenv.config();

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songsRoutes from './routes/songs.route.js';
import albumRoutes from './routes/album.route.js';
import stats from './routes/stats.js';
// import { initialize } from 'next/dist/server/lib/render-server.js';
import { createServer } from 'http';

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app)
initializeSocket(httpServer);

app.use(cors({
    orogin : "http://localhost:3001",
    credentials: true,
}))

app.use(express.json()); // to parse req.body

app.use(clerkMiddleware()) // this will add auth to request objest => req.auth.userId

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'), // to store temp file
    createParentPath : true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
})); // to upload files
 // to parse form data


app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/songs', songsRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/stats', stats)

//error handler{
app.use((err, req, res, next) => {
    res.status(500).json({ message : process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message })
});


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

//todo: socket io should be implemented in the backend