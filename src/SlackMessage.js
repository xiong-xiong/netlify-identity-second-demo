import React, { Component } from 'react';
import netlifyIdentity from "netlify-identity-widget"

class SlackMessage extends Component {
    constructor(props) {
      super(props);
      this.state = {loading: false, text: null, error: null, success: false};
    }
    generateHeaders() {
      const headers = { "Content-Type": "application/json" };
      if (netlifyIdentity.currentUser()) {
        return netlifyIdentity.currentUser().jwt().then((token) => {
          return { ...headers, Authorization: `Bearer ${token}` };
        })
      }
      return Promise.resolve(headers);
    }
  
    handleText = (e) => {
      this.setState({text: e.target.value});
    };
   handleSubmit = (e) => {
    e.preventDefault();
  
      this.setState({ loading: true });
      // Make sure we use the right headers when sending to slack.js
      this.generateHeaders().then((headers) => {
        fetch('/.netlify/functions/slack', {
          method: "POST",
          headers,
          body: JSON.stringify({
            text: this.state.text
          })
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {throw(err)});
          }
        })
        .then(() => this.setState({loading: false, text: null, success: true, error: null}))
        .catch(err => this.setState({loading: false, success: false, error: err.toString()}))
      });
    }
    render() {
      const {loading, text, error, success} = this.state;
      return <form onSubmit={this.handleSubmit}>
        {error && <p><strong>Error sending message: {error}</strong></p>}
        {success && <p><strong>Done! Message sent to Slack</strong></p>}
        <p>
          <label>Your Message: <br/>
            <textarea onChange={this.handleText} value={text}></textarea>
          </label>
        </p>
        <p>
          <button type="submit" disabled={loading}>{loading ? "Sending Slack Message..." : "Send a Slack Message"}</button>
        </p>
      </form>;
    }
  }
  export default SlackMessage;