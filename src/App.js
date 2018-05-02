import React, { Component } from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink } from 'react-vis-force';
import logo from './Robot.svg';
import './App.css';

const backend = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
const cnURL = `${backend}/v1/concept-network`;

class ConceptNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cn: {},
      cns: {},
      stateURL: `${backend}/v1/concept-network-state/${props.username}`
    }

    fetch(this.state.stateURL)
    .then(response => response.json())
    .then(json => {
      return this.setState({
        ...this.state,
        cns: json
      });
    })

    fetch(cnURL)
    .then(response => response.json())
    .then(json => {
      return this.setState({
        ...this.state,
        cn: json
      })
    });
  }

  render() {
    const { cn, cns } = this.state;
    const ready = Object.keys(cn).length && Object.keys(cns).length;
    console.log(cn, cns)
    return (
      ready &&
      <InteractiveForceGraph
        zoom
        simulationOptions={{ height: 300, width: 450, animate: true }}
        labelAttr="label" showLabels
        highlightDependencies
      >
        {Object.keys(cn.node)
          .map(id => {
            const { label, occ } = cn.node[id];
            return <ForceGraphNode
              key={id}
              node={{
                id,
                label: label.slice(1),
                weight: occ
              }}
              fill={
                label.startsWith('w')
                ? "red"
                : "blue"}
            />
          })
        }
        {Object.keys(cn.link)
          .map(linkId => {
            const { fromId, toId, coOcc } = cn.link[linkId];
            return <ForceGraphArrowLink key={linkId} link={{ source: fromId, target: toId, weight: coOcc }} />
          })

        }
      </InteractiveForceGraph>
    );
  }
}

const PastEntries = ({list}) => (
  <ul style={{ textAlign: 'left' }}>
    {list
      .sort((a, b) => a.created - b.created)
      .reverse()
      .slice(0,10)
      .map((entry, i) => (
      <li
        key={i}
        style={{backgroundColor: (entry.utterer === 'ECTOR' ? '#F8F8F8' : 'white')}}
      >{entry.utterer}: {entry.value}</li>
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
        <ConceptNetwork username={this.state.username} />
      </div>
    );
  }
}

export default App;
