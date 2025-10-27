import React, { useEffect, useState } from "react";
import { Grid, Dialog } from "@mui/material";
import { DisplayBox, ApiHelper } from "@churchapps/apphelper";
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

  const loadData = () => { ApiHelper.get("/blocks", "ContentApi").then((b: any) => setBlocks(b)); }

  useEffect(loadData, []);

  const Blocks = () => {
    let result: React.ReactElement[] = []
    blocks.forEach((b) => {
      result.push(<AddableElement key={b.id} dndType={b.blockType} elementType="block" blockId={b.id} icon={(b.blockType === "elementBlock") ? "table_chart" : "reorder"} label={b.name} draggingCallback={props.draggingCallback} />);
    });
    return <Grid container spacing={1}>{result.length > 0 ? result : <p>No blocks found</p>}</Grid>
  }

  //<AddableElement dndType="element" elementType="buttonLink" icon="smart_button" label="Button" />
  //<AddableElement dndType="element" elementType="whiteSpace" icon="rectangle" label="White Space" />
  return (
    <Dialog open={true} onClose={props.updateCallback} fullWidth maxWidth="md">
      <div>
        <DisplayBox id="dialogForm" headerText="Add" headerIcon="article" editContent={<a href="about:blank" onClick={e => { e.preventDefault(); props.updateCallback() }}>Close</a>}>
          <p>Drag and drop onto page<br /></p>

          <Grid container spacing={0}>
            <Grid size={6}>
              <h3>Simple Elements</h3>
            </Grid>
            <Grid size={3}>
              <h3>Church Specific</h3>
            </Grid>
            <Grid size={3}>
              {showBlocks && <h3>Blocks</h3>}
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid size={3}>

              <Grid container spacing={0.5}>
                {props.includeSection && (<AddableElement dndType="section" elementType="section" icon="table_rows" label="Section" draggingCallback={props.draggingCallback} />)}
                <AddableElement dndType="element" elementType="text" icon="article" label="Text" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="textWithPhoto" icon="photo" label="Text with Photo" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="image" icon="add_photo_alternate" label="Image" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="video" icon="play_circle" label="Video" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="card" icon="badge" label="Card" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="map" icon="add_location_alt" label="Location" draggingCallback={props.draggingCallback} />
              </Grid>
            </Grid>
            <Grid size={3}>
              <Grid container spacing={0.5}>
                <AddableElement dndType="element" elementType="table" icon="table_chart" label="Table" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="row" icon="reorder" label="Row" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="box" icon="check_box_outline_blank" label="Box" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="carousel" icon="view_carousel" label="Carousel" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="faq" icon="quiz" label="Expandable" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="rawHTML" icon="code" label="HTML" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="iframe" icon="crop_free" label="Embed Page" draggingCallback={props.draggingCallback} />
              </Grid>
            </Grid>
            <Grid size={3}>
              <Grid container spacing={0.5}>
                <AddableElement dndType="element" elementType="logo" icon="home_app_logo" label="Logo" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="sermons" icon="video_library" label="Sermons" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="stream" icon="live_tv" label="Stream" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="donation" icon="volunteer_activism" label="Donation" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="donateLink" icon="link" label="Donate Link" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="form" icon="format_align_left" label="Form" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="calendar" icon="calendar_month" label="Calendar" draggingCallback={props.draggingCallback} />
                <AddableElement dndType="element" elementType="groupList" icon="people" label="Group List" draggingCallback={props.draggingCallback} />
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
