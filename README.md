# Senior project web demo
The project is partial fulfillment of the requirements for the degree of Bachelor of Engineering, B.Eng. at Chulalongkorn University on Automatic Speaker Verification on Thai language project submitted to the Department of Computer Engineering on May 21, 2020.

## Requirement
- Python: 3.7.0
- flask: https://github.com/pallets/flask
- base64: pybase64 1.0.1
- numpy: 1.17.2
- NPM: 6.13.4

## Setup
1. Clone pipeline for Auto Speaker Verification system which can be found at https://github.com/asddsada/demo_pipeline .
2. Move clone directory to `backend/demo_pipeline` or edit config in `backend.py`. 
3. NPM build require.

    ``` 
    git clone https://github.com/asddsada/demo_pipeline.git
    mv demo_pipeline backend
    npm install 
    ```

## Start project
* frontend
  * start ReactJS frontend on port `http://localhost:3000`
    ``` 
    npm start 
    ```
* backend
  * config FLASK_APP to backend.py (depend on OS consult https://flask.palletsprojects.com/en/1.1.x/quickstart/#quickstart )
  * start flask on port `http://localhost:5000`
    ``` 
    export FLASK_APP=backend.py
    flask run
    ```
