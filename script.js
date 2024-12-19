import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7HWIhMMaZJYbMoWBGi1zLAXSQhCNDc0U",
  authDomain: "real-time-chat-applicati-aeb60.firebaseapp.com",
  databaseURL: "https://real-time-chat-applicati-aeb60-default-rtdb.firebaseio.com",
  projectId: "real-time-chat-applicati-aeb60",
  storageBucket: "real-time-chat-applicati-aeb60.appspot.com",
  messagingSenderId: "215576602572",
  appId: "1:215576602572:web:c7401db8dfc3e22110df69",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatForm = document.getElementById("chat-form");
const switchUserButton = document.getElementById("switch-user");
const clearChatButton = document.getElementById("clear-chat");

let currentUser = "user-1";

function displayMessage(user, message, messageId) {
  const messageDiv = document.createElement("div");
  const isCurrentUser = user === currentUser; // Check if the message is from the current user

  messageDiv.classList.add("chat-message");
  messageDiv.classList.add(isCurrentUser ? "user-1" : "user-2"); // Add appropriate user class

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  // Apply appropriate styles (right for sender, left for receiver)
  if (isCurrentUser) {
    messageDiv.classList.add("message-right");
  } else {
    messageDiv.classList.add("message-left");
  }

  // Add delete button only for the message's sender
  if (isCurrentUser) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
      const deleteType = prompt(
        'Type "1" to delete for everyone or "2" to delete only for yourself:'
      );
      if (deleteType === "1") {
        set(ref(db, "messages/" + messageId), null); // Delete message from Firebase
      } else if (deleteType === "2") {
        messageDiv.remove(); // Delete message only from UI
      } else {
        alert("Invalid option!");
      }
    });

    messageDiv.appendChild(deleteButton);
  }

  messageDiv.appendChild(messageContent);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to latest message
}


const messagesRef = ref(db, "messages/");
onValue(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // Clear chat box before rendering new messages
  const messages = snapshot.val();
  if (messages) {
    Object.keys(messages).forEach((messageId) => {
      const message = messages[messageId];
      displayMessage(message.user, message.text, messageId);
    });
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = chatInput.value.trim();
  if (messageText) {
    const newMessageRef = ref(db, "messages/" + Date.now());
    set(newMessageRef, {
      user: currentUser,
      text: messageText,
    });
    chatInput.value = ""; // Clear input field
  }
});

switchUserButton.addEventListener("click", () => {
  currentUser = currentUser === "user-1" ? "user-2" : "user-1";
  switchUserButton.textContent = `Switch to ${
    currentUser === "user-1" ? "User 2" : "User 1"
  }`;
});

clearChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the chat? This action cannot be undone.")) {
    set(ref(db, "messages/"), null); // Clear Firebase messages
  }
});
function addMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;

  if (sender === 'user1') {
      // User 1's perspective
      messageDiv.classList.add('message-right');
  } else if (sender === 'user2') {
      // User 2's perspective
      messageDiv.classList.add('message-left');
  }

  // Append to the chat box
  document.getElementById('chatBox').appendChild(messageDiv);
}

