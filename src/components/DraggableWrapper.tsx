import React, { useEffect } from "react";
import { useDrag } from "react-dnd";

type Props = {
  children?: React.ReactNode;
  dndType: string;
  data: any;
  onDoubleClick?: () => void;
  draggingCallback?: (isDragging: boolean) => void;
};

export function DraggableWrapper(props: Props) {
  const { dndType, data, draggingCallback, onDoubleClick, children } = props;
  const dragRef = React.useRef(null);
  const callbackRef = React.useRef(draggingCallback);

  useEffect(() => {
    callbackRef.current = draggingCallback;
  }, [draggingCallback]);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { data },
      collect: (monitor) => {
        const isDragging = !!monitor.isDragging();
        return { isDragging };
      },
      end: (item, monitor) => {
        monitor.didDrop();
      }
    }),
    [data, dndType]
  );

  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1;

  useEffect(() => {
    if (callbackRef.current) callbackRef.current(isDragging);
  }, [isDragging]);

  return (
    <div ref={dragRef} style={{ opacity, transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }} className="dragButton" onDoubleClick={onDoubleClick} data-testid="draggable-wrapper" aria-label="Draggable item">
      {children}
    </div>
  );
}
