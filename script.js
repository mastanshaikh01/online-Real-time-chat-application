// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7HWIhMMaZJYbMoWBGi1zLAXSQhCNDc0U",
  authDomain: "real-time-chat-applicati-aeb60.firebaseapp.com",
  databaseURL: "https://real-time-chat-applicati-aeb60-default-rtdb.firebaseio.com",
  projectId: "real-time-chat-applicati-aeb60",
  storageBucket: "real-time-chat-applicati-aeb60.firebasestorage.app",
  messagingSenderId: "215576602572",
  appId: "1:215576602572:web:c7401db8dfc3e22110df69",
  measurementId: "G-E1J65T250V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Select HTML elements
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatForm = document.getElementById('chat-form');
const switchUserButton = document.getElementById('switch-user');

// Default user (user-1)
let currentUser = 'user-1';

// Function to display messages in the chat box
// function displayMessage(user, message) {
//   const messageDiv = document.createElement('div');
//   messageDiv.classList.add('chat-message', user);
//   const messageContent = document.createElement('div');
//   messageContent.classList.add('message-content');
//   messageContent.textContent = message;
//   messageDiv.appendChild(messageContent);
//   chatBox.appendChild(messageDiv);
//   chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the latest message
// }
function displayMessage(user, message, messageId) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', user);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = message;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');

  deleteButton.addEventListener('click', () => {
    if (user === currentUser) {
      const deleteType = prompt('Type "1" to delete for everyone or "2" to delete only for yourself:');
      if (deleteType === '1') {
        set(ref(db, 'messages/' + messageId), null); // Deletes the message from Firebase
      } else if (deleteType === '2') {
        messageDiv.remove(); // Deletes the message from the UI
      } else {
        alert('Invalid option!');
      }
    } else {
      alert('You can only delete your messages!');
    }
  });

  messageDiv.appendChild(messageContent);
  messageDiv.appendChild(deleteButton);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}


// Listen for real-time updates from Firebase
const messagesRef = ref(db, 'messages/');
onValue(messagesRef, (snapshot) => {
  chatBox.innerHTML = ''; // Clear the chat box before rendering new messages
  const messages = snapshot.val();
  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];
      displayMessage(message.user, message.text);
    });
  }
});

// Handle form submission to send a message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const messageText = chatInput.value.trim();
  if (messageText) {
    const newMessageRef = ref(db, 'messages/' + Date.now());
    set(newMessageRef, {
      user: currentUser,
      text: messageText
    });

    chatInput.value = ''; // Clear input field after sending the message
  }
});

// Switch between users
switchUserButton.addEventListener('click', () => {
  currentUser = (currentUser === 'user-1') ? 'user-2' : 'user-1';
  switchUserButton.textContent = `Switch to ${currentUser === 'user-1' ? 'User 2' : 'User 1'}`;
});

// Select the "Clear Chat" button
const clearChatButton = document.getElementById('clear-chat');

// Clear all messages
clearChatButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the chat? This action cannot be undone.')) {
    set(ref(db, 'messages/'), null); // Deletes all messages from Firebase
    chatBox.innerHTML = ''; // Clear the chat box UI
  }
});
onValue(messagesRef, (snapshot) => {
  chatBox.innerHTML = ''; // Clear the chat box before rendering new messages
  const messages = snapshot.val();
  if (messages) {
    Object.keys(messages).forEach((messageId) => {
      const message = messages[messageId];
      displayMessage(message.user, message.text, messageId);
    });
  }
});




