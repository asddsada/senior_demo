from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
# import urllib
# import wave
# import base64
# import audioop
# import numpy as np
# import librosa
# from scipy.io import wavfile
app = Flask(__name__)
CORS(app)
pipeline_dir = os.path.dirname(os.path.abspath(__file__))+'/demo_pipeline/'

audio_dir = pipeline_dir+'audios_demo/'
result_dir = pipeline_dir+'report_outputs/'

thres = 0


@app.route('/')
def hello_world():
    return 'Hello World! This is senior demo backend!'


@app.route('/speaker')
def getSpeaker():
    os.system("cut -d ' ' -f 1 "+pipeline_dir+'data/test_gowajee/spk2utt > '+result_dir+'speaker.txt')
    with open(result_dir+'speaker.txt', "r", encoding="utf-8") as f:
        data = f.read().splitlines()
    return jsonify({'spkList': data})


@app.route('/savewav', methods=['POST'])
def saveWave():
    req_data = request.get_json()
    # blob = req_data['blob']
    spk = req_data['speaker']
    source_path = req_data['download_path']

    shutil.move(source_path+'/'+spk + '_save_file.wav', audio_dir+'demo/demo_'+spk+'.wav')

    return jsonify({'log': 'Audio is saved.'})


@app.route('/process', methods=['POST'])
def process():
    req_data = request.get_json()
    spk = req_data['speaker']
    # print(pipeline_dir+"run_demo_pipeline.sh --target-spk "+spk)
    os.system("cd "+pipeline_dir+"; ./run_demo_pipeline.sh --target-spk "+spk)
    return jsonify({'log': 'ASV process done!'})


@app.route('/result', methods=['POST'])
def getResult():
    with open(result_dir+'trials.txt', "r", encoding="utf-8") as f:
        line = f.read().splitlines()[0]
    isTarget = float(line.split(' ')[2]) > thres
    req_data = request.get_json()
    spk = req_data['speaker']
    if isTarget:
        utt_count = max([ int(f.split('.')[0].split('_')[1])+1 for f in os.listdir(audio_dir+'save/') if spk in f ]+[0])
        name = ('%s_%06d.wav' % (spk,utt_count))
        shutil.move(audio_dir+'demo/demo_'+spk+'.wav',audio_dir+'save/'+name)
    else:
        os.remove(audio_dir+'demo/demo_'+spk+'.wav')
    return jsonify({'isTarget': isTarget})
