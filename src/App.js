import React from 'react';
import logo from './logo.svg';
import './App.css';

const googleAPI = "https://www.googleapis.com/books/v1/volumes?langRestrict=en&q="

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookShelf : []
    }
    this.addToBookShelf = this.addToBookShelf.bind(this);
  }

  addToBookShelf(bookId) {
    console.log('adding' + bookId + '!');
    let url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    fetch(url)
    .then(results => {return results.json()})
    .then(data => {
      console.log([...this.state.bookShelf, data]);
      this.setState({
        bookShelf : [...this.state.bookShelf, data]
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Book Club
        </header>
        <SearchBar addBookToShelf={this.addToBookShelf}/>
        <Bookshelf books={this.state.bookShelf}/>
      </div>
    );
  }
}

class Bookshelf extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="book-shelf">
      {this.props.books[0] ? this.props.books.map(book => {return <Book data={book}/>}) : 'Your shelf is empty!'}
      </div>
    )
  }
}

const Book = (props) => {
  console.log(props);
  return (
    <div className = "book">
      <img src={props.data.volumeInfo.imageLinks.thumbnail} alt={props.data.volumeInfo.title}/>
    </div>
  )
}


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      searchResultsFull: [],
      searchResultsToDisplay: []
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBookResults = this.getBookResults.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.handleSelection = this.handleSelection.bind(this);

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
      searchResultsToDisplay: results.items.map(item => {
        return `${item["volumeInfo"]["title"]}, by ${item["volumeInfo"]["authors"]}`
      }),
      searchResultsFull: results.items.map(item => {
        return item.id
      })
    })
  }

  handleSelection(e) {
    let bookId = this.state.searchResultsFull[e.currentTarget.id];
    this.props.addBookToShelf(bookId);
    this.setState({
      searchResultsFull: [],
      searchResultsToDisplay: []
    })
  }

  render() {
    return (
      <div className="search-bar dropdown">
      <form className="book-search" onSubmit={this.handleSubmit}>
        <input type="text" name="book" id="book" value={this.inputValue} onChange={this.handleInput}/>
        <input type="submit" value="Search"/>
      </form>
      <div className="search-results">
       <ul>{this.state.searchResultsToDisplay.map((result,index) => <li><button type="button" id={index} onClick={this.handleSelection}>{result}</button></li>)}</ul>
      </div>
      </div>
    )
  }

}

export default App;
