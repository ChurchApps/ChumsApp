import React, { useEffect } from "react";
import { useDrag } from 'react-dnd'

type Props = {
  children?: React.ReactNode,
  dndType: string,
  data: any,
  onDoubleClick?: () => void,
  draggingCallback?: (isDragging:boolean) => void;
};

export function DraggableWrapper(props: Props) {
  const dragRef = React.useRef(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: props.dndType,
      item: { data: props.data },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [props.data],
  )

  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1


  useEffect(() => {
    if (props.draggingCallback) props.draggingCallback(isDragging);
  }, [isDragging]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={dragRef} style={{ opacity }} className="dragButton" onDoubleClick={props.onDoubleClick} data-testid="draggable-wrapper" aria-label="Draggable item">
      {props.children}
    </div>
  );

}
