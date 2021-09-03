import React from 'react';
import RemoteConfigProvider from '../providers/remoteConfigProvider';
import MainLayout from './MainLayout';

import './App.css';

function App() {
  return (
    <RemoteConfigProvider>
      <MainLayout />
    </RemoteConfigProvider>
  );
}

export default App;
