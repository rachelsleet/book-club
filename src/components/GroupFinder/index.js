import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class GroupFinder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>
          Join or <Link to={ROUTES.GROUP_FORM}>create</Link> a group!
        </p>
        <h2>Available Groups</h2>
        <ul>
          <li>
            <button>Biscoff</button>
          </li>
          <li>
            <button>Lotus</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default GroupFinder;
