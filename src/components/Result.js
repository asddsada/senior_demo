import React from "react";
import './../styles/Result.css';

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isASR: true,
      isTarget: true
    };
  }

  render() {
    var resultASR = (this.state.isASR) ? 'Is ASR 2019 student' : '';
    var resultTarget = (this.state.isTarget) ? 'Is Target' : 'Is non Target';
    if(this.props.status===1){
      return (
        <div id="result">
          Recording
        </div>
      );
    }else if(this.props.status===2){
      return (
        <div id="result">
          {resultTarget}
          <br />
          <br />
          {resultASR}
        </div>
      );
    }
    return (
      <div id="result">
        Record audio to start
      </div>
    );
  }
}
export default Result;