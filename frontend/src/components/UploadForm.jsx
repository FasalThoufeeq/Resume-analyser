import React, { useState } from 'react';
import { Upload, FileText, Github, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadForm({ onSubmit, isLoading }) {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please upload a resume (PDF/DOCX)');
            return;
        }
        if (!jd.trim()) {
            setError('Please paste the job description');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jd);
        if (githubUrl) formData.append('githubUrl', githubUrl);

        onSubmit(formData);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-blue-500" /> Analyze Your Match
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column: File Upload & GitHub */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume (PDF, DOCX) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-slate-400 mb-3" />
                                        <p className="mb-2 text-sm text-slate-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-slate-500">{file ? file.name : "Limit: 10MB"}</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Github size={18} /> GitHub URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/username"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                            />
                        </div>
                    </div>

                    {/* Right Column: Job Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                            placeholder="Paste the target job description here..."
                            className="w-full h-[256px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Analyzing intelligent match...</span>
                    ) : (
                        <>Run Full Analysis <CheckCircle size={20} /></>
                    )}
                </button>
            </form>
        </div>
    );
}
