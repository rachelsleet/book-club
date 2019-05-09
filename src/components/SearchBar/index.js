import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInputValue: '',
      searchResultsFull: [], // array with objects w/ keys id, volumeInfo (obj with keys title...)
      currentlyExpanded: '',
      googleAPI:
        'https://www.googleapis.com/books/v1/volumes?langRestrict=en&q='
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBookResults = this.getBookResults.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.expandSelection = this.expandSelection.bind(this);
    this.handleFinalSelection = this.handleFinalSelection.bind(this);
    this.displayResults = this.displayResults.bind(this);
  }

  handleInput(e) {
    //updates state as user types (override default input element behaviour)
    this.setState({
      userInputValue: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault(); // prevents the page refreshing with every button submit
    this.getBookResults(this.state.userInputValue);
    this.setState({
      currentlyExpanded: ''
    });
  }

  getBookResults(query) {
    let url = this.state.googleAPI + query; // + "+inauthor";
    console.log(url);
    fetch(url)
      .then(results => {
        return results.json();
      })
      .then(data => {
        console.log(data);
        this.updateResults(data);
      });
    this.setState({
      currentlyExpanded: ''
    });
  }

  updateResults(results) {
    console.log(results);
    this.setState({
      searchResultsFull: results.items,
      resultsCount: results.totalItems,
      currentlyExpanded: ''
    });
  }

  expandSelection(e) {
    if (this.state.currentlyExpanded !== e.currentTarget.id) {
      this.setState({
        currentlyExpanded: e.currentTarget.id
      });
    } else {
      this.setState({
        currentlyExpanded: ''
      });
    }
  }

  handleFinalSelection(e) {
    console.log(this.state.searchResultsFull[0]);
    let book = this.state.searchResultsFull.filter(book => {
      return book.id === e.currentTarget.id;
    });
    console.log(book);
    this.props.addBookToShelf(...book);

    this.setState({
      searchResultsFull: [],
      resultsCount: '',
      currentlyExpanded: '',
      userInputValue: ''
    });
  }

  displayResults(result, index) {
    let volumeInfo = result.volumeInfo;
    let shortView = (
      <button type='button' id={index} onClick={this.expandSelection}>
        {volumeInfo.title},{' '}
        {volumeInfo.authors ? `by ${volumeInfo.authors.join(`, `)}` : ``}
      </button>
    );
    let expandedView = (
      <div className='expanded-view'>
        <button type='button' id={index} onClick={this.expandSelection}>
          {volumeInfo.title},{' '}
          {volumeInfo.authors ? `by ${volumeInfo.authors.join(`, `)}` : ``}
        </button>
        <button
          id={result.id}
          type='button'
          className='add-button'
          onClick={this.handleFinalSelection}
        >
          Add to bookshelf
        </button>
        {/*Object.keys(volumeInfo).includes('imageLinks') ? (
          <div className='thumbnail'>
            <img src={volumeInfo.imageLinks.thumbnail} alt={volumeInfo.title} />
          </div>
        ) : (
          ''
        )*/}
        <div className='description'>
          <p>
            {volumeInfo.description
              ? volumeInfo.description
              : 'No description available'}
          </p>
        </div>
      </div>
    );
    return (
      <li key={index}>
        <div>
          {this.state.currentlyExpanded === index.toString()
            ? expandedView
            : shortView}
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className='search-bar dropdown'>
        <form
          className='book-search'
          onSubmit={this.handleSubmit}
          autoComplete='off'
        >
          <input
            type='text'
            name='book'
            value={this.inputValue}
            onChange={this.handleInput}
          />
          <button type='submit' value='[Search]' className='submit'>
            Submit
          </button>
        </form>
        <div className='search-results'>
          {this.state.resultsCount ? (
            <em
              dangerouslySetInnerHTML={{
                __html: `${this.state.resultsCount} results`
              }}
            />
          ) : (
            ''
          )}
          <ul>
            {this.state.searchResultsFull
              ? this.state.searchResultsFull.map(this.displayResults)
              : ''}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchBar;
