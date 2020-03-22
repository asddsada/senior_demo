from flask import Flask, request, jsonify
from flask_cors import CORS
import os,shutil
from subprocess import call
# import urllib
# import wave
# import base64
# import audioop
# import numpy as np
# import librosa
# from scipy.io import wavfile
app = Flask(__name__)
CORS(app)

audio_path=os.path.dirname(os.path.abspath(__file__))+'\\demo_audio\\'
result_path = '.\\'

@app.route('/')
def hello_world():
    return 'Hello World! \nThis is senior demo backend!'

@app.route('/speaker')
def getSpeaker():
    with open(result_path+'speaker.txt', "r", encoding="utf-8") as f:
        data = f.read().splitlines()
    return jsonify({'spkList': data})

@app.route('/savewav', methods=['POST'])
def saveWave():
    req_data = request.get_json()
    blob = req_data['blob']
    spk = req_data['speaker']
    source_path = req_data['download_path']
    # nframes = int(req_data['nframe'])
    # bytes_blob = base64.b64decode(blob)
    # array_blob = np.frombuffer(bytes_blob, dtype=np.float64)  
    # name_tmp = spk+'_tmp.wav'
    utt_count = max([ int(f.split('.')[0].split('_')[1])+1 for f in os.listdir(audio_path) if spk in f ]+[0])
    name = ('%s_%06d.wav' % (spk,utt_count))
    shutil.move(source_path+'\\'+spk + '_save_file.wav', audio_path+name)
    # librosa.output.write_wav(name, array_blob, 16000)

    # fout = open(name_tmp, "bx")
    # fout.write(bytes_blob)
    # fout.close()
    # audioFile = wave.open(name_tmp, 'r')
    # n_frames = audioFile.getnframes()
    # audioData = audioFile.readframes(n_frames)
    # originalRate = audioFile.getframerate()
    # af = wave.open(name, 'w')
    # af.setnchannels(1)
    # af.setparams((1, 2, 16000, n_frames, 'NONE', 'Uncompressed'))
    # converted = audioop.ratecv(audioData, 2, 1, originalRate, 16000, None)
    # af.writeframes(converted[0])
    # af.close()
    # audioFile.close()

    # fout = open(spk+'.wav', "bx")
    # fout.write(bytes_blob)
    # fout.close()

    # nchannels = 1
    # sampwidth = 1
    # framerate = 16000

    # audio = wave.open(name, 'wb')
    # audio.setnchannels(nchannels)
    # audio.setsampwidth(sampwidth)
    # audio.setframerate(framerate)
    # audio.setnframes(nframes)
    # audio.writeframes(bytes_blob)

    # wavfile.write(name,16000,array_blob)

    return jsonify({'log': 'Audio is saved as '+name+'.'})

@app.route('/process')
def process():
    # process kaldi
    for i in range(int(50000000)): 
        if i%10000000==0:print(i)
    rc = call("./run_demo.sh")
    return jsonify({'log': 'ASV process done!'})

@app.route('/result')
def getResult():
    with open(result_path+'result.txt', "r", encoding="utf-8") as f:
        line_list = f.read().splitlines()
    data={ line.split('=')[0]:line.split('=')[1] for line in line_list if '=' in line}
    return jsonify(data)