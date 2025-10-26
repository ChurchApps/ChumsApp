import React, { CSSProperties, useState } from "react";
import type { ElementInterface, SectionInterface } from "../../helpers";
import { ApiHelper, StyleHelper } from "../../helpers";
import { Box, Container } from "@mui/material";
import { DroppableArea, DraggableWrapper, Element } from "@churchapps/apphelper-website";
import type { ChurchInterface } from "@churchapps/helpers";

interface Props {
  first?: boolean,
  section: SectionInterface,
  church?: ChurchInterface;
  churchSettings: any;
  onEdit?: (section: SectionInterface, element: ElementInterface) => void;
  onMove?: () => void;
}

export const Section: React.FC<Props> = props => {
  const [isDragging, setIsDragging] = useState(false);


  const getElements = () => {
    const result: React.ReactElement[] = []
    props.section?.elements?.forEach(e => {
      const textColor = StyleHelper.getTextColor(props.section?.textColor, {}, props.churchSettings);
      result.push(<Element key={e.id} element={e} onEdit={props.onEdit} onMove={props.onMove} church={props.church} churchSettings={props.churchSettings} textColor={textColor} />)
    });
    return result;
  }

  const getStyle = () => {

    let result: CSSProperties = {}
    if (props.section.background.indexOf("/") > -1) {
      result = {
        backgroundImage: "url('" + props.section.background + "')"
      };
    } else {
      result = { background: props.section.background };
    }
    if (props.section.textColor?.startsWith("var(")) result.color = props.section.textColor;

    result = { ...result };
    //console.log("SECTION STYLE", result)
    return result;
  }

  const getVideoClassName = () => {
    let result = "sectionVideo";
    if (props.section.textColor === "light") result += " sectionDark"
    if (props.first) result += " sectionFirst"
    if (props.onEdit) result += " sectionWrapper";
    return result;
  }

  const getClassName = () => {
    let result = "section";
    if (props.section.background.indexOf("/") > -1) result += " sectionBG"
    if (props.section.textColor === "light") result += " sectionDark"
    if (props.first) result += " sectionFirst";
    if (props.onEdit) result += " sectionWrapper";

    let hc = props.section.headingColor;
    if (hc) {
      hc = hc.replace("var(--", "").replace(")", "");
      result += " headings" + hc[0].toUpperCase() + hc.slice(1);
    }
    let lc = props.section.linkColor;
    if (lc) {
      lc = lc.replace("var(--", "").replace(")", "");
      result += " links" + lc[0].toUpperCase() + lc.slice(1);
    }

    return result;
  }

  /*
  const getEdit = () => {
    if (props.onEdit) {
      return (
        <div className="sectionActions">
          <table style={{ float: "right" }}>
            <tbody>
              <tr>
                <td><DraggableIcon dndType="section" elementType="section" data={props.section} /></td>
                <td>
                  <div className="sectionEditButton">
                    <SmallButton icon="edit" onClick={() => props.onEdit(props.section, null)} toolTip="section" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }*/

  const handleDrop = (data: any, sort: number) => {
    if (data.data) {
      const element: ElementInterface = data.data;
      element.sort = sort;
      element.sectionId = props.section.id;
      ApiHelper.post("/elements", [element], "ContentApi").then(() => { props.onMove() });
    }
    else {
      const element: ElementInterface = { sectionId: props.section.id, elementType: data.elementType, sort, blockId: props.section.blockId };
      if (data.blockId) element.answersJSON = JSON.stringify({ targetBlockId: data.blockId });
      else if (data.elementType === "row") element.answersJSON = JSON.stringify({ columns: "6,6" });
      else if (data.elementType === "box") element.answersJSON = JSON.stringify({ background: "var(--light)", text: "var(--dark)" });
      props.onEdit(null, element);
    }
  }

  const getAddElement = (s: number) => {
    const sort = s;
    return (<DroppableArea accept={["element", "elementBlock"]} onDrop={(data) => handleDrop(data, sort)} updateIsDragging={(dragging) => setIsDragging(dragging)} />);
    //return (<div style={{ textAlign: "center", background: "rgba(230,230,230,0.25)" }}><SmallButton icon="add" onClick={() => props.onEdit(null, { sectionId: props.section.id, elementType: "textWithPhoto", sort })} toolTip="Add Element" /></div>)
  }

  let contents = (<Container>
    {props.onEdit && getAddElement(0)}
    {getElements()}
  </Container>);


  const getSectionAnchor = () => {
    if (props.section.answers?.sectionId) return <a id={props.section.answers?.sectionId} className="sectionAnchor"></a>;
    else return <></>;
  }

  const getId = () => {
    let result = "section-" + props.section.answers?.sectionId?.toString()
    if (result==="section-undefined") result = "section-" + props.section.id;
    return result;
  }

  let result = <></>;
  result = (<>{getSectionAnchor()}<Box component="div" sx={{ ":before": { opacity: (props.section.answers?.backgroundOpacity) ? props.section.answers.backgroundOpacity + " !important" : "" } }} style={getStyle()} className={getClassName()} id={getId()}>{contents}</Box></>);

  if (props.onEdit) {
    return (
      <DraggableWrapper  dndType="section" elementType="section" data={props.section} onDoubleClick={() => props.onEdit(props.section, null)}>
        {result}
      </DraggableWrapper>
    );
  } else return result;
}
