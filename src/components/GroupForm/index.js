import React, { Component } from "react";
import { withFirebase } from "../Firebase";

class GroupFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  handleChange = event => {
    this.setState({
      name: event.target.value
    });
  };

  createNewGroup = event => {
    console.log(this.state.name);
    const gid = this.props.firebase.newGroupKey();
    const uid = this.props.firebase.getCurrentUser().uid;

    let members = {};
    const books = {};
    const { name } = this.state;
    // Current user is the first and only member of the group
    this.props.firebase
      .users()
      .once("value", data => {
        data.forEach(child => {
          if (uid === child.key) {
            members[child.key] = true;
          } else {
            members[child.key] = false;
          }
        });
        // return members;
      })
      .then(() => {
        this.props.firebase.group(gid).set({
          name,
          members,
          books
        });
      })
      .then(console.log("Group successfully created"))
      .catch(error => console.log(error));

    // write new group entry to database

    event.preventDefault();
  };

  render() {
    return (
      <div>
        <p>New Group</p>
        <form onSubmit={this.createNewGroup} autoComplete="off">
          <input
            type="text"
            name="name"
            value={this.name}
            onChange={this.handleChange}
            placeholder="Enter name here"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const GroupForm = withFirebase(GroupFormBase);

export default GroupForm;
