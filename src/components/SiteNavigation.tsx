import React from "react";
import type { LinkInterface } from "@churchapps/helpers";
import { DroppableWrapper } from "./DroppableWrapper";
import { DraggableWrapper } from "./DraggableWrapper";
import { Icon } from "@mui/material";
import { NavLinkEdit } from "../site/components/NavLinkEdit";
import { TableList } from "../sermons/components/TableList";

interface Props {
  links: LinkInterface[];
  refresh: () => void;
  select: (link: LinkInterface) => void;
  handleDrop: (index: number, parentId: string, link: LinkInterface) => void;
}

export const SiteNavigation: React.FC<Props> = (props) => {
  const [editLink, setEditLink] = React.useState<LinkInterface | null>(null);

  const getNestedChildren = (arr: LinkInterface[], parent: string) => {
    const result: LinkInterface[] = [];
    for (const i in arr) {
      if (arr[i].parentId == parent) {
        const children = getNestedChildren(arr, arr[i].id);
        if (children.length) {
          arr[i].children = children;
        }
        result.push(arr[i]);
      }
    }
    return result;
  };

  const structuredLinks = props.links && getNestedChildren(props.links, undefined);

  const buildRows = (childrenLinks: LinkInterface[] = [], nestedLevel = -1): React.ReactElement[] => {
    const rows: React.ReactElement[] = [];
    const nextLevel = nestedLevel + 1;
    const style = { paddingLeft: (nextLevel * 20) + "px" } as React.CSSProperties;
    let idx = 0;
    childrenLinks.forEach((link) => {
      let linkText = link.text;
      if (!linkText || linkText.trim().length === 0) linkText = "[No Title]";

      const anchor = (
        <a
          href="about:blank"
          onClick={(e) => { e.preventDefault(); setEditLink(link); }}
          data-testid={`edit-nav-link-${link.id}`}
          aria-label={`Edit ${linkText} navigation link`}
        >
          {linkText}
        </a>
      );
      const index = idx;
      idx++;

      let dndType = "navItemLink" as "navItemLink" | "navItemParent";
      if (link.children) dndType = "navItemParent";
      const accept: ("navItemLink" | "navItemParent")[] = ["navItemLink"];
      if (nextLevel === 0) accept.push("navItemParent");

      rows.push(
        <tr key={link.id || `${linkText}-${index}`}>
          <td style={style} data-pagetype={"navItemLink"}>
            {(index === 0 && nextLevel === 0) && (
              <DroppableWrapper accept={accept} onDrop={(item) => { props.handleDrop(-1, link.parentId || "", item.data.link); }}>
                <div style={{ height: 5 }}></div>
              </DroppableWrapper>
            )}
            <DraggableWrapper dndType={dndType} data={{ link }}>
              {anchor}
            </DraggableWrapper>
            <DroppableWrapper accept={accept} onDrop={(item) => { props.handleDrop(index + 0.5, link.parentId || "", item.data.link); }}>
              <div style={{ height: 5 }}></div>
            </DroppableWrapper>
          </td>
          <td>
            {nextLevel === 0 && (
              <DroppableWrapper hideWhenInactive={true} accept={["navItemLink"]} onDrop={(item) => { props.handleDrop(-1, link.id || "", item.data.link); }}>
                <Icon style={{ height: 18 }}>chevron_right</Icon>
              </DroppableWrapper>
            )}
          </td>
        </tr>
      );

      if (link.children) rows.push(...buildRows(link.children, nextLevel));
    });
    return rows;
  };

  const rows = buildRows(structuredLinks || [], -1);
  return (
    <>
      {editLink && (
        <NavLinkEdit
          link={editLink}
          updatedCallback={() => { setEditLink(null); props.refresh(); }}
          onDone={() => { setEditLink(null); }}
          data-testid="nav-link-edit-modal"
        />
      )}
      <TableList rows={rows} />
    </>
  );
};
