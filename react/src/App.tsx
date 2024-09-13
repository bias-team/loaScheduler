// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Home from './components/Home';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#121212' : '#f0f0f0',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 5%',
        boxSizing: 'border-box',
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};



const App: React.FC = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <ThemeProvider>
      <DndProvider backend={backend}>
        <AppContent />
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;