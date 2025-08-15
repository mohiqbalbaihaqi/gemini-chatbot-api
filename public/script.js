document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) {
      return;
    }

    addMessageToChatBox("user", userMessage);
    userInput.value = "";

    const thinkingMessage = addMessageToChatBox(
      "bot",
      "Thinking...",
      "thinking"
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server.");
      }

      const data = await response.json();

      if (data && data.result) {
        thinkingMessage.textContent = data.result;
      } else {
        thinkingMessage.textContent = "Sorry, no response received.";
      }
    } catch (error) {
      console.error("Error:", error);
      thinkingMessage.textContent = "Failed to get response from server.";
    } finally {
      thinkingMessage.classList.remove("thinking");
    }
  });

  function addMessageToChatBox(role, content, id) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", `${role}-message`);
    messageElement.textContent = content;
    if (id) {
      messageElement.id = id;
    }
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  }
});
