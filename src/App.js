import React, { Component } from 'react';
import logo from './Robot.svg';
import './App.css';

const backend = process.env.REACT_APP_BACKEND || 'http://localhost:5000';

const PastEntries = ({list}) => (
  <ul style={{textAlign: 'left'}}>
    {list
      .sort((a, b) => a.created - b.created)
      .reverse()
      .slice(0,10)
      .map((entry, i) => (
      <li key={i}>{entry.utterer}: {entry.value}</li>
    ))}
    {list.length > 10 &&
      <li>...</li>
    }
  </ul>
);

const Entry = ({onKeyUp}) => (
  <div style={{display: 'inline-block'}}>
    <label>Entry:</label>
    <input
      type="text"
      size="50"
      autoFocus
      onKeyUp={onKeyUp}/>
  </div>
);

const User = ({name, onChange}) => (
  <div style={{display: 'inline-block'}}>
    <label>Name:</label>
    <input
      type="text"
      size="10"
      value={name}
      onChange={onChange}
    />
  </div>
);

class App extends Component {
  state = {
    username: 'François',
    entries: [{
      utterer: 'ECTOR',
      value: 'Hello you!',
      created: new Date()
    }]
  }

  addEntry(entry, utterer = this.state.username) {
    this.setState({
      entries: [
        ...this.state.entries,
        {
          utterer,
          value: entry,
          created: new Date()
        }
      ]
    })
  }

  changeUser = event => {
    const username = event.target.value;
    this.setState({username});
  }

  treatEntry = event => {
    if(event.keyCode === 13) {
      this.addEntry(event.target.value);
      const backendURL = `${backend}/v1/reply/${this.state.username}/${encodeURIComponent(event.target.value)}`;
      fetch(backendURL, {
        mode: 'cors'
      })
      .then(response => response.json())
      .then(json => {
        this.addEntry(json.sentence, 'ECTOR');
      });
      event.target.value = '';
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">ECTOR the Chatterbotor</h1>
        </header>

        <User onChange={this.changeUser} name={this.state.username} />
        <Entry onKeyUp={this.treatEntry} />
        <PastEntries list={this.state.entries}/>
      </div>
    );
  }
}

export default App;
