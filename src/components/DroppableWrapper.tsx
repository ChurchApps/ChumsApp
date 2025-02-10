import { CSSProperties } from "@mui/material/styles/createMixins";
import React, { useEffect } from "react";
import { useDrop } from 'react-dnd'

type Props = {
  children?: React.ReactNode,
  accept: any,
  onDrop: (data: any) => void,
  dndDeps?: any,
  updateIsDragging?: (isDragging: boolean) => void,
  hideWhenInactive?: boolean
};

export function DroppableWrapper(props: Props) {

  const [isDragging, setIsDragging] = React.useState(false);

  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: props.accept,
      drop: (data) => props.onDrop(data),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        item: monitor.getDropResult()
      }),
    }), [props?.dndDeps]
  );

  if (canDrop!==isDragging) setIsDragging(canDrop);

  useEffect(() => { if (props.updateIsDragging) props.updateIsDragging(isDragging) }, [isDragging]);

  let droppableStyle:CSSProperties = { width: "100%", zIndex: 1, backgroundColor: (isOver) ? "rgba(25,118,210, 1)" : "rgba(25,118,210, 0.1)" }

  if (canDrop) return (
    <div style={{ position: "relative" }}>
      <div style={droppableStyle}>
        <div style={{ width: "100%" }} ref={drop as any}>
          {props.children}
        </div>
      </div>
    </div>
  );
  else return (props.hideWhenInactive) ? <></> : <>{props.children}</>
}
