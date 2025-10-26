

import { Box } from "@mui/material";
import React, { CSSProperties } from "react";
import { useDrop } from 'react-dnd'

type Props = {
  direction: "up" | "down",
  text?: string
  dndDeps?: any

};

export function DroppableScroll(props: Props) {
  const intervalIdRef = React.useRef<number | null>(null);
  const stepsRef = React.useRef<number>(0);

  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: ["section", "sectionBlock", "element", "elementBlock"],
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        item: monitor.getDropResult()
      }),
    }), [props?.dndDeps]
  );

  const scrollUp = () => {
    stepsRef.current++;
    const newY = window.scrollY - 50;
    if (newY < 0 && intervalIdRef.current) clearInterval(intervalIdRef.current);
    else window.scrollTo(0, newY);
    if (stepsRef.current > 100) handleMouseOut();
  }

  const scrollDown = () => {
    stepsRef.current++;
    const newY = window.scrollY + 50;
    window.scrollTo(0, newY);
    if (stepsRef.current > 100) handleMouseOut();
  }

  const handleMouseOver = () => {
    handleMouseOut();
    stepsRef.current = 0;
    const id: any = setInterval((props.direction === "up") ? scrollUp : scrollDown, 50);
    intervalIdRef.current = id as number;
  }

  const handleMouseOut = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    stepsRef.current = 0;
  }

  let droppableStyle:CSSProperties = { position: "absolute", top: 0, left: 0, height: 30, width: "100%", zIndex: 1, backgroundColor: (isOver) ? "#00FF00" : "#28a745" }


  if (canDrop) return (
    <div style={{ position: "relative" }}>
      <div style={droppableStyle}>
        <div style={{ textAlign: "center", color: "#FFFFFF", width: "100%" }} ref={drop as any}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "4px" }} onDragEnter={handleMouseOver} onDragLeave={handleMouseOut} onDrop={handleMouseOut}>
            <span>{props.text}</span>
          </Box>
        </div>
      </div>
    </div>
  );
  else return <></>
}
