import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import socket from "../socket/socket";

const Whiteboard = forwardRef(({ roomId }, ref) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  const strokesRef = useRef([]);     // all strokes
  const redoRef = useRef([]);        // undone strokes

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    ctxRef.current = ctx;

    socket.on("draw", drawRemote);
    socket.on("clear-board", clearLocal);

    return () => {
      socket.off("draw", drawRemote);
      socket.off("clear-board", clearLocal);
    };
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = size;
    }
  }, [color, size]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const drawLine = ({ x1, y1, x2, y2, color, size }) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const drawRemote = (stroke) => {
    strokesRef.current.push(stroke);
    drawLine(stroke);
  };

  const startDrawing = (e) => {
    setDrawing(true);
    const { x, y } = getPos(e);
    ctxRef.current.prevX = x;
    ctxRef.current.prevY = y;
  };

  const draw = (e) => {
    if (!drawing) return;

    const { x, y } = getPos(e);

    const stroke = {
      x1: ctxRef.current.prevX,
      y1: ctxRef.current.prevY,
      x2: x,
      y2: y,
      color,
      size,
    };

    drawRemote(stroke);

    socket.emit("draw", {
      roomId,
      stroke,
    });

    ctxRef.current.prevX = x;
    ctxRef.current.prevY = y;
  };

  const stopDrawing = () => setDrawing(false);

  const redrawAll = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    strokesRef.current.forEach(drawLine);
  };

  const undo = () => {
    if (!strokesRef.current.length) return;

    const last = strokesRef.current.pop();
    redoRef.current.push(last);
    redrawAll();
  };

  const redo = () => {
    if (!redoRef.current.length) return;

    const stroke = redoRef.current.pop();
    strokesRef.current.push(stroke);
    drawLine(stroke);
  };

  const clearLocal = () => {
    strokesRef.current = [];
    redoRef.current = [];

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const clearBoard = () => {
    socket.emit("clear-board", { roomId });
  };

  useImperativeHandle(ref, () => ({
    captureCanvas() {
      return canvasRef.current.toDataURL("image/png");
    },
  }));

  return (
    <div className="h-full flex flex-col gap-2">

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 bg-gray-800 p-2 rounded">
        <button
          onClick={undo}
          className="bg-gray-600 px-3 py-1 rounded text-white"
        >
          Undo
        </button>

        <button
          onClick={redo}
          className="bg-gray-600 px-3 py-1 rounded text-white"
        >
          Redo
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <input
          type="range"
          min="1"
          max="12"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <button
          onClick={clearBoard}
          className="ml-auto bg-red-600 px-4 py-1 rounded text-white"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 bg-white rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
});

export default Whiteboard;
