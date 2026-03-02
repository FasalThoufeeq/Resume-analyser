import React, { useState } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import ScoreDashboard from './components/ScoreDashboard';
import ResumeFixes from './components/ResumeFixes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async (formData) => {
        setIsLoading(true);
        setAnalysisData(null);
        try {
            const response = await axios.post(`${API_URL}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysisData(response.data.data);
        } catch (error) {
            console.error("Analysis failed", error);
            alert(error.response?.data?.error || "Analysis failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                        Resume <span className="text-blue-600">Analyzer AI</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Get an instant, actionable ATS match score and AI-driven resume rewrites based on your target job description.
                    </p>
                </div>

                {/* Upload Form */}
                <UploadForm onSubmit={handleAnalyze} isLoading={isLoading} />

                {/* Results Sections */}
                {analysisData && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <ScoreDashboard data={analysisData} />
                        <ResumeFixes data={analysisData} />
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;
