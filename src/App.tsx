import React, { useEffect, useState } from 'react';
import gpu_data from './gpu_data.json'
import Select, { SingleValue } from 'react-select';
import uuid from 'react-uuid';
import { Analytics } from '@vercel/analytics/react';

type Option = {
  value: string,
  label: string
}

type TableRow = {
  id: string,
  name: string,
  score: number,
  price: number,
  value: number
}

const values: Option[] = [];

gpu_data.forEach(datum => values.push({value: datum.Benchmark.toString(), label: datum.Model}));

function App() {
  const [currentSelectionModel, setCurrentSelectionModel] = useState<string>("");
  const [currentSelectionScore, setCurrentSelectionScore] = useState<number>(0);
  const [currentSelectionPrice, setCurrentSelectionPrice] = useState<number>(0);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

  const tableRowsComponents = tableRows.map(row => <TableRowComponent key={row.id} row={row} deleteRow={removeGPU} />);

  useEffect(() => {
    if (localStorage.table)
      setTableRows(JSON.parse(localStorage.table));
  }, []);

  const onSelected = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setCurrentSelectionModel(selectedOption.label);
      setCurrentSelectionScore(parseFloat(selectedOption.value));
    }
  };

  const onChangePrice = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.currentTarget.value);
    setCurrentSelectionPrice(newValue);
  }

  function addSelectedGPU() {
    if (currentSelectionModel === "")
      return;
    if (Number.isNaN(currentSelectionScore) || currentSelectionScore === 0)
      return;
    if (Number.isNaN(currentSelectionPrice) || currentSelectionPrice === 0)
      return;
    const newRow: TableRow = {id: uuid(),
                              name: currentSelectionModel,
                              score: currentSelectionScore,
                              price: currentSelectionPrice,
                              value: currentSelectionScore/currentSelectionPrice*100};      
    const newRows = [...tableRows, newRow].sort((a, b) => b.value - a.value);
    setTableRows(newRows);

    localStorage.setItem("table", JSON.stringify(newRows));
  }

  function removeGPU(id: string) {
    setTableRows(tableRows.filter(row => row.id !== id));
  }

  return (
    <div id="main">
      <section className="hero is-link">
        <div className="hero-body">
          <p className="title">
            Used GPU Value
          </p>
          <p className="subtitle">
            Compare used graphics cards performace per dollar
          </p>
        </div>
      </section>
      <div className="container is-max-desktop">
        <section className="m-2">
          <div className="box">
            <div className="field">
              <label className="label">Model</label>
              <div className="control">
                <Select options={values} onChange={onSelected} />
              </div>
            </div>
            <div className="field">
              <label className="label">Price</label>
              <div className="control has-icons-right">
                <input onChange={onChangePrice} className="input" type="text" placeholder="150.00" />
                <span className="icon is-right">
                  $
                </span>
              </div>
            </div>
            <div className="control">
              <button onClick={addSelectedGPU} className="button is-link is-fullwidth">Add GPU</button>
            </div>
          </div>
        </section>
        <section className="box m-2">
          <center className="has-text-weight-bold">ValueTable™</center>
          <hr className="my-2"/>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>GPU</th>
                <th>Score</th>
                <th>Price</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableRowsComponents}
            </tbody>
          </table>
        </section>
        <section className="box m-2 content">
          <h3>How to use</h3>
          <ul>
            <li>Select the model of the GPU you found online for sale</li>
            <li>Insert the price it's being sold for</li>
            <li>Click "Add GPU" to add it to the list of GPUs you would like to compare</li>
            <li>The higher the value the better the deal is</li>
            <li>You can close the website and come back, the table is saved</li>
            <li>Good luck :)</li>
          </ul>
        </section>
        <section className="box m-2 content">
          <h3>Stuff to keep in mind</h3>
          <ul>
            <li>Value is <code>(score / price) * 100</code></li>
            <li>Keep in mind that the more powerful the graphics card is, the more power it will consume</li>
            <li>Prefer newer cards</li>
            <li>Choose the graphics card with the highest score, all else being equal</li>
            <li>Score data is from <a href="https://www.userbenchmark.com/page/developer" target="_blank" rel="noopener noreferrer">Userbenchmark</a></li>
          </ul>
        </section>
      </div>
      <a id="twitter-button" className="button is-link is-pulled-right" href="https://twitter.com/Atovange" target="_blank" rel="noopener noreferrer">
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg>
        </span>
        <span>@Atovange</span>
      </a>
      <Analytics />
    </div>
  );
}

function TableRowComponent ({row, deleteRow}: {row: TableRow, deleteRow: Function}) {
  return (
    <tr>
      <td>{row.name}</td>
      <td>{row.score.toString()}</td>
      <td>${row.price.toFixed(2)}</td>
      <td className="has-background-success has-text-light has-text-weight-bold">{row.value.toFixed(3)}</td>
      <td><button onClick={() => deleteRow(row.id)} className="delete"></button></td>
    </tr>
  )
}

export default App;
