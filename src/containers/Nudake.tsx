import React, { useEffect, useRef } from "react";
import "../style/containers/Nudake.css";

import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";

const Nudake = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasParent = canvas.parentNode;
    const ctx = canvas.getContext("2d");

    const imageSrcs = [image1, image2, image3];
    let currIndex = 0;
    let isMouseDown = false;

    let canvasWidth: number, canvasHeight: number;

    const resize = () => {
      canvasWidth = (canvasParent as HTMLElement)?.clientWidth;
      canvasHeight = (canvasParent as HTMLElement)?.clientHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      drawImage();
    };
    const drawImage = () => {
      ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
      const image = new Image();
      image.src = imageSrcs[currIndex];
      image.onload = () => {
        ctx?.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      };
    };

    const onMouseDown = () => {
      console.log("onMousedown");
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
    };
    const onMouseUp = () => {
      console.log("onMouseup");
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
    const onMouseMove = (e) => {
      drawCircles(e);
    };

    const drawCircles = (e) => {
      if (ctx === null) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Nudake;
