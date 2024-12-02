import React from "react";

const GptSidebar = ({ chats, activeChatIndex, onNewChat, onSelectChat, onDeleteChat }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full px-4 py-2 bg-green-500 rounded mb-4 hover:bg-green-600"
      >
        New Chat
      </button>

      {/* List of chats */}
      <ul>
        {chats.map((chat, index) => (
          <li
            key={chat.id}
            className={`p-2 rounded mb-2 cursor-pointer ${activeChatIndex === index ? "bg-blue-500" : "bg-gray-600"}`}
            onClick={() => onSelectChat(index)}
          >
            <div className="flex justify-between items-center">
              <span>Chat {chat.id + 1}</span>
              {/* Delete Button */}
              <button
                onClick={() => onDeleteChat(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GptSidebar;
