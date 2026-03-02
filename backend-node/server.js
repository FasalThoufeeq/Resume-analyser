import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Resume Analyzer Backend is running.' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
