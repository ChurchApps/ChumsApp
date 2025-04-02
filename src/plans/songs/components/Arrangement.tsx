import React, { useEffect } from "react";


import { ArrangementInterface, SongDetailInterface } from "../../../helpers";
import { ChordProHelper } from "../../../helpers/ChordProHelper";
import { ApiHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { PraiseChartsProducts } from "./PraiseChartsProducts";
import { SongDetails } from "./SongDetails";



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


  return (<>
    <Grid container spacing={2}>
      <Grid item md={8}>
        <DisplayBox headerText="Keys" headerIcon="music_note">
          <PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />
        </DisplayBox>
      </Grid>
      <Grid item md={4}>
        <SongDetails songDetail={songDetail} reload={loadData} />
      </Grid>
    </Grid>
  </>)
}

