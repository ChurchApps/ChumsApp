import { CSSProperties } from "react";
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
  const { accept, onDrop, dndDeps, updateIsDragging, hideWhenInactive, children } = props;

  const [isDragging, setIsDragging] = React.useState(false);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (data) => onDrop(data),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      }),
    }), [dndDeps]
  );

  if (canDrop!==isDragging) setIsDragging(canDrop);

  useEffect(() => { if (updateIsDragging) updateIsDragging(isDragging) }, [isDragging, updateIsDragging]);

  const droppableStyle:CSSProperties = { width: "100%", zIndex: 1, backgroundColor: (isOver) ? "rgba(25,118,210, 1)" : "rgba(25,118,210, 0.1)" }

  if (canDrop) return (
    <div style={{ position: "relative" }}>
      <div style={droppableStyle}>
        <div style={{ width: "100%" }} ref={drop as any} data-testid="droppable-wrapper" aria-label="Drop zone">
          {children}
        </div>
      </div>
    </div>
  );
  else return (hideWhenInactive) ? <></> : <>{children}</>
}
