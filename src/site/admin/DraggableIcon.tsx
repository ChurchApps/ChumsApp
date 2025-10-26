import { Icon } from "@mui/material";
import React from "react";
import { useDrag } from 'react-dnd'

type Props = {
  dndType: string, elementType: string, data: any
};

export function DraggableIcon(props: Props) {
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
    <div ref={dragRef} style={{ opacity }} className="dragButton">
      <Icon>open_with</Icon><br />
    </div>
  );

  /*
  return (
    <div>
      <div ref={dragRef} className="dragButton" style={{ opacity }}>
        <Icon>open_with</Icon>
      </div>
    </div>
  );*/
}
