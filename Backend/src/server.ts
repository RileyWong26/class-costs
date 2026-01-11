import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import parseTranscript from "@/features/parser/parser.transcript.js";
import multer from 'multer';

const app = express();
const PORT = process.env.PORT;

const upload = multer({
    storage: multer.memoryStorage(),
})


const allowedDomains: string[] | undefined  = process.env.CORS_DOMAINS?.split(',').map(domain => domain.trim());

const corsOptions:CorsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedDomains?.includes(origin)) return callback(null, true);
        else return callback(null, false);
    }
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send("Running");
})

app.put('/uploadFile', upload.single("file"), (req, res) => {
    // console.log(req.file);
    const upload : Express.Multer.File | undefined = req.file;
    // console.log(!upload);
    if (!upload){
        res.status(400);
    }
    parseTranscript(upload);
    res.send("");

})

// Server setup
app.listen(PORT,() => {
    console.log(`Server started on ${PORT} ${allowedDomains}`);
})
