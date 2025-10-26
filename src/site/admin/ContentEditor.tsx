import { CSSProperties, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Dialog, Grid, Icon, ThemeProvider, ToggleButton, ToggleButtonGroup, Tooltip, createTheme } from "@mui/material";
import { useWindowWidth } from "@react-hook/window-size";
import type { BlockInterface, ElementInterface, PageInterface, SectionInterface, GlobalStyleInterface } from "../../helpers/Interfaces";
import { ApiHelper, ArrayHelper, UserHelper } from "../../helpers";
import { Permissions } from "@churchapps/helpers";
import { SmallButton, DisplayBox } from "@churchapps/apphelper";
import { Section } from "./Section";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React from "react";
import { DroppableArea } from "@churchapps/apphelper-website";
import { SectionBlock } from "./SectionBlock";
import { StyleHelper } from "../../helpers/StyleHelper";
import { ElementAdd } from "./elements/ElementAdd";
import { ElementEdit } from "./elements/ElementEdit";
import { SectionEdit } from "./SectionEdit";
import { DroppableScroll } from "./DroppableScroll";
import UserContext from "../../UserContext";

interface Props {
  loadData: (id: string) => Promise<any>,
  pageId?: string,
  blockId?: string
  onDone?: (url?: string) => void
  globalStyles?: GlobalStyleInterface
};

