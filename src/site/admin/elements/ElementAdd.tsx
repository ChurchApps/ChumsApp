import React, { useEffect, useState } from "react";
import { Grid, Dialog } from "@mui/material";
import { DisplayBox, ApiHelper, Locale } from "@churchapps/apphelper";
import type { BlockInterface } from "../../../helpers";
import { AddableElement } from "../AddableElement";

type Props = {
  includeBlocks: boolean
  includeSection: boolean
  updateCallback: () => void
  draggingCallback: () => void
};

export function ElementAdd(props: Props) {
  const [blocks, setBlocks] = useState<BlockInterface[]>([]);
  const showBlocks = props.includeBlocks && blocks.length > 0;

  const loadData = () => { ApiHelper.get("/blocks", "ContentApi").then((b: any) => setBlocks(b)); };

  useEffect(loadData, []);

  const Blocks = () => {
    const result: React.ReactElement[] = [];
    blocks.forEach((b) => {
      result.push(<AddableElement key={b.id} dndType={b.blockType} elementType="block" blockId={b.id} icon={(b.blockType === "elementBlock") ? "table_chart" : "reorder"} label={b.name} draggingCallback={props.draggingCallback} />);
    });
    return <Grid container spacing={1}>{result.length > 0 ? result : <p>{Locale.label("site.elementAdd.noBlocksFound")}</p>}</Grid>;
  };

  //<AddableElement dndType="element" elementType="buttonLink" icon="smart_button" label="Button" />
  //<AddableElement dndType="element" elementType="whiteSpace" icon="rectangle" label="White Space" />
  return (
    <Dialog open={true} onClose={props.updateCallback} fullWidth maxWidth="md">
      <div>
        <DisplayBox id="dialogForm" headerText={Locale.label("common.add")} headerIcon="article" editContent={<a href="about:blank" onClick={e => { e.preventDefault(); props.updateCallback(); }}>{Locale.label("common.close")}</a>}>
          <p>{Locale.label("site.elementAdd.dragAndDrop")}<br /></p>

          <Grid container spacing={0}>
            <Grid size={6}>
              <h3>{Locale.label("site.elementAdd.simpleElements")}</h3>
            </Grid>
            <Grid size={3}>
              <h3>{Locale.label("site.elementAdd.churchSpecific")}</h3>
            </Grid>
            <Grid size={3}>
              {showBlocks && <h3>{Locale.label("site.elementAdd.blocks")}</h3>}
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid size={3}>

              <Grid container spacing={0.5}>
                {props.includeSection && (<AddableElement dndType="section" elementType="section" icon="table_rows" label={Locale.label("site.elementAdd.section")} draggingCallback={props.draggingCallback} />)}
                <AddableElement dndType="element" elementType="text" icon="article" label={Locale.label("site.elementAdd.text")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="textWithPhoto" icon="photo" label={Locale.label("site.elementAdd.textWithPhoto")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="image" icon="add_photo_alternate" label={Locale.label("site.elementAdd.image")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="video" icon="play_circle" label={Locale.label("site.elementAdd.video")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="card" icon="badge" label={Locale.label("site.elementAdd.card")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="map" icon="add_location_alt" label={Locale.label("site.elementAdd.location")} draggingCallback={props.draggingCallback} />
              </Grid>
            </Grid>
            <Grid size={3}>
              <Grid container spacing={0.5}>
                <AddableElement dndType="element" elementType="table" icon="table_chart" label={Locale.label("site.elementAdd.table")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="row" icon="reorder" label={Locale.label("site.elementAdd.row")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="box" icon="check_box_outline_blank" label={Locale.label("site.elementAdd.box")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="carousel" icon="view_carousel" label={Locale.label("site.elementAdd.carousel")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="faq" icon="quiz" label={Locale.label("site.elementAdd.expandable")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="rawHTML" icon="code" label={Locale.label("site.elementAdd.html")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="iframe" icon="crop_free" label={Locale.label("site.elementAdd.embedPage")} draggingCallback={props.draggingCallback} />
              </Grid>
            </Grid>
            <Grid size={3}>
              <Grid container spacing={0.5}>
                <AddableElement dndType="element" elementType="logo" icon="home_app_logo" label={Locale.label("site.elementAdd.logo")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="sermons" icon="video_library" label={Locale.label("common.sermons")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="stream" icon="live_tv" label={Locale.label("site.elementAdd.stream")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="donation" icon="volunteer_activism" label={Locale.label("site.elementAdd.donation")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="donateLink" icon="link" label={Locale.label("site.elementAdd.donateLink")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="form" icon="format_align_left" label={Locale.label("site.elementAdd.form")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="calendar" icon="calendar_month" label={Locale.label("site.elementAdd.calendar")} draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="groupList" icon="people" label={Locale.label("site.elementAdd.groupList")} draggingCallback={props.draggingCallback} />
              </Grid>
            </Grid>
            {showBlocks && (
              <Grid size={3}>
                <Grid container spacing={0.5}>
                  <Blocks />
                </Grid>
              </Grid>
            )}
          </Grid>




        </DisplayBox>
      </div>
    </Dialog>
  );
}
