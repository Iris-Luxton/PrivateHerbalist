# Import Flask and create an instance of the app
from flask import Flask, request, jsonify, render_template
import spacy
import json

app = Flask(__name__)

# Load a pre-trained spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Load intent data from intents.json
with open("intents.json", "r") as file:
    intents = json.load(file)

# Define a route for serving the HTML chatbot interface
@app.route("/")
def chatbot():
    chatbot_name = "HerbBot"
    return render_template("chatbot.html", chatbot_name=chatbot_name)

    # Define a route for handling chatbot requests
@app.route("/chatbot", methods=["POST"])
def handle_chatbot_request():
    # Get the user's message from the request
    user_message = request.json["message"]

    # Perform NLP analysis on the user's message
    doc = nlp(user_message)

    # Extract intent based on recognized patterns
    intent = None
    for item in intents["intents"]:
        for pattern in item["patterns"]:
            if pattern in user_message:
                intent = item["tag"]
                break

    # Generate a response based on the detected intent
    if intent:
        response = get_response(intent)
    else:
        response = "I'm here to provide information about herbs. Feel free to ask any questions."

    return jsonify({"message": response})

def get_response(intent):
    for item in intents["intents"]:
        if item["tag"] == intent:
            responses = item["responses"]
            return responses[0]  # For simplicity, returning the first response

if __name__ == "__main__":
    app.run(debug=True)