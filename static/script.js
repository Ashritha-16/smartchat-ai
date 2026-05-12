// ===============================
// GET HTML ELEMENTS
// ===============================
const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");
const newChatButton = document.getElementById("new-chat-btn");
const micButton = document.getElementById("mic-btn");


// ===============================
// QUICK REPLY
// ===============================
function quickReply(text) {

    const msg = text.toLowerCase().trim();

    if (msg === "ayoo" || msg === "ayo" || msg === "hi" || msg === "hello") {
        return "Hey 👋 How can I help you?";
    }

    return null;
}


// ===============================
// ADD MESSAGE TO CHAT
// ===============================
function addMessage(text, sender) {

    const message = document.createElement("div");
    message.className = sender;

    if (sender === "bot") {
        message.innerHTML = marked.parse(text);
    } else {
        message.innerText = text;
    }

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ===============================
// TYPING INDICATOR
// ===============================
function showTyping() {

    const typing = document.createElement("div");
    typing.className = "bot";
    typing.id = "typing";
    typing.innerText = "Typing...";

    chatBox.appendChild(typing);
}

function removeTyping() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
}


// ===============================
// SEND MESSAGE
// ===============================
async function sendMessage() {

    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputField.value = "";

    showTyping();

    // quick reply check
    const reply = quickReply(text);
    if (reply) {
        removeTyping();
        addMessage(reply, "bot");
        return;
    }

    try {

        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        removeTyping();
        addMessage(data.response, "bot");

    } catch (error) {

        removeTyping();
        addMessage("Server error", "bot");
        console.log(error);
    }
}


// ===============================
// EVENTS
// ===============================

// send message on Enter
inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// new chat
newChatButton.addEventListener("click", function () {
    chatBox.innerHTML = "";
});

// dark mode toggle
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});


// ===============================
// CHAT HISTORY
// ===============================
async function loadHistory() {

    try {

        const res = await fetch("/history");
        const data = await res.json();

        historyList.innerHTML = "";

        data.forEach(chat => {

            const item = document.createElement("div");
            item.className = "history-item";

            const text = document.createElement("span");
            text.innerText = chat.message;

            const del = document.createElement("button");
            del.innerText = "✖";
            del.className = "delete-btn";

            // open chat
            item.addEventListener("click", function () {
                chatBox.innerHTML = "";
                addMessage(chat.message, "user");
                addMessage(chat.response, "bot");
            });

            // delete chat
            del.addEventListener("click", async function (e) {
                e.stopPropagation();

                await fetch(`/delete_chat/${chat.id}`, {
                    method: "POST"
                });

                loadHistory();
            });

            item.appendChild(text);
            item.appendChild(del);
            historyList.appendChild(item);
        });

    } catch (error) {
        console.log(error);
    }
}

loadHistory();


// ===============================
// VOICE INPUT
// ===============================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    let isMicOn = false;

    micButton.addEventListener("click", function () {

        if (!isMicOn) {
            recognition.start();
            isMicOn = true;
            micButton.innerText = "🔴";
        } else {
            recognition.stop();
            isMicOn = false;
            micButton.innerText = "🎤";
        }
    });

    recognition.onresult = function (event) {
        const text = event.results[event.results.length - 1][0].transcript;
        inputField.value = text;
    };

    recognition.onend = function () {
        isMicOn = false;
        micButton.innerText = "🎤";
    };

    recognition.onerror = function () {
        isMicOn = false;
        micButton.innerText = "🎤";
        alert("Mic error");
    };
}
