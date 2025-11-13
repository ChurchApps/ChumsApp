import { CSSProperties } from "react";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Icon } from "@mui/material";

type Props = {
  accept: any;
  onDrop: (data: any) => void;
  text?: string;
  updateIsDragging?: (isDragging: boolean) => void;
  dndDeps?: any;
};

export function EnhancedDroppableArea(props: Props) {
  const { accept, onDrop, text, updateIsDragging, dndDeps } = props;
  const [isDragging, setIsDragging] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (data) => onDrop(data),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [dndDeps]
  );

  // Update dragging state via effect to avoid state updates during render
  useEffect(() => {
    setIsDragging(canDrop);
  }, [canDrop]);

  useEffect(() => {
    if (updateIsDragging) updateIsDragging(isDragging);
  }, [isDragging, updateIsDragging]);

  // Enhanced droppable zone styling
  const getDroppableStyle = (): CSSProperties => {
    // When nothing is being dragged - completely invisible/minimal
    if (!canDrop) {
      return {
        width: "100%",
        minHeight: "4px",
        padding: "2px",
        border: "none",
        backgroundColor: "transparent",
        borderRadius: "4px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }

    // When dragging - show full drop zone UI
    const baseStyle: CSSProperties = {
      width: "100%",
      minHeight: "60px",
      padding: "20px 10px",
      borderRadius: "8px",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    };

    if (isOver) {
      return {
        ...baseStyle,
        border: "2px dashed rgba(25, 118, 210, 0.8)",
        backgroundColor: "rgba(25, 118, 210, 0.12)",
        transform: "scale(1.01)",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
      };
    }

    return {
      ...baseStyle,
      border: "2px dashed rgba(25, 118, 210, 0.4)",
      backgroundColor: "rgba(25, 118, 210, 0.06)",
    };
  };

  // Display text based on state
  const displayText = text || "Drop here to add";

  return (
    <div
      ref={drop as any}
      style={getDroppableStyle()}
      data-testid="enhanced-droppable-area"
      aria-label={canDrop ? `Drop zone: ${displayText}` : ""}
      role={canDrop ? "region" : undefined}
    >
      {canDrop && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "rgba(25, 118, 210, 0.8)",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}>
          <Icon style={{
            fontSize: "1.25rem",
            transition: "transform 0.2s ease",
            transform: isOver ? "scale(1.1)" : "scale(1)",
          }}>
            {isOver ? "add_circle" : "add_circle_outline"}
          </Icon>
          <span>{displayText}</span>
        </div>
      )}
    </div>
  );
}
