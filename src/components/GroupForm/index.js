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
    const gid = this.props.firebase.newGroupKey();
    const uid = this.props.firebase.getCurrentUser().uid;

    let members = [uid]; // Current user is the first and only member of the group
    const { name } = this.state;

    // write new group entry to database
    this.props.firebase
      .group(gid)
      .set({
        name,
        members
      })
      .then(console.log("Group successfully created"))
      .catch(error => console.log(error));

    // add group id to user's list of groups

    if (this.props.firebase.user(uid).groups) {
      this.props.firebase.user(uid).groups.push(gid);
    } else {
      this.props.firebase.user(uid).update({ groups: [gid] });
    }

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
