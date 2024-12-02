// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="w-1/5 h-[100svh] border-r border-gray-400 bg-gray-50">
//       <h1 className="text-center text-3xl font-bold text-blue-700 mt-10">
//         Chat Automation
//       </h1>

//       {/* Navigation Links */}
//       <nav className="mt-10">
//         <ul className="space-y-4 text-center">
          
//           <li>
//             <Link
//               to="/chat"
//               className="text-lg font-medium text-gray-700 hover:text-blue-700"
//             >
//               Chat
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";

const Sidebar = ({ onSwitchToChat, onSwitchToCanvas }) => {
  return (
    <div className="w-1/4 h-[100svh] border-r border-gray-400 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <h1 className="text-center text-3xl font-bold text-blue-700 mt-10">
        Chat Automation
      </h1>
      <br /> <br />
      {/* Chat button */}
      <button
        onClick={onSwitchToChat}
        className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Chat
      </button>
      <br /> <br />
      {/* Canvas button */}
      <button
        onClick={onSwitchToCanvas}
        className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Workspace
      </button>
    </div>
  );
};

export default Sidebar;
