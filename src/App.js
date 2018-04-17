import React, { Component } from 'react';
import netlifyIdentity from "netlify-identity-widget"
import SlackMessage from "./SlackMessage"

import './App.css';




class App extends Component {
  componentDidMount() {
    netlifyIdentity.init();
  }
  handleIdentity = (e) => {
    e.preventDefault();
    netlifyIdentity.open();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Slack Messenger</h1>
        </header>
        <p><a href="#" onClick={this.handleIdentity}>User Status</a></p>
        <SlackMessage />
      </div>
    );
  }
}
export default App;
