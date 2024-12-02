// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar"; // Sidebar for home route
// import Sidebar1 from "./components/Sidebar1"; // Sidebar for /chat route
// import Canvas from "./pages/Canvas"; // Main Canvas component
// import Chat from "./pages/Chat"; // Chat component to display chat window

// const App = () => {
//   const [chats, setChats] = useState([]); // List of all chats
//   const [activeChatIndex, setActiveChatIndex] = useState(null); // Index of the active chat

//   const handleNewChat = () => {
//     const newChat = { id: chats.length, messages: [] };
//     const updatedChats = [...chats, newChat];
//     setChats(updatedChats);
//     setActiveChatIndex(updatedChats.length - 1); // Set the newly created chat as active
//   };

//   const handleSelectChat = (index) => {
//     setActiveChatIndex(index); // Set the selected chat as active
//   };

//   const handleDeleteChat = (index) => {
//     const updatedChats = chats.filter((_, chatIndex) => chatIndex !== index);
//     setChats(updatedChats);

//     // If the deleted chat was the active one, set activeChatIndex to null
//     if (activeChatIndex === index) {
//       setActiveChatIndex(null); // Deactivate the chat (set to null)
//     } else if (activeChatIndex > index) {
//       setActiveChatIndex(activeChatIndex - 1); // Adjust activeChatIndex if necessary
//     }
//   };

//   const location = useLocation();  // useLocation hook works here inside Router context

//   return (
//     <div className="flex h-screen">
//       {/* Conditionally render Sidebar and Canvas for / route */}
//       {location.pathname === "/chat" ? (
//         // For /chat route, render Sidebar1 and Chat
//         <div className="flex w-full">
//           <Sidebar1
//             chats={chats}
//             activeChatIndex={activeChatIndex}
//             onNewChat={handleNewChat}
//             onSelectChat={handleSelectChat}
//             onDeleteChat={handleDeleteChat} // Pass delete function to Sidebar1
//           />
//           <div className="flex-1 bg-gray-900">
//             {activeChatIndex !== null && activeChatIndex < chats.length ? (
//               <Chat chats={chats} activeChatIndex={activeChatIndex} setChats={setChats} />
//             ) : (
//               <div className="text-center text-gray-200">
//                 <h2 className="text-2xl font-semibold mb-4">It's a quiet space here!</h2>
//                 <p className="text-lg">
//                   Looks like you haven't started any chats yet. Click the "New Chat" button to begin your first conversation!
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         // For / route, render Sidebar and Canvas
//         <div className="flex w-full">
//           <Sidebar />
//           <Canvas />
//         </div>
//       )}
//     </div>
//   );
// };

// // Router wrapper component to ensure context for routing
// const Root = () => (
//   <Router>
//     <App />
//   </Router>
// );

// export default Root;



import { useState } from "react";
import Sidebar from "./components/Sidebar";  // Sidebar component
import Canvas from "./pages/Canvas";  // Canvas component
import Chat from "./pages/Chat";  // Chat component

const App = () => {
  const [view, setView] = useState("canvas"); // "canvas" or "chat"
  const [chats, setChats] = useState([]); // Chats for GPT Sidebar
  const [activeChatIndex, setActiveChatIndex] = useState(null); // Current active chat

  const handleSwitchToChat = () => {
    const newChat = { id: chats.length, name: `Chat ${chats.length + 1}`, messages: [] };
    const updatedChats = [...chats, newChat];
    setChats(updatedChats); // Add a new chat
    setActiveChatIndex(updatedChats.length - 1); // Set the new chat as active
    setView("chat"); // Switch to Chat view
  };

  const handleSelectChat = (index) => {
    setActiveChatIndex(index); // Select an existing chat
    setView("chat"); // Ensure Chat view is displayed
  };

  const handleNewChat = () => {
    const newChat = { id: chats.length, name: `Chat ${chats.length + 1}`, messages: [] };
    setChats([...chats, newChat]);
    setActiveChatIndex(chats.length); // Set the newly created chat as active
  };

  const handleDeleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
  
    if (activeChatIndex === index) {
      // If the deleted chat was active, reset the active chat index
      setActiveChatIndex(null); // No active chat
      if (updatedChats.length > 0) {
        // Set the first chat as active if there are remaining chats
        setActiveChatIndex(0);
      } else {
        // No chats remaining, reset to initial state (e.g., canvas)
        setView("canvas");
      }
    } else if (activeChatIndex > index) {
      // Adjust activeChatIndex if a preceding chat was deleted
      setActiveChatIndex(activeChatIndex - 1);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        onSwitchToChat={handleSwitchToChat}
        onSwitchToCanvas={() => setView("canvas")}  // Ensure switching to "canvas" view
      />

      {/* Main Content */}
      {view === "canvas" && <Canvas />}
      <div className="flex-1">
        
        {view === "chat" && (
          <Chat
            chats={chats}
            activeChatIndex={activeChatIndex}
            setChats={setChats}
            onDeleteChat={handleDeleteChat}
            onSelectChat={handleSelectChat}
          />
        )}
      </div>
    </div>
  );
};

export default App;
