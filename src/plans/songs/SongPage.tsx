import React, { useEffect } from "react";
import { ApiHelper, DateHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link, useParams } from "react-router-dom";
import { SongDetailInterface } from "../../helpers";
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Icon } from "@mui/material";
import { SongDetails } from "./components/SongDetails";
import { Arrangements } from "./components/Arrangements";

export const SongPage = () => {
  const [song, setSong] = React.useState<any>(null)
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(null)
  const params = useParams();

  const loadData = async () => {
    const s = await ApiHelper.get("/songs/" + params.id, "ContentApi");
    setSong(s);
    ApiHelper.get("/songDetails/" + s.songDetailId, "ContentApi").then(data => setSongDetail(data));
  }

  useEffect(() => { loadData() }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    <Banner>
      <h1>{songDetail?.title}</h1>
    </Banner>
    <div id="mainContent">
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Arrangements song={song} reload={loadData} />
          <DisplayBox headerText="Keys" headerIcon="music_note">
            test
          </DisplayBox>
        </Grid>
        <Grid item md={4}>
          <SongDetails songDetail={songDetail} reload={loadData} />
        </Grid>
      </Grid>

    </div>
  </>);
}

