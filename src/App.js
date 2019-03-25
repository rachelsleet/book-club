import React from 'react';
import logo from './logo.svg';
import './App.css';

const googleAPI = "https://www.googleapis.com/books/v1/volumes?q="

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Book Club
        </header>
        <SearchBar />
        <div className="Bookshelf">
        <p>Books will go here</p>
        </div>
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      searchResults: []
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBookResults = this.getBookResults.bind(this);
  }
  handleInput(e) {
    this.setState({
      inputValue: e.target.value
    })
  }
  handleSubmit(e) {
    console.log('handling submit');
    console.log(this.state.inputValue);
    e.preventDefault();
    this.getBookResults(this.state.inputValue);
  }
  getBookResults(query) {
    let url = googleAPI + query; // + "+inauthor";
    console.log(url);
    fetch(url)
    .then(results => {return results.json()})
    .then(data => {
      console.log(data);
      this.updateResults(data);
    });
  };

  updateResults(results) {
    console.log('displaying results');
    this.setState({
      searchResults: results.items.map(item => {
        return `${item["volumeInfo"]["title"]}, by ${item["volumeInfo"]["authors"]}`
      })
    })
  }

  render() {
    return (
      <div>
      <form className="book-search" onSubmit={this.handleSubmit}>
        <input type="text" name="book" id="book" value={this.inputValue} onChange={this.handleInput}/>
        <input type="submit" value="Search"/>
      </form>
      <div className="search-results">
       <ul>{this.state.searchResults.map(result => <li>{result}</li>)}</ul>
      </div>
      </div>
    )
  }

}

export default App;
