import { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, Send, Trash2 } from 'lucide-react';
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL
const CHAT_URL = import.meta.env.VITE_CHAT_URL


function CustomNode({ data, id, updateNodeData, deleteNode }: { data: any; id: string; updateNodeData: (id: string, updatedData: any) => void; deleteNode : (id: string) => void }) {
    const [pendingQuery, setPendingQuery] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<{ name: string } | null>(null);

    //@ts-ignore
    const uploadPDF = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            console.log("No file selected");
            return;
        }

        // Set the pending file
        setPendingFile({ name: file.name });

        try {
            const formData = new FormData();
            formData.append("pdf", file);

            const response = await fetch(UPLOAD_URL, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Chat response", responseData);

                // Update node data with successful file upload
                updateNodeData(id, {
                    pdfId: responseData.pdfId,
                    chat: [
                        ...data.chat,
                        { sender: "user", type: "file", fileName: file.name },
                        { sender: "bot", type: "text", message: "File received" }
                    ],
                });

                // Clear pending file
                setPendingFile(null);
            } else {
                // Clear pending file
                setPendingFile(null);

                // Add error message to chat
                updateNodeData(id, {
                    chat: [
                        { sender: "user", type: "file", fileName: file.name },
                        { sender: "bot", type: "text", message: "Error while receiving file" }
                    ],
                });
                console.error("Chat request failed", response.status, await response.text());
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);

            // Clear pending file
            setPendingFile(null);

            // Add error message to chat
            updateNodeData(id, {
                chat: [
                    { sender: "user", type: "file", fileName: file.name },
                    { sender: "bot", type: "text", message: "Internal server error" }
                ],
            });
        } finally {
            setPendingFile(null)
        }
    };



    //@ts-ignore
    const handleChatRequest = async (e) => {
        e.preventDefault();

        // Extract the query from the input field
        const query = e.target.elements[0].value;
        if (!query.trim()) return;


        setPendingQuery(query);

        // Clear the input field immediately
        e.target.elements[0].value = "";

        try {
            // Prepare the payload with the query and pdfId
            const payload = {
                query: query,
                inputId: data.pdfId,
            };

            console.log(payload);
            

            // Send the payload to the chat API
            const response = await fetch(CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Chat response", responseData);

                // Update the node data with both user query and bot response
                updateNodeData(id, {
                    chat: [
                        ...data.chat,
                        { sender: "user", type: "text", message: query },
                        { sender: "bot", type: "text", message: responseData.response.text },
                    ],
                });
            } else {
                console.error("Chat request failed", response.status, await response.text());

                // Add error message to chat if request fails
                updateNodeData(id, {
                    chat: [
                        ...data.chat,
                        { sender: "user", type: "text", message: query },
                        { sender: "bot", type: "text", message: "Sorry, there was an error processing your request." },
                    ],
                });
            }
        } catch (error) {
            console.error("Error handling chat request:", error);

            // Add error message to chat if an exception occurs
            updateNodeData(id, {
                chat: [
                    ...data.chat,
                    { sender: "user", type: "text", message: query },
                    { sender: "bot", type: "text", message: "An unexpected error occurred." },
                ],
            });
        } finally {

            setPendingQuery(null);
        }
    };

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom whenever the chat updates
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [data.chat]);

    return (
        <div className="p-2 w-[350px] rounded-md bg-white border shadow-lg">
            <div>
                <div className='border-b pb-1 flex justify-between'>
                    <h1 className='text-sm font-semibold'>{data.name}</h1>
                    <button onClick={() => deleteNode(id)}>
                    <Trash2 className='h-4'/>
                    </button>
                </div>

                <div
                    ref={chatContainerRef}
                    className="h-full min-h-[70px] max-h-[500px] overflow-y-auto flex flex-col gap-1 w-full py-2">
                        {/* @ts-ignore */}
                    {data.chat.map((c, index) => {
                        return (
                            c.type == "text" ?
                                <div
                                    key={index}
                                    className={`w-full flex ${c.sender === "bot" ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <h1
                                        className={`rounded-md p-2 max-w-[200px] text-xs ${c.sender === "bot" ? "bg-gray-200" : "bg-blue-200"
                                            }`}
                                    >
                                        {c.message}
                                    </h1>
                                </div> :
                                <div
                                    key={index}
                                    className={`w-full flex ${c.sender === "bot" ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <h1
                                        className={`flex items-center justify-center border border-dotted border-blue-700 rounded-md p-2 max-w-[200px] text-xs ${c.sender === "bot" ? "bg-gray-200" : "bg-blue-200"
                                            }`}
                                    >
                                        <File className='h-4' />
                                        {c.fileName}
                                    </h1>
                                </div>

                        );
                    })}

                    {/* Render pending query if exists */}
                    {pendingQuery && (
                        <>     
                            <div className="w-full flex justify-end">
                                <h1 className="rounded-md p-2 max-w-[200px] text-xs bg-blue-200">
                                    {pendingQuery}
                                </h1>
                            </div>
                            <div
                                className={`w-full flex justify-start`}
                            >
                                <TypingIndicator/>
                            </div>
                        </>
                    )}
                    {pendingFile && (
                        <>
                        <div
                            className={`w-full flex justify-end`}
                        >
                            <h1
                                className={`flex items-center justify-center border border-dotted border-blue-700 rounded-md p-2 max-w-[200px] text-xs bg-blue-200`}
                            >
                                <File className='h-4' />
                                {pendingFile?.name}
                            </h1>
                        </div>
                        <div
                        className={`w-full flex justify-start`}
                    >
                        <TypingIndicator/>
                    </div>
                    </>)}
                </div>

                <div className='flex flex-col gap-1'>
                    <div className="flex items-center justify-center w-full h12">
                        <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex items-center justify-center gap-2">
                                <div className='flex items-center justify-center'>
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                </div>
                                <div className=''>
                                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload PDF</span></p>
                                </div>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={(e) => uploadPDF(e)} />
                        </label>
                    </div>
                    <form className='flex gap-1' onSubmit={(e) => handleChatRequest(e)}>
                        <input type="text" className='border rounded-md w-full text-sm px-2 py-1' placeholder='Type your message here' />
                        <button type='submit' className='bg-blue-500 rounded-full text-white'>
                            <Send className='h-8 w-8 p-2' />
                        </button>
                    </form>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="!bg-blue-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-blue-500"
            />
        </div>
    );
}


const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-1 border px-2 bg-gray-200 py-1 rounded-xl">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
    );
};




export default memo(CustomNode);