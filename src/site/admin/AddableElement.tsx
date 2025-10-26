import { Grid, Icon } from "@mui/material";
import React, { useEffect } from "react";
import { useDrag } from 'react-dnd'

type Props = {
  dndType: string;
  elementType: string;
  icon: string;
  label: string;
  blockId?: string;
  draggingCallback?: () => void;
};

export function AddableElement(props: Props) {
  const dragRef = React.useRef(null)

  const [{ isDragging }, drag, preview] = useDrag(
    () => {
      let result = {
        type: props.dndType,
        item: { elementType: props.elementType, blockId: props.blockId },
        collect: (monitor:any) => ({ isDragging: !!monitor.isDragging() }),
      }
      return result;
    },
    [],
  )

  useEffect(() => {
    if (isDragging && props.draggingCallback) props.draggingCallback();
  }, [isDragging]);

  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1
  const baseStyle: any = { paddingLeft: 10, borderRadius: 5, paddingTop: 10, paddingBottom: 10, opacity, cursor: "pointer", color: "#FFF" }
  const style = (props.dndType === "section" || props.dndType === "sectionBlock")
    ? { ...baseStyle, border: "1px solid #007bff", backgroundColor: "#007bff" }
    : { ...baseStyle, border: "1px solid #28a745", backgroundColor: "#28a745" }

  return (
    <Grid size={{ xs: 12 }}>
      <div ref={dragRef} style={style}>
        <div style={{ float: "left" }}><Icon>{props.icon}</Icon></div> <span style={{ paddingLeft: 10 }}>{props.label}</span>
      </div>
    </Grid>
  );

  /*
  return (
    <Grid size={{ xs: 4 }}>
      <div ref={dragRef} style={{ textAlign: "center", border: "1px solid #CCC", borderRadius: 5, paddingTop: 10, paddingBottom: 10, opacity, cursor: "pointer" }}>
        <Icon>{props.icon}</Icon><br />
        {props.label}
      </div>
    </Grid>
  );*/
}
