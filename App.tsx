
import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeResumeAndJobDescription } from './services/geminiService';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ErrorMessage } from './components/ErrorMessage';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { PLACEHOLDER_JOB_DESC } from './constants';
import { FileUpload } from './components/FileUpload';

export default function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescriptionText.trim()) {
      setError('Please provide both your resume PDF and the job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const resumeFileBase64 = await fileToBase64(resumeFile);
      const result = await analyzeResumeAndJobDescription(resumeFileBase64, jobDescriptionText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please check if your PDF is text-based and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeFile, jobDescriptionText]);
  
  const loadSampleData = () => {
    setJobDescriptionText(PLACEHOLDER_JOB_DESC);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Optimizer AI</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Get Your Resume Job-Ready</h2>
            <p className="mt-4 text-lg text-slate-600">
                Upload your resume and paste a target job description to get AI-powered suggestions for improvement. 
                <button onClick={loadSampleData} className="text-indigo-600 hover:text-indigo-500 font-semibold ml-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Try with a sample job description</button>.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <div>
              <label htmlFor="resume" className="block text-sm font-semibold text-slate-700 mb-2">
                Your Resume (PDF only)
              </label>
              <FileUpload onFileSelect={setResumeFile} />
            </div>
            <div>
              <label htmlFor="job-description" className="block text-sm font-semibold text-slate-700 mb-2">
                Target Job Description
              </label>
              <textarea
                id="job-description"
                rows={15}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Paste the job description you're applying for..."
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !resumeFile || !jobDescriptionText.trim()}
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Analyze & Optimize
                </>
              )}
            </button>
          </div>
          
          {/* Output Section */}
          <div className="bg-white p-6 rounded-xl shadow-md min-h-[500px] flex flex-col justify-center">
            {isLoading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-slate-600 font-semibold">AI is analyzing your documents...</p>
              </div>
            )}
            {error && <ErrorMessage message={error} />}
            {analysisResult && <AnalysisDisplay result={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
              <div className="text-center text-slate-500">
                <div className="mx-auto bg-slate-100 rounded-full p-4 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-700">Analysis Results Will Appear Here</h3>
                <p className="mt-1 text-sm">Upload your resume and enter a job description to begin.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-6 mt-8">
        <p className="text-sm text-slate-500">Powered by Google Gemini</p>
      </footer>
    </div>
  );
}
