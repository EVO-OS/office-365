// This file contains the React component for the word processor.
import React, { useState, useEffect } from 'react';
import fs from 'fs';
const officegen = require('officegen');

const createDocx = () => {
  return officegen('docx');
};

const saveDocx = (docx, filename) => {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(filename);
    docx.generate(out);
    out.on('close', resolve);
    out.on('error', reject);
  });
};

const editDocx = (docx, content) => {
  const pObj = docx.createP();
  pObj.addText(content);
};

const WordProcessor = () => {
  const [text, setText] = useState('');
  const [docx, setDocx] = useState(null);

  useEffect(() => {
    setDocx(createDocx());
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (docx) {
      editDocx(docx, e.target.value);
    }
  };

  const handleSave = async () => {
    if (docx) {
      try {
        await saveDocx(docx, 'document.docx');
        console.log('Document saved successfully');
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
  };

  const handleBoldClick = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalicClick = () => {
    document.execCommand('italic', false, null);
  };

  const handleUnderlineClick = () => {
    document.execCommand('underline', false, null);
  };

  return (
    <div className="word-processor">
      <div className="toolbar">
        <button onClick={handleBoldClick}>Bold</button>
        <button onClick={handleItalicClick}>Italic</button>
        <button onClick={handleUnderlineClick}>Underline</button>
        <button onClick={handleSave}>Save as .docx</button>
      </div>
      <div
        className="text-area"
        contentEditable={true}
        onInput={handleTextChange}
        dangerouslySetInnerHTML={{__html: text}}
      />
    </div>
  );
};

export default WordProcessor;
