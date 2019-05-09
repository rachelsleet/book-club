import React, { Component } from 'react';
import Bookshelf from '../Bookshelf';
import SearchBar from '../SearchBar';
import { withFirebase } from '../Firebase';

class GroupBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookShelf: [], // books stored here
      toggleView: true
    };
    this.addToBookShelf = this.addToBookShelf.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentDidMount() {
    //const uid = this.props.firebase.getCurrentUser().uid;
    const gid = this.props.location.state.gid;
    // WILL CONTAIN BOOK SHELF FETCHING FROM DATABASE
    this.props.firebase.db.ref(`groups/${gid}/books`).on('value', snapshots => {
      let books = [];
      snapshots.forEach(snapshot => {
        books.push(snapshot.val());
      });
      this.setState({
        bookShelf: [...books]
      });
    });
    //console.log(uid, gid);
  }

  addToBookShelf(book) {
    // triggered by selecting a search result from the SearchBar component
    this.setState({
      bookShelf: [...this.state.bookShelf, book],
      toggleView: true
    });
    // save book in group
    const gid = this.props.location.state.gid;

    this.props.firebase.db
      .ref(`groups/${gid}/books/${book.id}`)
      .set({ ...book });
  }

  toggleView() {
    this.setState({
      toggleView: !this.state.toggleView
    });
  }

  removeBook(event) {
    console.log('clicked');
    const gid = this.props.location.state.gid;
    const bid = event.target.value;

    this.props.firebase.db.ref(`groups/${gid}/books/${bid}`).remove();
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>Club selected: {this.props.location.state.group}</h2>
        <button className='toggle-shelf' onClick={this.toggleView}>
          {this.state.toggleView
            ? `Search for more books`
            : `Back to Bookshelf`}
        </button>
        {this.state.toggleView ? (
          <Bookshelf
            books={this.state.bookShelf}
            removeBook={this.removeBook}
          />
        ) : (
          <SearchBar addBookToShelf={this.addToBookShelf} />
        )}
      </div>
    );
  }
}

const Group = withFirebase(GroupBase);

export default Group;
