import { Plus } from "lucide-react";
import { useCallback, useMemo} from "react";
import { ReactFlow, Controls, Background, useNodesState, addEdge, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from "../components/CustomNode";
import { v4 as uuidv4 } from 'uuid';


const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: { 
      name: 'New Node',
      pdfId: '',
      chat: [
        { sender: 'bot', type: 'text', message: 'Hello, how can I help you?' },
      ]
    },
    position: { x: 0, y: 50 },
  }
];

const Canvas = () => {

  //@ts-ignore
  const updateNodeData = (nodeId, updatedData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );
  };

  const deleteNode =  (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
  };

  const nodeTypes = useMemo(
    () => ({
      //@ts-ignore
      custom: (nodeProps) => (
        <CustomNode {...nodeProps} updateNodeData={updateNodeData} deleteNode={deleteNode}/>
      ),
    }),
    [] // No dependencies, memoize the object
  );
  

  const AddNode = () => {
    setNodes((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type: 'custom',
        position: { x: 100, y: 100 }, // Initial position
        data: {
          name: 'New Node',
          pdfId: '',
          chat: [
            { sender: 'bot', type: 'text', message: 'Hello, how can I help you?' },
          ],
        },
      },
    ]);
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    //@ts-ignore
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  
  return (
    <div className="w-full">
      <ReactFlow 
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      // connectionLineComponent={ConnectionLine}
      fitView
      className="bg-teal-50"
      >
        <Background />
        <Controls />
      </ReactFlow>
      <button onClick={AddNode} className="bg-blue-500 leading-9 p-4 flex justify-center items-center rounded-full font-bold text-white absolute right-7 shadow-md bottom-7">
        <Plus className="h-9 w-9"/>
      </button>
    </div>
  )
}


export default Canvas