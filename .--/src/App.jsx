import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Axios from 'axios';
import Select from 'react-select';
import useKeyPress from './useKeyPress';
import './App.css';

const App = () => {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState({ value: 'python', label: 'Python' });
  const [theme, setTheme] = useState('vs-dark');
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const enterPress = useKeyPress('Enter');
  const ctrlPress = useKeyPress('Control');

  const languages = [{ value: 'python', label: 'Python' }];
  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];
  const templates = [
    { value: 'hello', label: 'Hello World', code: 'print("Hello, World!")' },
    { value: 'loop', label: 'For Loop', code: 'for i in range(5):\n    print(i)' },
    { value: 'input', label: 'User Input', code: 'name = input("Enter your name: ")\nprint("Hello, " + name)' },
  ];

  const tips = [
    "Use print() to display output.",
    "Use input() to get user input.",
    "Indent your code with 4 spaces."
  ];

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await Axios.post('https://coding-editor-backend.onrender.com/execute', {
        code,
        language: language.value,
        input,
      });
      setOutput(response.data.output || response.data.error);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleTemplateChange = (selected) => {
    setCode(selected.code);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleRun();
    }
  }, [enterPress, ctrlPress]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>LearnCode</h1>
        <div className="navbar-controls">
          <Select
            options={languages}
            value={language}
            onChange={setLanguage}
            className="select"
          />
          <Select
            options={themes}
            value={themes.find((t) => t.value === theme)}
            onChange={(e) => setTheme(e.value)}
            className="select"
          />
          <Select
            options={templates}
            onChange={handleTemplateChange}
            placeholder="Select Template"
            className="select"
          />
          <button
            onClick={handleRun}
            className="run-button"
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={() => setShowTips(!showTips)}
            className="tips-button"
          >
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>
      </nav>
      <div className="main-content">
        <div className="editor-container">
          <Editor
            height="80vh"
            language={language.value}
            theme={theme}
            value={code}
            onChange={(value) => setCode(value)}
            options={{ fontSize: 16 }}
          />
        </div>
        <div className="io-container">
          {showTips && (
            <div className="tips-section">
              <h2>Coding Tips</h2>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="input-section">
            <h2>Input</h2>
            <textarea
              className="input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program"
            />
          </div>
          <div className="output-section">
            <h2>Output</h2>
            <pre className="output-pre">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;