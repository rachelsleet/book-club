import React, { Component } from "react";
import GroupPage from "../Group";
import GroupFinder from "../GroupFinder";
import { withFirebase } from "../Firebase";

class GroupPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      group: ""
    };
  }

  componentWillMount() {
    this.setState({
      user: this.props.firebase.getCurrentUser().uid,
      group: "" //'fetch the group id here'
    });
  }

  render() {
    const { group } = this.state;
    return <div>{group ? <GroupPage group={group} /> : <GroupFinder />}</div>;
  }
}

export default withFirebase(GroupPageBase);
