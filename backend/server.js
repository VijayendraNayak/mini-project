// backend/server.js
const express = require('express');
const readLastLines = require('read-last-lines');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

app.get('/api/summary', async (req, res) => {
    try {
        const logFilePath = path.join(__dirname, 'files', 'alert'); // Update with your log file path
        const lastLines = await readLastLines.read(logFilePath, 100); // Adjust the number of lines as needed

        const lines = lastLines.split('\n');
        const summary = analyzeLogEntries(lines);

        res.status(200).json({ success: true, message: 'Generating summary...', summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to analyze log entries and generate a summary
const analyzeLogEntries = (lines) => {
    const summary = {
        isSafe: true,
        attackTime: 'N/A',
        attackDetails: [],
    };

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
