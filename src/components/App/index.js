import React from 'react';
import './App.css';

const googleAPI = "https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=";
const stockImage = "https://images.unsplash.com/photo-1549758225-5835373bcbc3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=738&q=80";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookShelf : [] // books stored here
    }
    this.addToBookShelf = this.addToBookShelf.bind(this);
  }

  addToBookShelf(book) { // triggered by selecting a search result from the SearchBar component
      this.setState({
        bookShelf : [...this.state.bookShelf, book]
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

class Bookshelf extends React.Component { // receives books array as props
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

class Book extends React.Component {
  constructor(props) {
    super(props);

    let volumeInfo = this.props.data.volumeInfo;

    let blurbContent = `<i class="fas fa-times"></i><h3>${volumeInfo.title}${volumeInfo.subtitle ? ` -<br>${volumeInfo.subtitle}` : ''}</h3><h4>by ${volumeInfo.authors}</h4><br>Publication date: ${volumeInfo.publishedDate}<br><br>${volumeInfo.description}`;

    let coverDiv = <div className = "cover"><img src={Object.keys(volumeInfo).includes("imageLinks") ? volumeInfo.imageLinks.thumbnail : stockImage} alt={volumeInfo.title}/></div>;

    let coverAndBlurbDiv = <div>{coverDiv}<div className = "blurb" dangerouslySetInnerHTML = {{__html: blurbContent}} /></div>;

    this.state = {
      coverDiv: coverDiv,
      coverAndBlurbDiv: coverAndBlurbDiv,
      displayCoverOnly: true // display cover only by default
    }

    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleDisplay() {
    this.setState({
      displayCoverOnly: !this.state.displayCoverOnly
    });
  }

  render() {
    return (
      <div className = {this.state.displayCoverOnly ? "book-cover" : "book-full"} onClick={this.toggleDisplay}>
        {this.state.displayCoverOnly ? this.state.coverDiv : this.state.coverAndBlurbDiv}
      </div>
    )
  }
}


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    //let thumbnailImg = <img src={result[1]} className="thumbnail"/>;

    this.state = {
      userInputValue: '',
      searchResultsFull: [], // array with objects w/ keys id, volumeInfo (obj with keys title...)
      currentlyExpanded: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBookResults = this.getBookResults.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.expandSelection = this.expandSelection.bind(this);
    this.handleFinalSelection = this.handleFinalSelection.bind(this);
    this.displayResults = this.displayResults.bind(this);
  }

  handleInput(e) { //updates state as user types (override default input element behaviour)
    this.setState({
      userInputValue: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault(); // prevents the page refreshing with every button submit
    this.getBookResults(this.state.userInputValue);
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
    console.log(results);
    this.setState({
      searchResultsFull: results.items,
      resultsCount: results.totalItems
    })
  }

  expandSelection(e) {
    if (this.state.currentlyExpanded !== e.currentTarget.id) {
      this.setState({
        currentlyExpanded: e.currentTarget.id
      })
    }
    else {
      this.setState({
        currentlyExpanded: ''
      })
    }
  }

  handleFinalSelection(e) {
    console.log(this.state.searchResultsFull[0])
    let book = this.state.searchResultsFull.filter(book => {
      return (book.id === e.currentTarget.id)
    })
    console.log(book);
    this.props.addBookToShelf(...book);

    this.setState({
      searchResultsFull: [],
      resultsCount: ''
    })
  }

  displayResults(result, index) {
    let volumeInfo = result.volumeInfo;
    let shortView = <h3>{volumeInfo.title}, by {volumeInfo.authors}</h3>;
    let expandedView = <div className="expanded-view">
    <h3>{volumeInfo.title}, by {volumeInfo.authors}</h3>
    <button id={result.id} type="button" className="add-button" onClick={this.handleFinalSelection}>Add to bookshelf</button>
    {Object.keys(volumeInfo).includes('imageLinks')
      ? <div className="thumbnail"><img src={volumeInfo.imageLinks.thumbnail} alt={volumeInfo.title}/></div>
      : ''}
      <div className = "description">
        <p>{volumeInfo.description ? volumeInfo.description : 'No description avail'}</p>
      </div>
    </div>;
    return (
      <li><button type="button" id={index} onClick={this.expandSelection}>{this.state.currentlyExpanded === index.toString() ? expandedView : shortView}</button></li>
    )
  }

  render() {
    return (
      <div className="search-bar dropdown">
      <form className="book-search" onSubmit={this.handleSubmit} autoComplete="off">
        <input type="text" name="book" value={this.inputValue} onChange={this.handleInput}/>
        <input type="submit" value="[Search]" className="submit"/>
      </form>
      <div className="search-results">
       {this.state.resultsCount ? <em dangerouslySetInnerHTML={{__html: `${this.state.resultsCount} results`}}/> : ''}
       <ul>{this.state.searchResultsFull ? this.state.searchResultsFull.map(this.displayResults) : ''}</ul>
      </div>
      </div>
    )
  }

}

export default App;
