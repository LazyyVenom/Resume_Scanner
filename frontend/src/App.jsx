import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Star, BookOpen, Briefcase, Award, Settings, AlertCircle } from 'lucide-react';
import './index.css'; // Change from App.css to index.css where Tailwind directives should be

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      
      // Read file as text to display
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="mb-8">
        <motion.h1 
          className="text-3xl font-bold text-center text-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Resume Scanner & Analyzer
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Upload & Display Column */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="mr-2" size={20} />
              Resume Preview
            </h2>
            <button 
              onClick={triggerFileInput}
              className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors"
            >
              <Upload size={16} className="mr-1" />
              Upload Resume
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf,.doc,.docx,.txt"
              className="hidden" 
            />
          </div>

          {resumeFile ? (
            <div className="bg-gray-700 rounded-md p-4 h-[70vh] overflow-auto">
              <div className="mb-2 text-gray-400">
                {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
              </div>
              <pre className="whitespace-pre-wrap">{resumeText}</pre>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-md p-4 h-[70vh] flex items-center justify-center flex-col">
              <FileText size={64} className="text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">
                Upload your resume to start the analysis
              </p>
            </div>
          )}
        </motion.div>

        {/* Analysis Column */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Skills Analysis */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-green-400">
              <Star className="mr-2" size={20} />
              Skills Analysis
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>JavaScript</span>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-700 rounded-full mr-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>React</span>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-700 rounded-full mr-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>HTML/CSS</span>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-700 rounded-full mr-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-xs">90%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-gray-400 text-sm">
              <p>Suggested improvements:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Add more details about your JavaScript framework experience</li>
                <li>Include more quantifiable achievements with these skills</li>
              </ul>
            </div>
          </motion.div>

          {/* Education Analysis */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-blue-400">
              <BookOpen className="mr-2" size={20} />
              Education
            </h3>
            <ul className="space-y-2">
              <li className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium">Bachelor of Technology</p>
                <p className="text-gray-400 text-sm">Computer Science, 2019-2023</p>
              </li>
              <li className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium">Higher Secondary Education</p>
                <p className="text-gray-400 text-sm">Science Stream, 2017-2019</p>
              </li>
            </ul>
            <div className="mt-3 text-gray-400 text-sm">
              <p>Looks good! Consider adding relevant coursework.</p>
            </div>
          </motion.div>

          {/* Preferred Jobs */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-yellow-400">
              <Briefcase className="mr-2" size={20} />
              Job Matches
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between">
                  <p className="font-medium">Frontend Developer</p>
                  <span className="text-green-400">92% Match</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Your skills align well with this position.</p>
              </div>
              
              <div className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between">
                  <p className="font-medium">Full Stack Engineer</p>
                  <span className="text-yellow-400">78% Match</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Consider enhancing your backend skills.</p>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-red-400">
              <Award className="mr-2" size={20} />
              Certifications
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Web Development Bootcamp</li>
              <li>React Advanced Course</li>
            </ul>
            <div className="mt-3 text-gray-400 text-sm">
              <p>Consider adding cloud certifications to boost your profile.</p>
            </div>
          </motion.div>

          {/* Improvement Suggestions */}
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center text-purple-400">
              <Settings className="mr-2" size={20} />
              Overall Improvements
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <p>Add more quantifiable achievements to strengthen impact</p>
              </li>
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <p>Include more keywords relevant to your target positions</p>
              </li>
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <p>Consider restructuring your experience section for better readability</p>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
