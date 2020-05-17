import React from "react";
import './../styles/EnrollmentList.css';

class EnrollmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameList: ['a','b','c']
    };
  }
  render() {
    return (
      <div id="enrollmentList">
      enrollmentList
      {
        this.state.nameList.map((name,index) => {
            return (
                <div className="list-content" key={index}>{name}</div>
            );
        })
      }
      </div>
    );
  }
}
export default EnrollmentList;