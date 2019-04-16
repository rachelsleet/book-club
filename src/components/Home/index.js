import React from 'react';
import { withAuthorization } from '../Session';
//import { withFirebase } from '../Firebase';
import GroupPage from '../Group';
import GroupFinder from '../GroupFinder';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: ''
        }
    }

    componentDidMount() {
      
    }

    render() {

        const { group } = this.state;

        return(
            <div className="App">
                {group ? <GroupPage group="group"/> : <GroupFinder />}
            </div>
        )
        
    }
}
    
  
  const HomePage = () => (
    <div>
      <h1>Home Page</h1>
      <Home />
    </div>
  )

  const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);