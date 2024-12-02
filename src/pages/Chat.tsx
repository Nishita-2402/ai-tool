import React, { useState, useEffect } from "react";
import { PaperClipIcon, PencilIcon } from "@heroicons/react/24/outline"; // Heroicons icons for attachment and edit

const Chat = ({ chats, activeChatIndex, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null); // State for holding the file to be sent
  const [editMessageId, setEditMessageId] = useState(null); // Track which message is being edited

  // Set messages of the selected chat
  useEffect(() => {
    if (activeChatIndex !== null && chats[activeChatIndex]) {
      setMessages(chats[activeChatIndex].messages);
    }
  }, [activeChatIndex, chats]);

  const handleSend = () => {
    if (input.trim() === "" && !file) return; // Don't send if input is empty and no file

    if (editMessageId !== null) {
      // Update existing message (edit mode)
      const updatedMessages = messages.map((message) =>
        message.id === editMessageId
          ? { ...message, text: input, file: file ? URL.createObjectURL(file) : message.file }
          : message
      );

      // Update the AI response if needed
      const aiResponse = updatedMessages.find((msg) => msg.sender === "ai" && msg.id === editMessageId + 1); // Assuming AI response follows the user message
      if (aiResponse) {
        aiResponse.text = "Updated AI Response"; // Change to whatever logic you want
      }

      setMessages(updatedMessages);

      // Update chat with edited message
      const updatedChats = [...chats];
      updatedChats[activeChatIndex].messages = updatedMessages;
      setChats(updatedChats);
      setEditMessageId(null); // Reset edit state
    } else {
      // Add new message (send mode)
      const newMessage = { id: messages.length, text: input, sender: "user", file: file ? URL.createObjectURL(file) : null };
      const updatedMessages = [...messages, newMessage];

      // Mock AI response
      setTimeout(() => {
        const aiResponse = { id: messages.length + 1, text: "AI Response", sender: "ai" };
        const updatedMessagesWithAI = [...updatedMessages, aiResponse];
        setMessages(updatedMessagesWithAI);

        // Update chat with new messages
        const updatedChats = [...chats];
        updatedChats[activeChatIndex].messages = updatedMessagesWithAI;
        setChats(updatedChats);
      }, 1000);

      setMessages(updatedMessages);
    }

    setInput(""); // Clear input field
    setFile(null); // Clear the file after sending
  };

  // Function to handle key press event
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(); // Send message when Enter is pressed
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Set the uploaded file
    }
  };

  // Function to handle message edit
  const handleEditMessage = (messageId, messageText) => {
    setEditMessageId(messageId); // Set the message to be edited
    setInput(messageText); // Set the message text in the input field for editing
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-200 text-black"> {/* Dark background */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}
                onClick={() => message.sender === "user" && handleEditMessage(message.id, message.text)} // Allow editing by clicking the message
              >
                {message.text}
                {message.file && (
                  <div className="mt-2">
                    <a href={message.file} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                      View Attachment
                    </a>
                  </div>
                )}

                {/* Show edit icon only for user messages */}
                {message.sender === "user" && !editMessageId && (
                  <PencilIcon
                    className="h-5 w-5 text-gray-400 hover:text-blue-500 ml-2 cursor-pointer transform transition duration-200 ease-in-out hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering message click
                      handleEditMessage(message.id, message.text);
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center space-x-2 border-t border-gray-700 p-2">
        {/* Attachment icon */}
        <label className="cursor-pointer">
          <PaperClipIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden" // Hide the default file input
          />
        </label>

        {/* Message input */}
        <input
          type="text"
          className="flex-1 p-2 border rounded bg-gray-200 text-black"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for Enter key press
        />

        {/* Send Button */}
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
          {editMessageId !== null ? "Update" : "Send"} {/* Change button text based on edit mode */}
        </button>
      </div>
    </div>
  );
};

export default Chat;
