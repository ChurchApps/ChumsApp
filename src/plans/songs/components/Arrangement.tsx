import React, { useEffect } from "react";


import { ArrangementInterface, SongDetailInterface } from "../../../helpers";
import { ChordProHelper } from "../../../helpers/ChordProHelper";
import { ApiHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
import { PraiseChartsProducts } from "./PraiseChartsProducts";
import { SongDetails } from "./SongDetails";
import { Keys } from "./Keys";
import { ArrangementEdit } from "./ArrangementEdit";


interface Props {
  arrangement: ArrangementInterface;
  reload: () => void;
}


export const Arrangement = (props: Props) => {
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(null)
  const [edit, setEdit] = React.useState(false);


  const loadData = async () => {
    if (props.arrangement) {
      const sd: SongDetailInterface = await ApiHelper.get("/songDetails/" + props.arrangement.songDetailId, "ContentApi");
      setSongDetail(sd);
    }
  }

  useEffect(() => { loadData() }, [props.arrangement]) //eslint-disable-line react-hooks/exhaustive-deps

  //<DisplayBox headerText="Keys" headerIcon="music_note">
  //<PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />

  const importLyrics = async () => {
    const data: any = await ApiHelper.get("/praiseCharts/raw/" + songDetail.praiseChartsId, "ContentApi");
    const a = { ...props.arrangement }
    const lines = data.details.lyrics.split("\n");
    const newLines = [];
    let nextLineIsTitle = true;
    for (let i = 0; i < lines.length; i++) {
      if (nextLineIsTitle) newLines.push("[" + lines[i] + "]");
      else newLines.push(lines[i]);
      if (lines[i].trim() === "") nextLineIsTitle = true;
      else nextLineIsTitle = false;
    }
    a.lyrics = newLines.join("\n");
    ApiHelper.post("/arrangements", [a], "ContentApi").then(() => {
      props.reload();
    });
  }


  return (<>
    <Grid container spacing={2}>
      <Grid item md={8}>
        <Keys arrangement={props.arrangement} songDetail={songDetail} importLyrics={importLyrics} />
        {!edit && <DisplayBox headerText="Lyrics" headerIcon="music_note" editFunction={() => { setEdit(true) }}>
          <div className="chordPro" dangerouslySetInnerHTML={{ __html: ChordProHelper.formatLyrics(props.arrangement?.lyrics || "Manually enter or import from PraiseCharts", 0) }}></div>
        </DisplayBox>}
        {edit && <ArrangementEdit arrangement={props.arrangement} onSave={(arrangement: ArrangementInterface) => { setEdit(false); props.reload(); }} onCancel={() => { setEdit(false); }} />}
      </Grid>
      <Grid item md={4}>
        <SongDetails songDetail={songDetail} reload={loadData} />
      </Grid>
    </Grid>
  </>)
}

