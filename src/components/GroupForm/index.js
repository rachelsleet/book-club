import React, { Component } from "react";

class GroupForm extends Component {
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

  createNewGroup() {
    console.log("yes");
  }

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

export default GroupForm;
