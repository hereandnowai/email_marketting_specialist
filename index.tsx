
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// The API_KEY must be set in the environment prior to running the application.
// The application will use process.env.API_KEY directly.
// If it's not set or invalid, the geminiService or API calls will handle the error.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);