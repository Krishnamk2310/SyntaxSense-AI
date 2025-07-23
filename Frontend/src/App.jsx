import { useEffect, useState } from 'react';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

 async function reviewCode() {
  if (!code.trim()) return;
  
  setIsLoading(true);
  setAnimation(true);
  try {
    const response = await axios.post(
      'https://syntaxsense-ai.onrender.com/get-review', 
      { code }
    );
    setReview(response.data);
  } catch (error) {
    console.error("Full error:", error.response?.data || error.message);
    setReview('## Error\nUnable to get code review. Please try again.');
  } finally {
    setIsLoading(false);
    setTimeout(() => setAnimation(false), 1000);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          SyntaxSense AI
        </h1>
        <p className="text-gray-400 mt-1">Get instant AI-powered code reviews</p>
      </header>

      {/* Main Content - Full height panels */}
      <div className="flex flex-1 min-h-0 overflow-hidden"> {/* Added min-h-0 to fix flexbox overflow issues */}
        {/* Code Editor Section - Takes 50% width */}
        <div className="flex-1 flex flex-col border-r border-gray-700 overflow-hidden">
          <div className="p-2 bg-gray-700 flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="text-sm font-mono text-gray-300">editor</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-auto"> {/* Crucial: min-h-0 allows proper scrolling */}
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, "javascript")}
              padding={10}
              className="font-mono text-sm h-full w-full bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
              style={{
                minHeight: '100%',
              }}
            />
          </div>
          <div className="p-3 bg-gray-700 border-t border-gray-600 flex justify-end">
            <button
              onClick={reviewCode}
              disabled={isLoading}
              className={`relative overflow-hidden px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isLoading 
                  ? 'bg-purple-800 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
              } shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reviewing...
                </span>
              ) : (
                'Review Code'
              )}
              {animation && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-ping h-8 w-8 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Review Section - Takes 50% width */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 bg-gray-700 flex justify-between items-center">
            <h2 className="text-sm font-mono text-gray-300">REVIEW.md</h2>
            <div className="flex space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-4 prose prose-invert max-w-none bg-gray-800"> {/* Added min-h-0 */}
            {review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-center max-w-xs">
                  {isLoading ? 'Analyzing your code...' : 'Your code review will appear here'}
                </p>
                {!isLoading && (
                  <div className="mt-6 text-xs text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click "Review Code" to get started
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="20%" cy="30%" r="100" fill="url(#gradient)" className="animate-pulse opacity-30" />
          <circle cx="80%" cy="70%" r="150" fill="url(#gradient)" className="animate-pulse opacity-20 delay-300" />
        </svg>
      </div>
    </div>
  );
}

export default App;
