import React, { Component } from 'react';
import logo from './Robot.svg';
import './App.css';

class PastEntries extends Component {
  render() {
    return (
      <ul style={{textAlign: 'left'}}>
        {this.props.list.reverse().slice(0,10).map((entry, i) => (
          <li key={i}>{entry.utterer}: {entry.value}</li>
        ))}
        {this.props.list.length > 10 &&
          <li>...</li>
        }
      </ul>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: 'François',
      entries: [{
        utterer: 'ECTOR',
        value: 'Hello you!'
      }, {
        utterer: 'François',
        value: 'Hello ECTOR!'
      }]
    }
  }

  addEntry (entry) {
    this.setState({
      entries: [
        ...this.state.entries,
        {
          utterer: this.state.username,
          value: entry,
          created: new Date()
        }
      ]
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">ECTOR the Chatterbotor</h1>
        </header>
        <div>
          <label>Entry:</label>
          <input type="text" onKeyUp={e => {
            if(e.keyCode === 13) {
              this.addEntry(e.target.value)
              e.target.value = '';
            }
          }}/>
        </div>
        <PastEntries list={this.state.entries}/>
      </div>
    );
  }
}

export default App;
