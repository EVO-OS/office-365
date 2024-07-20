import React, { useState } from 'react';

const AdvancedPeaceMode = () => {
  const [theme, setTheme] = useState('light');
  const [distractionFree, setDistractionFree] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [ambient, setAmbient] = useState(false);

  const toggleDistractionFree = () => {
    setDistractionFree(!distractionFree);
  };

  const toggleNightMode = () => {
    setNightMode(!nightMode);
    setTheme(nightMode ? 'light' : 'dark');
  };

  const toggleAmbient = () => {
    setAmbient(!ambient);
  };

  return (
    <div className={`advanced-peace-mode ${theme}`}>
      <button onClick={toggleDistractionFree}>
        {distractionFree ? 'Disable' : 'Enable'} Distraction-Free Mode
      </button>
      <button onClick={toggleNightMode}>
        {nightMode ? 'Disable' : 'Enable'} Night Mode
      </button>
      <button onClick={toggleAmbient}>
        {ambient ? 'Disable' : 'Enable'} Ambient Sounds/Visuals
      </button>
    </div>
  );
};

export default AdvancedPeaceMode;
