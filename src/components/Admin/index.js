import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

class AdminPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));

      this.setState({
        loading: false,
        users: usersList
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <h2>Users</h2>
        {loading && <div>Loading...</div>}
        <UserList users={users} />

        <UserGroups firebase={this.props.firebase} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => {
      return (
        <li key={user.uid}>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <br />
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <br />
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </li>
      );
    })}
  </ul>
);

const INITIAL_STATE = {
  gids: [],
  groups: [],
  loading: true
};

class UserGroups extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.removeGroup = this.removeGroup.bind(this);
  }

  componentDidMount() {
    const uid = this.props.firebase.getCurrentUser().uid;
    // fetch user object

    // fetch group ids that user is a member of
    this.props.firebase.groups().on('value', snapshots => {
      this.setState({
        loading: true
      });
      if (snapshots.val()) {
        snapshots.forEach(snapshot => {
          if (Object.keys(snapshot.val().members).includes(uid)) {
            this.setState({
              gids: [...this.state.gids, snapshot.key],
              groups: [...this.state.groups, snapshot.val().name],
              loading: false
            });
          }
        });
      } else {
        this.setState({ loading: false });
      }
    });

    // fetch names of groups
  }

  componentWillUnmount() {
    this.props.firebase.groups().off();
    this.setState({ ...INITIAL_STATE });
  }

  removeGroup(event) {
    console.log(event.target.value);
    this.props.firebase.group(event.target.value).remove();
    this.props.firebase.users().on('value', snapshots => {
      snapshots.forEach(snapshot => {
        if (Object.keys(snapshot.val().groups).includes(event.target.value)) {
          console.log("removing from user's club list");
          this.props.firebase.db
            .ref(`users/${snapshot.key}/groups/${event.target.value}`)
            .remove();
        }
      });
    });
  }

  render() {
    return (
      <div>
        <h3>Your Clubs</h3>
        {this.state.loading && <div>Loading...</div>}
        <ul>
          {this.state.groups
            ? this.state.groups.map((group, index) => {
                return (
                  <li key={index}>
                    {group}{' '}
                    <button
                      onClick={this.removeGroup}
                      value={this.state.gids[index]}
                    >
                      Remove
                    </button>
                  </li>
                );
              })
            : 'There are currently no groups'}
        </ul>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const AdminPage = withFirebase(AdminPageBase);

export default withAuthorization(condition)(AdminPage);
