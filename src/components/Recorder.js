import React from "react";
import { ReactMic } from '@cleandersonlobo/react-mic';
import './../styles/Recorder.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
// import API from "./../utils/API";

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 0,
      isSpeakerSet: false,
      isAudioChoiceSet: false,
      isDone: false,
      record: false,
      isTarget: true,
      pool: [],
      processlog: '',
      waitlog: '',
      selectedFile: null
    };
    this.speaker = ''
    this.audioChoice = ''
  }

  componentDidMount() {
    axios({
      baseURL: "http://localhost:5000/",
      url: '/speaker',
      method: 'GET'
    }).then(res => {
      const spkList = res.data.spkList;
      this.setState({
        pool: spkList
      })
    })
  }

  speakerSelect = (event) => {
    this.speaker = event.target.value;
    this.setState({
      isSpeakerSet: true
    })
  }

  audioSelect = (event) => {
    this.audioChoice = event.target.value;
    this.setState({
      isAudioChoiceSet: true
    })
  }

  startRecordingHandler = () => {
    this.setState({
      record: true,
      state: this.state.state + 1
    });
  }

  stopRecordingHandler = () => {
    this.setState({
      record: false,
      state: this.state.state + 1
    });
  }

  nextHandler = () => {
    if (this.state.isSpeakerSet && this.state.isAudioChoiceSet) {
      this.setState({
        state: this.state.state + 1
      });
    }
  }

  nextResultHandler = () => {
    axios({
      baseURL: "http://localhost:5000/",
      url: '/result',
      method: 'POST',
      data: {
        speaker: this.speaker,
      }
    }).then(res => {
      this.setState({
        isTarget: (res.data.isTarget) ? true : false,
        state: this.state.state + 1,
      })
    })
  }

  doneHandler = () => {
    this.speaker = ''
    this.audioChoice = ''
    axios({
      baseURL: "http://localhost:5000/",
      url: '/speaker',
      method: 'GET'
    }).then(res => {
      const spkList = res.data.spkList;
      this.setState({
        pool: spkList,
        state: 0,
        isSpeakerSet: false,
        isAudioChoiceSet: false,
        isDone: false,
        record: false,
        isTarget: true,
        processlog: '',
        waitlog: ''
      })
    })
  }

  onData(recordedBlob) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }


  onStop = (recordedBlob) => {
    var reader = new FileReader();
    var speaker_tmp = this.speaker;
    var download_path = '/home/asddsada/Downloads';
    saveAs(recordedBlob.blob, speaker_tmp + '_save_file.wav');

    const callbackback = (res) => {
      this.setState({
        processlog: res,
        waitlog: 'Start processing ASV in kaldi...'
      })
      this.getProcess()
    }

    reader.onload = function () {
      var b64 = reader.result.replace(/^data:.+;base64,/, '');
      const callback = (res) => {
        callbackback(res.data.log)
      }
      axios({
        baseURL: "http://localhost:5000/",
        url: '/savewav',
        method: 'POST',
        data: {
          blob: b64,
          speaker: speaker_tmp,
          download_path: download_path
        }
      }).then(callback);
    };

    reader.readAsDataURL(recordedBlob.blob);
  }

  getProcess = () => {
    axios({
      baseURL: "http://localhost:5000/",
      url: '/process',
      method: 'POST',
      data: {
        speaker: this.speaker
      }
    }).then(res => {
      this.setState({
        waitlog: res.data.log,
        isDone: true,
      })
    })
  }

  onUploadChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  nextUpload = () => {
    // const data = new FormData()
    // data.append('file', this.state.selectedFile)
    console.log(this.state.selectedFile);
    var download_path = '/home/asddsada/Downloads';
    saveAs(this.state.selectedFile, this.speaker + '_save_file.wav');

    const callback = (res) => {
      this.setState({
        state: this.state.state + 2,
        processlog: res.data.log,
        waitlog: 'Start processing ASV in kaldi...'
      })
      this.getProcess()
    }

    axios({
      baseURL: "http://localhost:5000/",
      url: '/saveupload',
      method: 'POST',
      data: {
        speaker: this.speaker,
        download_path: download_path
      }
    }).then(callback);
  }

  body = () => {
    if (this.state.state === 0) {
      var nextEnable = (this.state.isSpeakerSet && this.state.isAudioChoiceSet) ? '' : 'disable';
      return (
        <div>
          <h3>Please select speaker to start</h3>

          <select onChange={this.speakerSelect}>
            <option value="" >Select Speaker</option>
            {
              this.state.pool.map((name, index) => {
                return (
                  <option value={name} key={index}>{name}</option>
                );
              })
            }
          </select>
          <br /><br />
          <select onChange={this.audioSelect}>
            <option value="" >Select audio choice</option>
            <option value="record">Record</option>
            <option value="upload">Upload</option>
          </select>
          <div className={"button next " + nextEnable} onClick={this.nextHandler} type="button">Next</div>
        </div>
      );
    } else if (this.state.state < 3) {
      if (this.audioChoice === 'record') {
        if (this.state.state === 1) {
          return (
            <div>
              <h3>Record to verify</h3>
              <div className="button record" onClick={this.startRecordingHandler} type="button">Start</div>
              <input type="file" name="file" onChange={this.onChangeHandler} />
              <p>speaker: {this.speaker}</p>
              <p>Audio choice : {this.audioChoice}</p>
            </div>
          );
        } else if (this.state.state === 2) {
          return (
            <div>
              <h3>Record to verify</h3>
              <div className="button record active" onClick={this.stopRecordingHandler} type="button">Stop</div>
              <input type="file" name="file" onChange={this.onChangeHandler} />
              <p>speaker: {this.speaker}</p>
              <p>Audio choice : {this.audioChoice}</p>
            </div>
          );
        }
      } else {
        var uploadEnable = (this.state.selectedFile) ? '' : 'disable';
        return (
          <div>
            <h3>Upload to verify</h3>
            <input type="file" name="file" onChange={this.onUploadChangeHandler} />
            <p>Recommended wav file with sampling rate 16 kHz and 16 bit depth</p>
            <p>speaker: {this.speaker}</p>
            <p>Audio choice : {this.audioChoice}</p>
            <div className={"button next " + uploadEnable} onClick={this.nextUpload} type="button">Upload</div>
          </div>
        );
      }
    } else if (this.state.state === 3) {
      var doneEnable = (this.state.isDone) ? '' : 'disable';
      return (
        <div>
          {this.state.processlog}
          <br /><br />
          {this.state.waitlog}
          <div className={"button next " + doneEnable} onClick={this.nextResultHandler} type="button">Next</div>
        </div>
      );
    } else if (this.state.state === 4) {
      var resultTarget = (this.state.isTarget === true) ? 'yes' : 'no';

      return (
        <div>
          <h3>Result</h3>
          Target: {resultTarget}<br />
          <div className="button next" onClick={this.doneHandler} type="button">Done</div>
        </div>
      );
    }
  }

  render() {
    return (
      <div id="dialog" >
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#600370"
          backgroundColor="#d8d4ff"
          mimeType="audio/wav"
        />
        {this.body()
        }
      </div >
    );
  }
}
export default Recorder;
