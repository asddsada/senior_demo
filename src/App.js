import React from 'react';
import './App.css';
import RegisterEnrollment from './components/RegisterEnrollment.js'
import EnrollmentList from './components/EnrollmentList.js'
import MainScreen from './components/MainScreen.js'

function App() {
  return (
    <div className="App">
      <EnrollmentList />
      <RegisterEnrollment />
      <MainScreen/>
    </div>
  );
}

export default App;
