import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function ScoreDashboard({ data }) {
    if (!data) return null;

    const score = data.match_results.match_percentage;
    const JD = data.job_description_parsed;
    const matchDetails = data.match_results;

    // Determine color based on score
    let scoreColor = 'text-green-500';
    let ringColor = 'ring-green-500';
    if (score < 50) {
        scoreColor = 'text-red-500';
        ringColor = 'ring-red-500';
    } else if (score < 75) {
        scoreColor = 'text-yellow-500';
        ringColor = 'ring-yellow-500';
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-6xl mx-auto border border-gray-100 mt-8">

            {/* Header with Score */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b pb-8 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Match Analysis</h2>
                    <p className="text-slate-500 mt-2">Target Role: <span className="font-semibold">{JD.role_title}</span></p>
                    <p className="text-slate-500">Base Similarity Score: {data.base_embedding_score}%</p>
                </div>

                <div className={`mt-6 md:mt-0 flex items-center justify-center w-32 h-32 rounded-full ring-8 ${ringColor} ring-opacity-20 bg-slate-50`}>
                    <span className={`text-5xl font-extrabold ${scoreColor}`}>
                        {score}<span className="text-2xl mt-1 inline-block">%</span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Skills Breakdown */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" /> Matched Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {matchDetails.matched_mandatory_skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    {skill}
                                </span>
                            ))}
                            {matchDetails.matched_optional_skills?.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm border border-green-100 opacity-80">
                                    {skill} (Optional)
                                </span>
                            ))}
                        </div>
                        {matchDetails.matched_mandatory_skills.length === 0 && <p className="text-slate-400">None found.</p>}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <XCircle className="text-red-500" /> Missing Critical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {matchDetails.missing_mandatory_skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        {matchDetails.missing_mandatory_skills.length === 0 && <p className="text-slate-400">No critical missing skills!</p>}
                    </div>
                </div>

                {/* Right Column: AI Analysis */}
                <div className="space-y-6">
                    <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
                        <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={20} /> Skill Gap Analysis
                        </h3>
                        <p className="text-yellow-700 text-sm leading-relaxed">
                            {matchDetails.skill_gap_analysis}
                        </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Overall Assessment</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {matchDetails.overall_assessment}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
