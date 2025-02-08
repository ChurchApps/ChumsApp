import React from "react";
import { useDrag } from 'react-dnd'

type Props = {
  children?: React.ReactNode,
  dndType: string, elementType?: string, data: any
  onDoubleClick?: () => void
};

export function DraggableWrapper(props: Props) {
  const dragRef = React.useRef(null)

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: props.dndType,
      item: { elementType: props.elementType, data: props.data },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [props.data],
  )

  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1

  return (
    <div ref={dragRef} style={{ opacity }} className="dragButton" onDoubleClick={props.onDoubleClick}>
      {props.children}
    </div>
  );

}
