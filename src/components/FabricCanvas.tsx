import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';

const FABRIC_CDN = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js";

function useFabricScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).fabric) {
      setLoaded(true);
      return;
    }
    if (document.querySelector(`script[src="${FABRIC_CDN}"]`)) {
      const check = setInterval(() => {
        if ((window as any).fabric) {
          setLoaded(true);
          clearInterval(check);
        }
      }, 50);
      return () => clearInterval(check);
    }
    const script = document.createElement("script");
    script.src = FABRIC_CDN;
    script.async = true;
    script.onload = () => {
      setTimeout(() => setLoaded(true), 50);
    };
    document.body.appendChild(script);
    return () => {};
  }, []);
  return loaded;
}

const FabricCanvas = forwardRef((props: any, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<any>(null);

  const fabricLoaded = useFabricScript();


  const createNewTruck = (trailerColor = "#1976d2", cabinColor = "#c62828") => {
    const fabric = (window as any).fabric;
    if (!fabricCanvasRef.current || !fabric) return;
    fabricCanvasRef.current.clear();

    const trailer = new fabric.Rect({
      left: 60,
      top: 80,
      fill: trailerColor,
      width: 220,
      height: 60,
      selectable: false,
      evented: false,
    });

    const cabin = new fabric.Rect({
      left: 20,
      top: 100,
      fill: cabinColor,
      width: 50,
      height: 40,
      selectable: false,
      evented: false,
    });

    const wheel1 = new fabric.Circle({
      left: 80,
      top: 150,
      radius: 15,
      fill: "#222",
      selectable: false,
      evented: false,
    });
    const wheel2 = new fabric.Circle({
      left: 220,
      top: 150,
      radius: 15,
      fill: "#222",
      selectable: false,
      evented: false,
    });
    const wheel3 = new fabric.Circle({
      left: 260,
      top: 150,
      radius: 15,
      fill: "#222",
      selectable: false,
      evented: false,
    });

    fabricCanvasRef.current.add(trailer, cabin, wheel1, wheel2, wheel3);
    fabricCanvasRef.current.renderAll();
  };

  useImperativeHandle(ref, () => ({
    createNewTruck,
    getCanvas: () => fabricCanvasRef.current,
  }));

  useEffect(() => {
    if (!fabricLoaded) return;
    if (!canvasRef.current) return;
    const fabric = (window as any).fabric;
    if (!fabric) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f9f9f9",
      selection: false,
    });
    fabricCanvasRef.current = canvas;
    createNewTruck();

    return () => {
      canvas.dispose();
    };
  }, [fabricLoaded]);

  if (!fabricLoaded) {
    return <div className="text-center p-4">Carregando editor...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="border border-secondary rounded bg-white"
      style={{ display: "block" }}
    />
  );
});

export default FabricCanvas;
export {};