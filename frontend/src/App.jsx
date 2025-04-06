import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Star, BookOpen, Briefcase, Award, Settings, AlertCircle, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './index.css';

// Configure PDF.js to use local worker instead of CDN
// This is important for offline/local usage
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.2);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [pdfData, setPdfData] = useState(null); // Store PDF data as ArrayBuffer
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      setFileError(null);
      setResumeFile(file);
      
      // Check if the file is a PDF
      const isPdfFile = file.type === 'application/pdf';
      setIsPdf(isPdfFile);
      
      if (!isPdfFile) {
        // If it's not a PDF, read as text
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            setResumeText(event.target.result);
            setPdfData(null);
          } catch (error) {
            console.error("Error setting text content:", error);
            setFileError("Failed to read file content");
          }
        };
        reader.onerror = () => {
          setFileError("Failed to read file");
        };
        reader.readAsText(file);
      } else {
        // For PDF files, we need to read as ArrayBuffer
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            setResumeText('');
            setPdfData(event.target.result);
            setPageNumber(1);
          } catch (error) {
            console.error("Error setting PDF data:", error);
            setFileError("Failed to process PDF file");
          }
        };
        reader.onerror = () => {
          setFileError("Failed to read PDF file");
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error("File upload error:", error);
      setFileError("An error occurred during file upload");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setFileError(null);
        setResumeFile(file);
        
        const isPdfFile = file.type === 'application/pdf';
        setIsPdf(isPdfFile);
        
        if (!isPdfFile) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              setResumeText(event.target.result);
              setPdfData(null);
            } catch (error) {
              console.error("Error setting text content:", error);
              setFileError("Failed to read file content");
            }
          };
          reader.onerror = () => {
            setFileError("Failed to read file");
          };
          reader.readAsText(file);
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              setResumeText('');
              setPdfData(event.target.result);
              setPageNumber(1);
            } catch (error) {
              console.error("Error setting PDF data:", error);
              setFileError("Failed to process PDF file");
            }
          };
          reader.onerror = () => {
            setFileError("Failed to read PDF file");
          };
          reader.readAsArrayBuffer(file);
        }
      }
    } catch (error) {
      console.error("File drop error:", error);
      setFileError("An error occurred when processing the dropped file");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setFileError(null);
    console.log("PDF loaded successfully with", numPages, "pages");
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setFileError(`Error loading PDF: ${error.message || "Please ensure the document is a valid PDF file."}`);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const zoomIn = () => {
    setPdfScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  };

  const zoomOut = () => {
    setPdfScale(prevScale => Math.max(prevScale - 0.2, 0.7));
  };

  // Function to provide a fallback if PDF display fails
  const renderFileFallback = () => {
    if (isPdf) {
      return (
        <div className="text-center p-6">
          <FileText size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-400 mb-2">
            {fileError || "Unable to display PDF content"}
          </p>
          <p className="text-gray-400 mb-4">
            Try a different file format or check if the PDF is valid.
          </p>
          <button
            onClick={triggerFileInput}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Another File
          </button>
        </div>
      );
    }
    
    return (
      <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
        {resumeText || "No text content could be extracted from this file."}
      </pre>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-500 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-500 filter blur-3xl"></div>
      </div>
      
      <header className="mb-10 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
            Resume Scanner & Analyzer
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload your resume to get instant analysis and improvement suggestions
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Resume Upload & Display Column */}
        <motion.div 
          className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <FileText className="mr-2 text-purple-400" size={22} />
              Resume Preview
            </h2>
            <button 
              onClick={triggerFileInput}
              className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
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
            <div className="bg-gray-700 bg-opacity-60 rounded-lg p-5 h-[70vh] overflow-auto border border-gray-600 shadow-inner">
              <div className="mb-3 text-gray-300 flex items-center">
                <FileText size={16} className="mr-2 text-blue-400" />
                <span className="font-medium">{resumeFile.name}</span>
                <span className="ml-2 text-sm text-gray-400">({(resumeFile.size / 1024).toFixed(2)} KB)</span>
              </div>
              
              {fileError && (
                <div className="bg-red-900 bg-opacity-30 border border-red-800 rounded-lg p-3 mb-4 text-red-300">
                  <p className="flex items-center">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {fileError}
                  </p>
                </div>
              )}
              
              {isPdf ? (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-2 mb-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={zoomOut} 
                        className="px-2 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                        disabled={pdfScale <= 0.7}
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button 
                        onClick={zoomIn} 
                        className="px-2 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                        disabled={pdfScale >= 2.5}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className="text-sm text-gray-300">Zoom: {Math.round(pdfScale * 100)}%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        onClick={() => changePage(-1)} 
                        disabled={pageNumber <= 1}
                        className={`p-1 rounded-md ${pageNumber <= 1 ? 'text-gray-500' : 'hover:bg-gray-700'}`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="mx-2 text-sm">
                        Page {pageNumber} of {numPages || '-'}
                      </span>
                      <button 
                        onClick={() => changePage(1)} 
                        disabled={pageNumber >= numPages}
                        className={`p-1 rounded-md ${pageNumber >= numPages ? 'text-gray-500' : 'hover:bg-gray-700'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto flex justify-center bg-gray-800 rounded-lg p-4">
                    {pdfData ? (
                      <Document
                        file={pdfData}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        options={{
                          cMapUrl: 'cmaps/',
                          cMapPacked: true,
                          standardFontDataUrl: 'standard_fonts/',
                        }}
                        loading={
                          <div className="flex items-center justify-center h-full w-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                          </div>
                        }
                        error={
                          <div className="text-center p-4 text-red-400">
                            <p className="font-medium mb-2">Error loading PDF</p>
                            <p className="text-sm">{fileError || "Please ensure the document is a valid PDF file."}</p>
                            <button
                              onClick={triggerFileInput}
                              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Try Another File
                            </button>
                          </div>
                        }
                        noData={
                          <div className="text-center p-4 text-yellow-400">
                            <p className="font-medium mb-2">No PDF data available</p>
                            <p className="text-sm">The file might be empty or corrupted.</p>
                          </div>
                        }
                      >
                        {!fileError && (
                          <Page 
                            key={`page_${pageNumber}`}
                            pageNumber={pageNumber} 
                            scale={pdfScale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            error={renderFileFallback()}
                          />
                        )}
                      </Document>
                    ) : (
                      <div className="text-center p-4 text-yellow-400">
                        <p className="font-medium mb-2">Processing PDF</p>
                        <p className="text-sm">Please wait while we load your document...</p>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mt-4"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">{resumeText}</pre>
              )}
            </div>
          ) : (
            <div 
              className={`bg-gray-700 bg-opacity-40 rounded-lg p-6 h-[70vh] flex items-center justify-center flex-col border-2 border-dashed ${isDragging ? 'border-purple-500' : 'border-gray-600'} transition-colors duration-300`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <FileText size={80} className="text-gray-500 mb-5" />
              </motion.div>
              <p className="text-gray-300 text-center font-medium mb-2">
                Drag & drop your resume file here
              </p>
              <p className="text-gray-400 text-center text-sm mb-6">
                or click the upload button to browse files
              </p>
              <button 
                onClick={triggerFileInput}
                className="flex items-center bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md transition-colors text-sm"
              >
                <Upload size={14} className="mr-1" />
                Select File
              </button>
            </div>
          )}
        </motion.div>

        {/* Analysis Column */}
        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Skills Analysis */}
          <motion.div 
            className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              <Star className="mr-2 text-green-400" size={20} />
              Skills Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-200">JavaScript</span>
                <div className="flex items-center">
                  <div className="w-48 h-3 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs font-medium text-green-400">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-200">React</span>
                <div className="flex items-center">
                  <div className="w-48 h-3 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.6 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs font-medium text-green-400">75%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-200">HTML/CSS</span>
                <div className="flex items-center">
                  <div className="w-48 h-3 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 1, delay: 0.7 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs font-medium text-green-400">90%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-gray-300 text-sm p-3 bg-gray-700 bg-opacity-50 rounded-lg">
              <p className="font-medium mb-2">Suggested improvements:</p>
              <ul className="space-y-1">
                <li className="flex items-start">
                  <ChevronRight size={14} className="text-green-400 mr-1 mt-1 flex-shrink-0" />
                  <span>Add more details about your JavaScript framework experience</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={14} className="text-green-400 mr-1 mt-1 flex-shrink-0" />
                  <span>Include more quantifiable achievements with these skills</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Education Analysis */}
          <motion.div 
            className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              <BookOpen className="mr-2 text-blue-400" size={20} />
              Education
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium text-white">Bachelor of Technology</p>
                  <p className="text-gray-300 text-sm">Computer Science, 2019-2023</p>
                </div>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium text-white">Higher Secondary Education</p>
                  <p className="text-gray-300 text-sm">Science Stream, 2017-2019</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-gray-300 text-sm p-3 bg-gray-700 bg-opacity-30 rounded-lg flex items-start">
              <AlertCircle size={16} className="text-blue-400 mr-2 mt-px flex-shrink-0" />
              <p>Looks good! Consider adding relevant coursework.</p>
            </div>
          </motion.div>

          {/* Job Matches */}
          <motion.div 
            className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              <Briefcase className="mr-2 text-yellow-400" size={20} />
              Job Matches
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white">Frontend Developer</p>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white">92% Match</span>
                </div>
                <p className="text-gray-300 text-sm mt-2">Your skills align well with this position.</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white">Full Stack Engineer</p>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500 to-amber-600 text-white">78% Match</span>
                </div>
                <p className="text-gray-300 text-sm mt-2">Consider enhancing your backend skills.</p>
              </div>
            </div>
          </motion.div>

          {/* Certifications & Improvement Suggestions (Combined) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certifications */}
            <motion.div 
              className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700"
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
                <Award className="mr-2 text-red-400" size={20} />
                Certifications
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-gray-200">Web Development Bootcamp</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-gray-200">React Advanced Course</span>
                </li>
              </ul>
              <div className="mt-4 text-gray-300 text-sm p-3 bg-gray-700 bg-opacity-30 rounded-lg flex items-start">
                <AlertCircle size={14} className="text-red-400 mr-2 mt-px flex-shrink-0" />
                <p>Consider adding cloud certifications to boost your profile.</p>
              </div>
            </motion.div>

            {/* Improvement Suggestions */}
            <motion.div 
              className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700"
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                <Settings className="mr-2 text-purple-400" size={20} />
                Improvements
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start">
                  <AlertCircle size={14} className="text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-200 text-sm">Add more quantifiable achievements</p>
                </li>
                <li className="flex items-start">
                  <AlertCircle size={14} className="text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-200 text-sm">Include more relevant keywords</p>
                </li>
                <li className="flex items-start">
                  <AlertCircle size={14} className="text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-200 text-sm">Improve experience section structure</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 text-sm relative z-10">
        <p>© {new Date().getFullYear()} Resume Scanner & Analyzer | Enhance your job application process</p>
      </footer>
    </div>
  );
}

export default App;
