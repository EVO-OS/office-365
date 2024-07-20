// This file contains the React component for the spreadsheet with xlsx support.
import React, { useState, useCallback, useEffect } from 'react';
import { evaluateFormula } from './formula_module';
import * as xlsx from 'xlsx';

const Spreadsheet = () => {
  const [workbook, setWorkbook] = useState(xlsx.utils.book_new());
  const [currentSheet, setCurrentSheet] = useState(xlsx.utils.aoa_to_sheet([[]]));
  const [sheetNames, setSheetNames] = useState(['Sheet1']);
  const [activeSheet, setActiveSheet] = useState('Sheet1');

  useEffect(() => {
    xlsx.utils.book_append_sheet(workbook, currentSheet, 'Sheet1');
    setWorkbook({...workbook});
  }, []);

  const updateCell = useCallback((row, col, value) => {
    const cellAddress = xlsx.utils.encode_cell({r: row, c: col});
    currentSheet[cellAddress] = {v: value, t: typeof value === 'number' ? 'n' : 's'};
    setCurrentSheet({...currentSheet});
  }, [currentSheet]);

  const addSheet = useCallback(() => {
    const newSheetName = `Sheet${sheetNames.length + 1}`;
    xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet([[]]), newSheetName);
    setWorkbook({...workbook});
    setSheetNames([...sheetNames, newSheetName]);
    setActiveSheet(newSheetName);
  }, [workbook, sheetNames]);

  const switchSheet = useCallback((sheetName) => {
    setCurrentSheet(workbook.Sheets[sheetName]);
    setActiveSheet(sheetName);
  }, [workbook]);

  const saveXlsx = useCallback(() => {
    xlsx.writeFile(workbook, 'spreadsheet.xlsx');
  }, [workbook]);

  const getCellValue = useCallback((row, col) => {
    const cellAddress = xlsx.utils.encode_cell({r: row, c: col});
    return currentSheet[cellAddress] ? currentSheet[cellAddress].v : '';
  }, [currentSheet]);

  const renderCell = useCallback((row, col) => {
    const cellValue = getCellValue(row, col);
    const displayValue = typeof cellValue === 'string' && cellValue.startsWith('=')
      ? evaluateFormula(cellValue.slice(1), getCellValue)
      : cellValue;

    return (
      <input
        key={`${row}-${col}`}
        value={cellValue}
        onChange={(e) => updateCell(row, col, e.target.value)}
        onBlur={() => {
          if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
            updateCell(row, col, evaluateFormula(cellValue.slice(1), getCellValue));
          }
        }}
      />
    );
  }, [getCellValue, updateCell]);

  return (
    <div className="spreadsheet">
      <div className="toolbar">
        <button onClick={addSheet}>Add Sheet</button>
        <button onClick={saveXlsx}>Save as .xlsx</button>
        {sheetNames.map(name => (
          <button key={name} onClick={() => switchSheet(name)} disabled={name === activeSheet}>
            {name}
          </button>
        ))}
      </div>
      <div className="grid">
        {Array.from({length: 10}, (_, row) => (
          <div key={row} className="row">
            {Array.from({length: 10}, (_, col) => renderCell(row, col))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spreadsheet;
