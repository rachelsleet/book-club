import React, { Component } from 'react';
import Bookshelf from '../Bookshelf';
import SearchBar from '../SearchBar';


class GroupPage extends Component {
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
            <div>
                <SearchBar addBookToShelf={this.addToBookShelf}/>
                <Bookshelf books={this.state.bookShelf}/>
            </div>
        )
    }
}

export default GroupPage;