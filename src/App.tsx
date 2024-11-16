// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HomePage } from './pages/HomePage';
import { DestinationDetail } from './pages/DestinationDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/destination/:cityName"
            element={<DestinationDetail />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
