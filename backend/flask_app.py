import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from RAGutils import *
from dotenv import load_dotenv
load_dotenv()

ALLOWED_EXTENSIONS = set(['pdf'])
UPLOAD_FOLDER = '.data/'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 # 10MB
CORS(app)
user_histories={}

if isEmpty("vector_db"):
    load_pdf_create_vector("data")


def allowedFile(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def fileUpload():
    if 'file' not in request.files:
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    if file.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading'})
        resp.status_code = 400
        return resp
    if file and allowedFile(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        resp = jsonify({'message' : 'File successfully uploaded'})
        resp.status_code = 201
        return resp
    else:
        resp = jsonify({'message' : 'Allowed file types pdf'})
        resp.status_code = 400
        return resp

@app.route("/chat_gemini", methods=["POST"])
def chat():
    data = request.get_json()
    current_user = data.get("username", "")
    user_input = data.get("input_text", "")
    if not user_input or not current_user:
        return jsonify({"error": "No input provided"}), 400
    
    if current_user not in user_histories:
        user_histories[current_user] = []
    
    response = get_response_final(user_input)
    user_histories[current_user].append(f"user: {user_input}")
    user_histories[current_user].append(f"model: {response}")
    
    return jsonify({
        "response": response,
        "history": user_histories[current_user]
    }), 200

@app.route("/history", methods=["GET"])
def main():
    current_user = request.args["username"]
    print(current_user)
    history = user_histories.get(current_user, "")
    return jsonify({"user": current_user, "history": history}), 200

@app.route("/")
def get_history():
    return jsonify({"Status" : "Success"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
