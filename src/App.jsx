import { useState, useEffect } from 'react';

const App = () => {
  // Initialize state from local storage if available
  const [columns, setColumns] = useState(() => JSON.parse(localStorage.getItem('columns')) || []);
  const [rows, setRows] = useState(() => JSON.parse(localStorage.getItem('rows')) || []);
  const [filter, setFilter] = useState({ colName: '', filterValue: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Effect to store columns and rows in local storage whenever they change
  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
    localStorage.setItem('rows', JSON.stringify(rows));
  }, [columns, rows]);

  const addColumn = (name, type) => {
    setColumns([...columns, { name, type }]);
    setRows(rows.map(row => ({ ...row, [name]: type === 'string' ? [''] : [0] })));
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col.name] = col.type === 'string' ? [''] : [0];
    });
    setRows([...rows, newRow]);
  };

  const updateCell = (rowIndex, colName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colName] = value;
    setRows(updatedRows);
  };

  const handleFilterChange = (colName, filterValue) => {
    setFilter({ colName, filterValue });
  };

  const clearFilter = () => {
    setFilter({ colName: '', filterValue: '' });
  };

  const filteredRows = rows.filter(row =>
  !filter.colName || row[filter.colName].some(val => Array.isArray(val) || typeof val === 'string' ? val.includes(filter.filterValue) : false)
);


  const sortRows = (colName, direction) => {
    const sortedRows = [...rows].sort((a, b) => {
      const valueA = a[colName][0];
      const valueB = b[colName][0];
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else if (direction === 'desc') {
        return valueA < valueB ? 1 : -1;
      }
      return 0;
    });
    setRows(sortedRows);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dynamic Table with Local Storage</h1>

      {/* Add Column */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Column Name"
          id="columnName"
          className="border p-2 mr-2"
        />
        <select id="columnType" className="border p-2 mr-2">
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button
          onClick={() =>
            addColumn(
              document.getElementById('columnName').value,
              document.getElementById('columnType').value
            )
          }
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add Column
        </button>
      </div>

      {/* Add Row */}
      <button
        onClick={addRow}
        className="bg-green-500 text-white px-4 py-2 mb-4"
      >
        Add Row
      </button>

      {/* Table */}
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.name} className="border px-4 py-2">
                {col.name}
                {col.type === 'number' && (
                  <div>
                    <button
                      onClick={() => sortRows(col.name, 'asc')}
                      className="text-sm text-gray-500"
                    >
                      Sort Asc
                    </button>
                    <div>
                      
                    </div>
                    <button
                      onClick={() => sortRows(col.name, 'desc')}
                      className="text-sm text-gray-500"
                    >
                      Sort Desc
                    </button>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => (
                <td key={col.name} className="border px-4 py-2">
                  <input
                    type={col.type === 'string' ? 'text' : 'number'}
                    value={row[col.name].join(', ')}
                    onChange={e =>
                      updateCell(
                        rowIndex,
                        col.name,
                        e.target.value.split(',').map(item => item.trim())
                      )
                    }
                    className="border p-1 w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Filter */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Filter value"
          onChange={e =>
            handleFilterChange(document.getElementById('filterCol').value, e.target.value)
          }
          className="border p-2 mr-2"
        />
        <select id="filterCol" className="border p-2 mr-2">
          {columns.map(col => (
            <option key={col.name} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
        <button
          onClick={clearFilter}
          className="bg-red-500 text-white px-4 py-2 ml-2"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default App;
