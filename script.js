const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  userInput.value = "";

  setTimeout(() => {
    addMessage(getBotReply(msg), "bot");
  }, 600);
}

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi"))
    return "Hey there! 👋 How’s your day going?";
  if (lower.includes("how are you"))
    return "I’m just code, but feeling quite responsive today 😄";
  if (lower.includes("who are you"))
    return "I’m ChatBoxAI — your personal AI chat assistant!";
  if (lower.includes("bye")) return "Goodbye! Have a wonderful day ✨";
  return "Interesting... tell me more about that.";
}
