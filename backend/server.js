const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose
    .connect("mongodb://localhost:27017/File")
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
const port = 4000;

app.use(cors());

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB model for file
const File = mongoose.model('File', {
    filename: String,
    data: Buffer,
});

// Route to handle file upload and generate summary
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            filename: Date.now() + '-' + req.file.originalname,
            data: req.file.buffer,
        });

        await file.save();

        // Extract details and generate summary
        const fileContent = req.file.buffer.toString(); // Assuming the file contains text data
        const summary = analyzeFileContent(fileContent);

        res.status(200).json({ success: true, message: 'File uploaded and summary generated successfully', summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const analyzeFileContent = (content) => {
    const summary = {
        isSafe: true,
        attackTime: 'N/A',
        attackDetails: [],
    };

    const lines = content.split('\n'); // Split the content into lines

    lines.forEach((line) => {
        if (line.includes('BAD-TRAFFIC')) {
            summary.isSafe = false;

            const match = line.match(/^\d{2}\/\d{2}-\d{2}:\d{2}:\d{2}\.\d{6}/);
            const timestamp = match ? match[0] : 'N/A';

            summary.attackTime = timestamp;
            summary.attackDetails.push(line); // Push only the line where error is detected
        }
    });

    return summary;
};

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
