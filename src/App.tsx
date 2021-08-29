import React from 'react';
import ReactPlayer from 'react-player'
import './App.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <ReactPlayer
        url='https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4'
        controls={true}
      />
    </div>
  );
}

export default App;
