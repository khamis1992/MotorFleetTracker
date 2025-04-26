import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="riderlink-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
