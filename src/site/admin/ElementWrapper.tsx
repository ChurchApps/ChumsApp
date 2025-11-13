import React from "react";
import { Element } from "@churchapps/apphelper-website";
import { DraggableWrapper } from "@churchapps/apphelper-website";
import type { ElementInterface } from "../../helpers";
import type { ChurchInterface } from "@churchapps/helpers";

interface Props {
  element: ElementInterface;
  church?: ChurchInterface;
  churchSettings: any;
  textColor?: string;
  onEdit?: (section: any, element: ElementInterface) => void;
  onMove?: () => void;
}

/**
 * Wrapper component for Element that handles dragging and double-click editing.
 * All element types now use the package's Element component with the enhanced
 * DroppableArea styling that was integrated into the AppHelper package.
 */
export const ElementWrapper: React.FC<Props> = (props) => {
  const { onEdit, ...elementProps } = props;

  // Use the package Element component for all element types
  const element = <Element {...props} />;

  // If we're in edit mode, wrap with DraggableWrapper and add double-click handler
  if (onEdit) {
    return (
      <DraggableWrapper
        dndType="element"
        elementType={props.element.elementType || ""}
        data={props.element}
      >
        <div
          className={"elementWrapper " + props.element.elementType}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onEdit(null, props.element);
          }}
        >
          {element}
        </div>
      </DraggableWrapper>
    );
  }

  // Non-edit mode: just render the element
  return element;
};
