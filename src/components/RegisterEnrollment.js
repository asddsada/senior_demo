import React from "react";
import './../styles/RegisterEnrollment.css';

class RegisterEnrollment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistrer: false
    };
  }

  registering = () => {
    console.log('add');

    this.setState({
      isRegistrer: true
    });
    this.forceUpdate();
  }

  finish = () => {
    this.setState({
      isRegistrer: false
    });
  }

  close = () =>{
    this.setState({
      isRegistrer: false
    });
  }

  element = () => {
    if (this.state.isRegistrer) {
      return (
        <div className="form" onClick={this.close}>
          <div className="form-content">
            <span className="close" onClick={this.close}>&times;</span>
            <h3>Enroll</h3>
            <div className="button" onClick={this.finish} >Done</div>
          </div>
        </div>
      );
    } else {
      return <div className="button" id="addButton" onClick={this.registering} >+</div>
    }
  }

  render() {
    return (
      <div id="registerEnrollment">
        {this.element()}
      </div>
    );
  }
}
export default RegisterEnrollment;