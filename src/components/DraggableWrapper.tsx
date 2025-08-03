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

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { data },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [data]
  );

  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1;

  useEffect(() => {
    if (draggingCallback) draggingCallback(isDragging);
  }, [isDragging, draggingCallback]);

  return (
    <div ref={dragRef} style={{ opacity }} className="dragButton" onDoubleClick={onDoubleClick} data-testid="draggable-wrapper" aria-label="Draggable item">
      {children}
    </div>
  );
}
