import React from 'react';
// import ReactPlayer from 'react-player'
import MainLayout from './MainLayout';
import './App.css';

function App() {
  return (
    <div className="App" >
      {/* <ReactPlayer
        url='https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4'
        controls={true}
      /> */}
      <MainLayout list={["Title 1", "Title 2", "Title 3", "Title 4", 'Title 5', 'Title 6', 'Title 7']} />
    </div>
  );
}

export default App;
