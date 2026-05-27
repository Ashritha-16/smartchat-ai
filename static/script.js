// ===============================
// ELEMENTS
// ===============================
const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");
const newChatButton = document.getElementById("new-chat-btn");
const micButton = document.getElementById("mic-btn");
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");

// overlay (mobile menu)
const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);


// ===============================
// QUICK REPLY FUNCTION
// ===============================
function quickReply(text) {
    const msg = text.toLowerCase().trim();

    if (["hi", "hello", "ayo", "ayoo"].includes(msg)) {
        return "Hey 👋 How can I help you?";
    }

    return null;
}


// ===============================
// FUNCTION TO ADD MESSAGE
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

    // auto scroll to latest message
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
    if (typing) {
        typing.remove();
    }
}


// ===============================
// SEND MESSAGE FUNCTION
// ===============================
async function sendMessage() {

    const text = inputField.value.trim();
    if (!text) return;

    // show user message
    addMessage(text, "user");
    inputField.value = "";

    // show typing
    showTyping();

    // check quick reply first
    const reply = quickReply(text);

    if (reply) {
        removeTyping();
        addMessage(reply, "bot");
        return;
    }

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        removeTyping();
        addMessage(data.response, "bot");

    } catch (err) {
        removeTyping();
        addMessage("Server error", "bot");
        console.log(err);
    }
}


// ===============================
// EVENT LISTENERS
// ===============================

// send message on Enter key
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// new chat button
newChatButton.addEventListener("click", () => {
    chatBox.innerHTML = "";
});

// theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});


// ===============================
// MOBILE MENU CONTROL
// ===============================
function closeMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("show");
}

// toggle sidebar menu
menuBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("show");
});

// close when clicking outside
overlay.addEventListener("click", closeMenu);

// auto close on resize
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});


// ===============================
// CHAT HISTORY LOADING
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

            // load selected chat
            item.addEventListener("click", () => {
                chatBox.innerHTML = "";
                addMessage(chat.message, "user");
                addMessage(chat.response, "bot");
            });

            // delete chat
            del.addEventListener("click", async (e) => {
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

    } catch (err) {
        console.log(err);
    }
}

// initial history load
loadHistory();


// ===============================
// VOICE INPUT (MIC)
// ===============================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    let isMicOn = false;

    micButton.addEventListener("click", () => {

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

    recognition.onresult = (e) => {
        inputField.value =
            e.results[e.results.length - 1][0].transcript;
    };

    recognition.onend = () => {
        isMicOn = false;
        micButton.innerText = "🎤";
    };

    recognition.onerror = () => {
        isMicOn = false;
        micButton.innerText = "🎤";
        alert("Mic error");
    };
}