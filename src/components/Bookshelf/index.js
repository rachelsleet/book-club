import React from 'react';

const googleAPI = "https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=";
const stockImage = "https://images.unsplash.com/photo-1549758225-5835373bcbc3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=738&q=80";

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

export default Bookshelf;