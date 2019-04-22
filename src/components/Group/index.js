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
  /*
  componentWillMount() {
    //const uid = this.props.firebase.getCurrentUser().uid;
    //const gid = this.props.group;
    this.props.firebase.db
            .ref(`users/${uid}/groups/0`)
            .limitToFirst(1)
            .once('value')
            .then(data => data.val()) //this.props.firebase.user(uid).groups["0"]

    //console.log(uid, gid);
  }*/

  addToBookShelf(book) {
    // triggered by selecting a search result from the SearchBar component
    this.setState({
      bookShelf: [...this.state.bookShelf, book]
    });
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
