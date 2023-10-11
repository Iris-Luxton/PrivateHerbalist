

document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", function () {
        sendMessage();
    });

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    function scrollToBottom() {
        const chatContainer = document.querySelector(".chat-container");
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    function sendMessage() {
        const userMessage = userInput.value;
        displayUserMessage(userMessage);

        // Display "typing" indicator
        displayTypingIndicator();

        // Simulate a 3-second delay before the bot responds
        setTimeout(() => {
            // Send the user message to the server for processing
            fetch("/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const botResponse = data.message;

                    // Hide "typing" indicator
                    hideTypingIndicator();
                    displayBotMessage(botResponse);
                    scrollToBottom();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }, 2000); // Delay of 3000 milliseconds (3 seconds)

        // Clear the input field after sending the message
        userInput.value = "";
    }

    function displayTypingIndicator() {
        const typingIndicator = document.querySelector(".typing-indicator");
        if (typingIndicator) {
            typingIndicator.style.display = "block"; // Show the indicator
            scrollToBottom();
        }
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector(".typing-indicator");
        if (typingIndicator) {
            typingIndicator.style.display = "none"; // Hide the indicator
        }
    }

    function displayUserMessage(message) {
        const userMessageDiv = document.createElement("div");
        userMessageDiv.className = "user-message";
        userMessageDiv.innerText = message;
        chatMessages.appendChild(userMessageDiv);
        userInput.value = "";
    }

    // Implement logic to display chatbot responses in a similar way.
    function displayBotMessage(message) {
        const botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerText = message;
        chatMessages.appendChild(botMessageDiv);
    }
});

// Note that we are using both JS and python.
// Python is used for server-side logic, process user input, execute NLP models, and generate chatbot responses
// JavaScript handles client-side interactions in web interface, send user messages to the server, display responses in HTML.