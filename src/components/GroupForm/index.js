import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

class GroupFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
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
    const newGroupPath = this.props.firebase.group(gid);

    let members = {}; // Current user is the first and only member of the group
    const { name } = this.state;

    // write new group entry to database
    newGroupPath
      .set({
        name,
        members
      })
      .then(new_user => {
        console.log('Group successfully created');
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => console.log(error));

    this.props.firebase.db
      .ref(`groups/${gid}/members`)
      .child(uid)
      .set(true);

    // add group id to user's list of groups
    this.props.firebase.db
      .ref(`users/${uid}/groups/`)
      .child(gid)
      .set(true);

    event.preventDefault();
  };

  render() {
    return (
      <div>
        <h2>Pick a Name</h2>
        <form onSubmit={this.createNewGroup} autoComplete='off'>
          <input
            type='text'
            name='name'
            value={this.name}
            onChange={this.handleChange}
            placeholder='Enter name here'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

const GroupForm = withRouter(withFirebase(GroupFormBase));

export default GroupForm;
