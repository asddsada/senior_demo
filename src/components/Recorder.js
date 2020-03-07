import React from "react";
import { ReactMic } from '@cleandersonlobo/react-mic';
import './../styles/Recorder.css'

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speaker: 'demo',
      record: false,
    };
  }

  startRecording = () => {
    this.setState({
      record: true,
    });
    this.props.updateStatus(1)
  }

  stopRecording = () => {
    this.setState({
      record: false,
    });
    this.props.updateStatus(2)
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);

    // var file =  new File([recordedBlob], { 'type' : 'audio/wav;' });
    // const writeFileP = require("write-file-p");
    // writeFileP.sync(this.state.speaker+'.wav',file);  
    console.log(this.state.speaker + '.wav is saved');
  }

  button = () => {
    if (!this.state.record) {
      return <div className="button" onClick={this.startRecording} type="button">Start</div>
    } else {
      return <div className="button active" onClick={this.stopRecording} type="button">Stop</div>
    }
  }

  render() {
    return (
      <div id='recorder'>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#8a7dff"
          backgroundColor="#FFF"
          sampleRate={16000}
          mimeType="audio/wav"
          channelCount={1}
        /><br />
        {this.button()}
      </div>
    );
  }
}
export default Recorder;