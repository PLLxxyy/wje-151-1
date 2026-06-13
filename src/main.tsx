import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { seedData } from './utils/seed';

seedData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