export function ContentEditor(props: Props) {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const [container, setContainer] = useState<PageInterface | BlockInterface>(null);
  const [editSection, setEditSection] = useState<SectionInterface>(null);
  const [editElement, setEditElement] = useState<ElementInterface>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [deviceType, setDeviceType] = useState("desktop");
  const windowWidth = useWindowWidth();

  const [showAdd, setShowAdd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const css = StyleHelper.getCss(container?.sections || []);

  let elementOnlyMode = false;
  if (props.blockId && container?.sections?.length===1 && container?.sections[0]?.id==="") elementOnlyMode = true;

  const zones: any = {
    cleanCentered: ["main"],
    embed: ["main"],
    headerFooter: ["main", "footer"],
  }

  const churchSettings = context?.userChurch?.settings || {};

  useEffect(() => {
    if (!UserHelper.checkAccess(Permissions.contentApi.content.edit)) navigate("/site");
  }, []);

  const loadDataInternal = () => {
    if (UserHelper.checkAccess(Permissions.contentApi.content.edit)) {
      props.loadData(props.pageId || props.blockId).then((p: PageInterface | BlockInterface) => {
        setContainer(p);
      });
    }
  }

  useEffect(loadDataInternal, [props.pageId, props.blockId]);

  useEffect(() => {
    if (windowWidth < 883) navigate("/site");
  }, [windowWidth]);

  const handleDrop = (data: any, sort: number, zone: string) => {
    if (data.data) {
      const section: SectionInterface = data.data;
      section.sort = sort;
      section.zone = zone;
      section.pageId = (zone === "footer") ? null : props.pageId;
      ApiHelper.post("/sections", [section], "ContentApi").then(() => { loadDataInternal() });
    }
    else {
      const sec = { sort, background: "#FFF", textColor: "dark", pageId: props.pageId, blockId: props.blockId, targetBlockId: data.blockId, zone: zone }
      if (sec.zone === "footer") sec.pageId = null;
      setEditSection(sec);
    }
  }

  const getAddSection = (s: number, zone: string, droppableAreaText?: string) => {
    const sort = s;
    return (<DroppableArea key={"addSection_" + zone + "_" + s.toString()} text={droppableAreaText} accept={["section", "sectionBlock"]} onDrop={(data) => handleDrop(data, sort, zone)} />);
  }

  const getSections = (zone: string) => {
    const result: React.ReactElement[] = []
    result.push(getAddSection(0, zone));
    const sections = (zone === "block") ? container?.sections : ArrayHelper.getAll(container?.sections, "zone", zone);
    sections?.forEach(section => {
      if (section.targetBlockId) result.push(<SectionBlock key={section.id} section={section} churchSettings={churchSettings} onEdit={handleSectionEdit} onMove={() => { loadDataInternal() }} />)
      else result.push(<Section key={section.id} section={section} churchSettings={churchSettings} onEdit={handleSectionEdit} onMove={() => { loadDataInternal() }} church={context?.userChurch?.church} />)
      result.push(getAddSection(section.sort + 0.1, zone));
    });

    if (sections.length === 0) result.push(<Container key="empty"><p>Add a section to get started</p></Container>)
    return result;
  }

  const handleSectionEdit = (s: SectionInterface, e: ElementInterface) => {
    if (s) setEditSection(s);
    else if (e) setEditElement(e);
  }

  let rightBarStyle: CSSProperties = {}

  if (typeof window !== "undefined") {
    const editorBar = document.getElementById("editorBar");
    if (window.innerWidth > 900) {
      if (window?.innerHeight) {
        if (scrollTop < 50) rightBarStyle = { paddingTop: 70 };
      }
    }
  }

  const handleDone = () => {
    let url = '';
    if (props.pageId) {
      const page = container as PageInterface;
      if (page.layout === "embed") {
        if (page.url.includes("/stream")) url = '/admin/video/settings';
      }
    }
    if (props.onDone) props.onDone(url);
    else navigate(`/site/pages/preview/${props.pageId}`);
  }

  useEffect(() => {
    const onScroll = (e: any) => { setScrollTop(e.target.documentElement.scrollTop); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);


  const handleRealtimeChange = (element: ElementInterface) => {
    const c = { ...container };
    c.sections.forEach(s => {
      realtimeUpdateElement(element, s.elements);
    })
    setContainer(c);
  }

  const realtimeUpdateElement = (element: ElementInterface, elements: ElementInterface[]) => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === element.id) {
        elements[i] = element;
        return;
      }
      if (elements[i].elements && elements[i].elements.length > 0) {
        realtimeUpdateElement(element, elements[i].elements);
      }
    }
  }

  const getTheme = () => {
    if (deviceType === "mobile") return createTheme({
      breakpoints: {
        values: { xs: 0, sm: 2000, md: 3000, lg: 4000, xl: 5000 },
      },
      components: {
        MuiTextField: { defaultProps: { margin: "normal" } },
        MuiFormControl: { defaultProps: { margin: "normal" } }
      }
    });
    else return createTheme({
      components: {
        MuiTextField: { defaultProps: { margin: "normal" } },
        MuiFormControl: { defaultProps: { margin: "normal" } }
      }
    });
  }

  const getZoneBox = (sections: SectionInterface[], name: string, keyName: string) => <div key={"zone-" + keyName} style={{ minHeight: 100 }}>
    <div style={{ position: "absolute", backgroundColor: "#FFF", zIndex: 99, padding: 10, border: "1px solid #999", opacity: 0.5 }}>Zone: {keyName}</div>
    <div style={{ minHeight: 100 }}>
      <>
        <div className="page" style={(deviceType === "mobile" ? { width: 400, marginLeft: "auto", marginRight: "auto" } : {})}>
          {getSections(keyName)}
        </div>
      </>
    </div>
    <div style={{ height: "31px" }}></div>
  </div>

  const getZoneBoxes = () => {
    let result: any[] = [];
    let idx = 0;
    if (props.pageId) {
      const page = container as PageInterface;
      zones[page?.layout]?.forEach((z: string) => {
        const sections = ArrayHelper.getAll(page?.sections, "zone", z);
        const name = z.substring(0, 1).toUpperCase() + z.substring(1, z.length);
        result.push(getZoneBox(sections, name, z));
        idx++;
      });
    } else {
      const block = container as BlockInterface;
      if (block) result.push(getZoneBox((container as BlockInterface)?.sections, "Block Preview", "block"));
    }
    return <>{result}</>
  }

  const getHelp = () => (
    <Dialog open={true} onClose={() => { setShowHelp(false) }} fullWidth maxWidth="sm">
      <DisplayBox id="dialogForm" headerIcon="help" headerText="Help">
        <p>Use the plus icon in the corner to add new sections and elements to a page.  All elements must go within a section.</p>
        <p>Doubleclick any section or element to edit or remove it.</p>
        <p>Click and drag and section or element to rearrange content.</p>
      </DisplayBox>
    </Dialog>
  )



  return (<>
    <style>{css}</style>

    <div style={{ backgroundColor: "#FFF", position: "sticky", top: 0, width: "100%", zIndex: 1000, boxShadow: "0px 2px 2px black", marginBottom: 10 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }} style={{ paddingLeft: 40, paddingTop: 8 }}>
          <SmallButton icon={"done"} text="Done" onClick={handleDone} data-testid="content-editor-done-button" />
        </Grid>
        <Grid size={{ xs: 4 }} style={{ textAlign: "center" }}>
          <b>
            {props.pageId && "Page: " + (container as PageInterface)?.title}
            {props.blockId && "Block: " + (container as BlockInterface)?.name}
          </b>
        </Grid>
        <Grid size={{ xs: 4 }} style={{ textAlign: "right", paddingTop: 5, paddingBottom: 5, paddingRight: 15 }}>
          <div style={{ float: "right", display: "flex", backgroundColor: "#1976d2" }}>
            <ToggleButtonGroup value={showHelp.toString()} exclusive size="small">
              <ToggleButton value="true" onClick={() => setShowHelp(!showHelp)} style={{ borderRight: "1px solid #FFF", color: "#FFF" }}><Tooltip title="Help" placement="top"><Icon>help</Icon></Tooltip></ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value={showAdd.toString()} exclusive size="small">
              <ToggleButton value="true" onClick={() => setShowAdd(!showAdd)} style={{ borderRight: "1px solid #FFF", color: "#FFF" }}><Tooltip title="Add Content" placement="top"><Icon>add</Icon></Tooltip></ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup size="small" value={deviceType} exclusive onChange={(e, newDeviceType) => { if (newDeviceType !== null) setDeviceType(newDeviceType) }}>
              {deviceType === "desktop" && <ToggleButton size="small" value="mobile" style={{ color: "#FFF" }}><Tooltip title="Desktop" placement="top"><Icon>computer</Icon></Tooltip></ToggleButton>}
              {deviceType === "mobile" && <ToggleButton size="small" value="desktop" style={{ color: "#FFF" }}><Tooltip title="Mobile" placement="top"><Icon>smartphone</Icon></Tooltip></ToggleButton>}
            </ToggleButtonGroup>
          </div>
        </Grid>
      </Grid>
    </div>



    <DndProvider backend={HTML5Backend}>
      {showHelp && getHelp()}
      {showAdd && <ElementAdd includeBlocks={!elementOnlyMode} includeSection={!elementOnlyMode} updateCallback={() => { setShowAdd(false); }} draggingCallback={() => setShowAdd(false)} />}
      {editElement && <ElementEdit element={editElement} updatedCallback={(updatedElement) => {
        setEditElement(null);
        if (updatedElement) {
          const isNewElement = !editElement.id;
          if (isNewElement) loadDataInternal();
          else {
            const c = { ...container };
            c.sections.forEach(s => {
              realtimeUpdateElement(updatedElement, s.elements);
            });
            setContainer(c);
          }
        } else {
          loadDataInternal();
        }
      }} onRealtimeChange={handleRealtimeChange} globalStyles={props.globalStyles} />}
      {editSection && <SectionEdit section={editSection} updatedCallback={() => { setEditSection(null); loadDataInternal(); }} globalStyles={props.globalStyles} />}

      <div>
        {scrollTop > 150
          && <div style={{ position: "fixed", bottom: 30, zIndex: 1000, width: 500, marginLeft: 300 }}>
            <DroppableScroll key={"scrollDown"} text={"Scroll Down"} direction="down" />
          </div>}
        {scrollTop > 150 && <div style={{ position: "fixed", top: 50, zIndex: 1000, width: 500, marginLeft: 300 }}>
          <DroppableScroll key={"scrollUp"} text={"Scroll Up"} direction="up" />
        </div>}


        <h1 style={{ marginTop: -50 }}>Edit Page</h1>
        <ThemeProvider theme={getTheme()}>
          {getZoneBoxes()}
        </ThemeProvider>
      </div>
    </DndProvider>

  </>);
}
