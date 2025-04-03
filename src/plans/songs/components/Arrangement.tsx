import React, { useEffect } from "react";


import { ArrangementInterface, SongDetailInterface } from "../../../helpers";
import { ChordProHelper } from "../../../helpers/ChordProHelper";
import { ApiHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
import { PraiseChartsProducts } from "./PraiseChartsProducts";
import { SongDetails } from "./SongDetails";
import { Keys } from "./Keys";



interface Props {
  arrangement: ArrangementInterface;
}




export const Arrangement = (props: Props) => {
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(null)


  const loadData = async () => {
    if (props.arrangement) {
      const sd: SongDetailInterface = await ApiHelper.get("/songDetails/" + props.arrangement.songDetailId, "ContentApi");
      setSongDetail(sd);
    }
  }

  useEffect(() => { loadData() }, [props.arrangement]) //eslint-disable-line react-hooks/exhaustive-deps

  //<DisplayBox headerText="Keys" headerIcon="music_note">
  //<PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />


  return (<>
    <Grid container spacing={2}>
      <Grid item md={8}>
        <Keys arrangement={props.arrangement} songDetail={songDetail} />
        <DisplayBox headerText="Lyrics" headerIcon="music_note">
          <div className="chordPro" dangerouslySetInnerHTML={{ __html: ChordProHelper.formatLyrics(props.arrangement?.lyrics || "Manually enter or import from PraiseCharts", 0) }}></div>
        </DisplayBox>
      </Grid>
      <Grid item md={4}>
        <SongDetails songDetail={songDetail} reload={loadData} />
      </Grid>
    </Grid>
  </>)
}

