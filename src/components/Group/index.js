import React, { Component } from 'react';
import Bookshelf from '../Bookshelf';
import SearchBar from '../SearchBar';
import { withFirebase } from '../Firebase';

class GroupBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookShelf: [] // books stored here
    };
    this.addToBookShelf = this.addToBookShelf.bind(this);
  }

  componentWillMount() {
    //const uid = this.props.firebase.getCurrentUser().uid;
    const gid = this.props.gid;
    // WILL CONTAIN BOOK SHELF FETCHING FROM DATABASE
    this.props.firebase.db
      .ref(`groups/${gid}/books`)
      .once('value')
      .then(snapshots => {
        let books = [];
        snapshots.forEach(snapshot => {
          books.push(snapshot.val());
        });
        return books;
      })
      .then(books => {
        this.setState({
          bookShelf: [...books]
        });
      })
      .then(console.log(this.state.bookShelf))
      .catch(error => console.log(error));
    //console.log(uid, gid);
  }

  addToBookShelf(book) {
    // triggered by selecting a search result from the SearchBar component
    this.setState({
      bookShelf: [...this.state.bookShelf, book]
    });
    // save book in group
    const gid = this.props.gid;

    this.props.firebase.db
      .ref(`groups/${gid}/books/${book.id}`)
      .set({ ...book });
  }

  render() {
    return (
      <div>
        <SearchBar addBookToShelf={this.addToBookShelf} />
        <Bookshelf books={this.state.bookShelf} />
      </div>
    );
  }
}

const Group = withFirebase(GroupBase);

export default Group;
