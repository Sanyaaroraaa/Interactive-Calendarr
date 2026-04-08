import React from 'react';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import './App.css';

const App = () => (
  <AppProvider>
    <Home />
  </AppProvider>
);

export default App;