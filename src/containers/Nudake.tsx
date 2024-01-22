import React, { useEffect, useRef } from "react";
import "../style/containers/Nudake.css";
import gsap from "gsap";
import {
  drawImageCenter,
  getAngle,
  getDistance,
  getScrupedPercent,
} from "../utils/utils";
import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";
import throttle from "lodash/throttle";

const Nudake = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasParent = canvas.parentNode;
    const ctx = canvas.getContext("2d");
    let isChanging = false;

    const imageSrcs = [image1, image2, image3];
    const loadedImages: HTMLImageElement[] = [];
    let currIndex = 0;
    let prevPos = { x: 0, y: 0 };

    let canvasWidth: number, canvasHeight: number;

    const resize = () => {
      canvasWidth = (canvasParent as HTMLElement)?.clientWidth;
      canvasHeight = (canvasParent as HTMLElement)?.clientHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      preloadImages().then(() => drawImage());
    };

    const preloadImages = () => {
      return new Promise((resolve) => {
        const loaded = 0;
        imageSrcs.forEach((src) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loaded + 1;
            loadedImages.push(img);
            return new Promise((resolve) => {
              const loaded = 0;
              imageSrcs.forEach((src) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                  loaded + 1;
                  loadedImages.push(img);
                  if (loaded === imageSrcs.length) return resolve();
                };
              });
            });
          };
        });
      });
    };

    const drawImage = () => {
      isChanging = true;
      if (ctx === null) return;

      const image = loadedImages[currIndex];
      const firstDrawing = ctx.globalCompositeOperation === "source-over";

      gsap.to(canvas, {
        opacity: 0,
        duration: firstDrawing ? 0 : 1,
        onComplete: () => {
          canvas.style.opacity = 1;
          ctx.globalCompositeOperation = "source-over";
          drawImageCenter(canvas, ctx, image);

          const nextImage = imageSrcs[(currIndex + 1) % imageSrcs.length];
          if (!canvasParent) return;
          canvasParent.style.backgroundImage = `url(${nextImage})`;
          prevPos = null;
          isChanging = false;
        },
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      if (isChanging) return;
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mouseleave", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
      prevPos = { x: e.offsetX, y: e.offsetY };
    };
    const onMouseUp = () => {
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isChanging) return;
      drawCircles(e);
      checkPercent();
    };

    const drawCircles = (e: MouseEvent) => {
      if (ctx === null) return;
      const nextPos = { x: e.offsetX, y: e.offsetY };
      if (!prevPos) prevPos = nextPos;
      const dist = getDistance(prevPos, nextPos);
      const angle = getAngle(prevPos, nextPos);

      for (let i = 0; i < dist; i++) {
        const x = prevPos.x + Math.cos(angle) * i;
        const y = prevPos.y + Math.sin(angle) * i;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, canvasWidth / 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      prevPos = nextPos;
    };

    const checkPercent = throttle(() => {
      const percent = getScrupedPercent(ctx, canvasWidth, canvasHeight);
      if (percent > 50) {
        currIndex = (currIndex + 1) % imageSrcs.length;
        drawImage();
      }
    }, 500);

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
