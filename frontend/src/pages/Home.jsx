import { useState } from 'react';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file to display in the iframe
      setResume(URL.createObjectURL(file));
      
      // Here you would typically send the file to your backend for processing
      // and then get feedback back
      // For now, let's just set some example feedback
      setFeedback({
        score: 85,
        strengths: ['Clear formatting', 'Relevant experience', 'Good skills section'],
        improvements: ['Add more quantifiable achievements', 'Tailor to specific job']
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Resume Scanner</h1>
        
        {/* File Upload Section */}
        <div className="mb-6">
          <label 
            htmlFor="resumeUpload" 
            className="block w-full p-4 text-center border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition duration-300"
          >
            <span className="text-lg font-medium text-blue-500">Upload your resume</span>
            <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOCX</p>
            <input 
              id="resumeUpload" 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,.docx"
            />
          </label>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Display Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-500 text-white font-medium">
              Resume Preview
            </div>
            <div className="p-4 min-h-[500px] flex items-center justify-center">
              {resume ? (
                <iframe
                  src={resume}
                  className="w-full h-[500px] border-0"
                  title="Resume Preview"
                ></iframe>
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-12 w-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="mt-2">Upload a resume to see preview</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Feedback Display Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-green-500 text-white font-medium">
              Resume Feedback
            </div>
            <div className="p-4 min-h-[500px]">
              {feedback ? (
                <div>
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
                      <div className="text-3xl font-bold text-blue-600">{feedback.score}</div>
                      <div className="ml-2 text-sm text-gray-600">/ 100</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-green-600 mb-2">Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-amber-600 mb-2">Areas for Improvement</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.improvements.map((improvement, index) => (
                        <li key={index} className="text-gray-700">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-400">
                  <div>
                    <svg className="mx-auto h-12 w-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <p className="mt-2">Upload a resume to get feedback</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;