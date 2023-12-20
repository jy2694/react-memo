import './App.css';
import MainPage from './pages/MainPage';
import defaultBackground from './images/login-background.jpg';
import { useEffect, useState } from 'react';
import { getBackground, saveBackground } from './storage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  const [background, setBackground] = useState(null);
  const [color, setColor] = useState("rgb(0 0 0)");

  useEffect(() => {
    const file = getBackground();
    if (file !== null) {
      var img = new Image();
      img.addEventListener('load', () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        sumR += data[0];
        sumG += data[1];
        sumB += data[2];
        setColor("rgb(" + (255 - sumR) + " " + (255 - sumG) + " " + (255 - sumB) + ")");
      });
      img.src = file;
      setBackground(file);
    }
  })

  const onBackgroundChange = (base64) => {
    var img = new Image();
    img.addEventListener('load', () => {
      var ctx = document.createElement("canvas");
      ctx.width = img.width * 0.2;
      ctx.height = img.height * 0.2;
      var canvas = ctx.getContext("2d");
      canvas.drawImage(img, 0, 0, img.width * 0.2, img.height * 0.2);
      saveBackground(ctx.toDataURL());
    });
    img.src = base64;
    setBackground(base64);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="App-header" style={background === null || background === undefined ? { backgroundImage: `url(${defaultBackground})`, color: color } : { backgroundImage: "url(" + background + ")", color: color }}>
      <MainPage onBackgroundChange={onBackgroundChange} color={color} />
      </div>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
