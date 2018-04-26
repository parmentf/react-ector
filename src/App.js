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

class Entry extends Component {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <label>Entry:</label>
        <input
          type="text"
          autoFocus
          onKeyUp={this.props.onKeyUp}/>
      </div>
    );
  }
}

class User extends Component {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <label>Name:</label>
        <input
          type="text"
          value={this.props.name}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

class App extends Component {
  state = {
    username: 'François',
    entries: [{
      utterer: 'ECTOR',
      value: 'Hello you!'
    }, {
      utterer: 'François',
      value: 'Hello ECTOR!'
    }]
  }

  addEntry(entry) {
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

  changeUser = event => {
    const username = event.target.value;
    this.setState({username});
  }

  treatEntry = event => {
    if(event.keyCode === 13) {
      this.addEntry(event.target.value)
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
