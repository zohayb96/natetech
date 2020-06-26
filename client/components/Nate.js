import React, { Component } from 'react';

class Nate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      history: [],
      text: {},
      wordDict: {},
      testPassed: 0,
      historyObj: [],
    };

    // Bind Functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadPreviousHistory = this.loadPreviousHistory.bind(this);
  }

  // Handles changes in form input
  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log(this.state.value);
  }

  // Loads previous history/ called on button click passing in particular row link in history
  loadPreviousHistory(item) {
    var temp;
    Object.values(this.state.historyObj).forEach(function (value) {
      if (value.hasOwnProperty(item)) {
        temp = value[item];
      }
    });
    this.setState({ wordDict: temp });
  }

  // Submit form
  handleSubmit(event) {
    this.setState({ history: [...this.state.history, this.state.value] });
    this.convertUrl(this.state.value);
    event.preventDefault();
  }

  // Convert text from URL
  convertUrl(url) {
    // proxy required to prevent Cors no access policy
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.text())
      .then((contents) => this.countOccurences(contents))
      .catch(() => console.log('Can’t access '));
  }

  // Algorithm to count occurences of words
  countOccurences(content) {
    if (content !== null) {
      let wordTokens = content.split(/\W+/);
      let wordDictionary = {};
      // iterate through all words
      for (var i = 0; i < wordTokens.length; i++) {
        var currentWord = wordTokens[i];
        if (wordDictionary.hasOwnProperty(currentWord)) {
          wordDictionary[currentWord]++;
        } else {
          wordDictionary[currentWord] = 1;
          // used to flag function is working and results are being loaded
          this.setState({ testPassed: 1 });
        }
      }
      this.checkEmpty(wordDictionary);
      this.setState({ wordDict: wordDictionary });
      console.log(wordDictionary);
      let historyObject = {};
      // save new object with pair of link and saved data
      historyObject[this.state.value] = wordDictionary;
      this.setState({ historyObj: [...this.state.historyObj, historyObject] });
    }
  }

  checkEmpty(wordDic) {
    if (Object.entries(wordDic).length !== 0) {
      this.setState({ testPassed: 2 });
    }
  }

  // Front end render
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            URL:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {/* print history for reuse */}
        {this.state.history.length !== 0 ? (
          this.state.history
            .reverse()
            .slice(0, 5)
            .map((item, i) => (
              <div>
                <li key={i}>{item}</li>
                <button onClick={() => this.loadPreviousHistory(item)}>
                  Load History
                </button>
              </div>
            ))
        ) : (
          <div> No History</div>
        )}
        {/* {this.state.testPassed === 0 ? (
          <p>No Results:</p>
        ) : this.state.testPassed === 1 ? (
          <p>Loading...:</p>
        ) : (
          <p>Results:</p>
        )} */}
        <ul>
          {this.state.wordDict.length !== 0 ? (
            Object.entries(this.state.wordDict).map(([key, value]) => (
              <li key={key}>
                {key} : {value.toString()}
              </li>
            ))
          ) : (
            <li>No Results</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Nate;
