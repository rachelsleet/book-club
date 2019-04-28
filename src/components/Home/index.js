import { withAuthorization } from '../Session';
import React, { Component } from 'react';
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
        <h1>{username ? `Hi ${username}` : ``}</h1>
        <Link to={ROUTES.GROUP_FORM}>Start a new club</Link>
        <br />
        <Link to={ROUTES.ADMIN}>Remove a club</Link>
        <AvailableGroups firebase={this.props.firebase} user={user} />
      </div>
    );
  }
}

class AvailableGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      gids: [],
      groups: [],
      userGids: [],
      userGroups: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.groups().on('value', snapshots => {
      if (snapshots.val()) {
        snapshots.forEach(group => {
          if (Object.keys(group.val().members).includes(this.props.user)) {
            this.setState({
              loading: false,
              userGids: [...this.state.userGids, group.key],
              userGroups: [...this.state.userGroups, group.val().name]
            });
          } else {
            this.setState({
              loading: false,
              gids: [...this.state.gids, group.key],
              groups: [...this.state.groups, group.val().name]
            });
          }
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.groups().off();
  }

  render() {
    return (
      <div>
        <h3>Your Clubs</h3>
        {this.state.loading && <div>Loading...</div>}
        <ul>
          {this.state.userGroups
            ? this.state.userGroups.map((group, index) => {
                return (
                  <li key={index}>
                    <Link
                      to={{
                        pathname: '/group',
                        state: {
                          gid: this.state.userGids[index],
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
            : 'No other groups available'}
        </ul>
        <h3>All Clubs</h3>
        {this.state.loading && <div>Loading...</div>}
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
            : 'No other groups available'}
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
