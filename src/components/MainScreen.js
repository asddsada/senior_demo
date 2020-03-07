import React from "react";
import Recorder from './Recorder.js'
import Result from './Result.js'

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0
    };
  }

  updateStatus = (status_value) => {
    this.setState({
      status: status_value
    });
  }

  render() {
    return (
      <div>
        <Recorder status={this.state.status} updateStatus={this.updateStatus}/>
        <Result status={this.state.status} updateStatus={this.updateStatus}/>
      </div>
    );
  }
}
export default MainScreen;