import React from 'react';
import { Sparkles, Key } from 'lucide-react';

export default function ResumeFixes({ data }) {
    if (!data) return null;

    const keywords = data.keyword_analysis;
    const rewrite = data.rewrite_suggestions;
    const github = data.github_analysis;

    return (
        <div className="w-full max-w-6xl mx-auto mt-8 space-y-8">

            {/* Missing Keywords ATS Optimization */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Key className="text-indigo-500" /> ATS Keyword Optimizer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Missing Keywords to Add:</h4>
                        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            {keywords.missing_keywords?.map((kw, i) => <li key={i}>{kw}</li>)}
                        </ul>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <h4 className="font-semibold text-indigo-800 mb-3">Suggested Insertions:</h4>
                        <ul className="space-y-3">
                            {keywords.suggested_keyword_insertions?.map((ins, i) => (
                                <li key={i} className="text-sm">
                                    <span className="font-bold text-indigo-700">{ins.keyword}</span>
                                    <span className="text-slate-500"> ({ins.where_to_add})</span>
                                    <p className="mt-1 text-slate-700 italic border-l-2 border-indigo-300 pl-2">"{ins.example_sentence}"</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Side-by-Side Rewrite Suggestions */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Sparkles className="text-amber-500" /> targeted rewrites
                </h2>
                <div className="space-y-6">
                    {rewrite.rewritten_sections?.map((section, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start rounded-xl overflow-hidden border border-slate-200">
                            <div className="bg-red-50 p-5 h-full">
                                <span className="text-xs font-bold uppercase text-red-700 tracking-wider mb-2 block">Original Version</span>
                                <pre className="text-sm text-red-900 leading-relaxed whitespace-pre-wrap font-sans">{typeof section.original_text === 'object' ? JSON.stringify(section.original_text, null, 2) : section.original_text}</pre>
                            </div>
                            <div className="bg-green-50 p-5 h-full border-l border-slate-200">
                                <span className="text-xs font-bold uppercase text-green-700 tracking-wider mb-2 block">Optimized Version</span>
                                <pre className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap font-medium font-sans">{typeof section.improved_text === 'object' ? JSON.stringify(section.improved_text, null, 2) : section.improved_text}</pre>
                                <div className="mt-4 text-xs text-green-800 bg-green-100 inline-block px-3 py-1 rounded-full border border-green-200">
                                    <span className="font-bold">Reasoning:</span> {section.reasoning}
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!rewrite.rewritten_sections || rewrite.rewritten_sections.length === 0) && (
                        <p className="text-slate-500 text-center py-4">Your resume bullets are already well-optimized for this role!</p>
                    )}
                </div>
            </div>

            {/* GitHub Analysis */}
            {github && (
                <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 text-slate-300">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub Portfolio Intelligence
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800 p-5 rounded-xl">
                            <h4 className="font-semibold text-white mb-2">High Impact Ideas</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {github.high_impact_ideas?.map((idea, i) => <li key={i}>{idea}</li>)}
                            </ul>
                        </div>
                        <div className="bg-slate-800 p-5 rounded-xl">
                            <h4 className="font-semibold text-white mb-2">Portfolio Weaknesses</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {github.portfolio_weaknesses?.map((weak, i) => <li key={i}>{weak}</li>)}
                            </ul>
                        </div>
                        <div className="bg-slate-800 p-5 rounded-xl">
                            <h4 className="font-semibold text-white mb-2">Missing Project Types</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {github.missing_project_types?.map((proj, i) => <li key={i}>{proj}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
