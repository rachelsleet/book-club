import { withAuthorization } from '../Session';
import React, { Component } from 'react';
import Group from '../Group';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class HomeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      username: '',
      selectedGroup: '',
      selectedGid: ''
    };
  }

  componentWillMount() {
    const uid = this.props.firebase.getCurrentUser().uid;

    this.props.firebase
      .user(uid)
      .once('value')
      .then(snapshot =>
        this.setState({
          username: snapshot.val().username
        })
      );

    this.setState({
      user: uid
    });
  }

  render() {
    const { user, username } = this.state;
    return (
      <div>
        <h1>Welcome back, {this.state.username ? this.state.username : ``}</h1>

        <UserGroups firebase={this.props.firebase} user={user} />
        <AvailableGroups firebase={this.props.firebase} />
        <br />
        <br />
        <Link to={ROUTES.GROUP_FORM}>Create a new group</Link>
      </div>
    );
  }
}

class UserGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gids: [],
      groups: []
    };
  }

  componentWillMount() {
    const uid = this.props.user;
    // fetch user object

    // fetch group ids that user is a member of
    this.props.firebase
      .userGroups(uid)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(group => {
          this.setState({
            gids: [...this.state.gids, group.val()]
          });
        });
      })
      .then(() =>
        this.state.gids.forEach(gid =>
          this.props.firebase
            .group(gid)
            .once('value')
            .then(snapshot => {
              this.setState({
                groups: [...this.state.groups, snapshot.val().name]
              });
            })
        )
      )
      .catch(error => console.log(error));

    // fetch names of groups
  }

  render() {
    return (
      <div>
        <h3>Your Clubs</h3>
        <ul>
          {this.state.groups
            ? this.state.groups.map((group, index) => {
                return (
                  <li key={index}>
                    <Link
                      to={{
                        pathname: '/group',
                        state: { gid: this.state.gids[index], group: group },
                        hash: `${group}`
                      }}
                    >
                      {group}
                    </Link>
                  </li>
                );
              })
            : '...Loading'}
        </ul>
      </div>
    );
  }
}

class AvailableGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gids: [],
      groups: []
    };
  }

  componentWillMount() {
    this.props.firebase
      .groups()
      .once('value')
      .then(snapshot => {
        snapshot.forEach(group => {
          this.setState({
            gids: [...this.state.gids, group.key],
            groups: [...this.state.groups, group.val().name]
          });
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <h3>All Clubs</h3>
        <ul>
          {this.state.groups
            ? this.state.groups.map((group, index) => {
                return (
                  <li key={index}>
                    <Link
                      to={{
                        pathname: '/group',
                        state: {
                          gid: this.state.gids[index],
                          group: group
                        },
                        hash: `${group}`
                      }}
                    >
                      {group}
                    </Link>
                  </li>
                );
              })
            : '...Loading'}
        </ul>
      </div>
    );
  }
}

const HomePage = () => (
  <div>
    <Home />
  </div>
);

const condition = authUser => !!authUser;

const Home = withFirebase(HomeBase);

export default withAuthorization(condition)(HomePage);
