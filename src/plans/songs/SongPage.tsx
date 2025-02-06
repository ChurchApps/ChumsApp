import React, { useEffect } from "react";
import { ApiHelper, DisplayBox } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { SongDetailInterface } from "../../helpers";
import { Grid, Table, TableBody, TableCell, TableRow } from "@mui/material";

export const SongPage = () => {
  const [song, setSong] = React.useState<any>(null)
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(null)
  const params = useParams();

  const a=true;
  const loadData = async () => {
    const s = await ApiHelper.get("/songs/" + params.id, "ContentApi");
    setSong(s);
    ApiHelper.get("/songDetails/" + s.songDetailId, "ContentApi").then(data => setSongDetail(data));


  }


  useEffect(() => { loadData() }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display="none";
  }

  const getDetails = () => {
    const result:JSX.Element[] = [];
    if (!songDetail) return result;


    if (songDetail.artist) result.push(<TableRow><TableCell><strong>Artist</strong></TableCell><TableCell>{songDetail.artist}</TableCell></TableRow>);
    if (songDetail.releaseDate) {
      const d = new Date(songDetail.releaseDate);
      result.push(<TableRow key="releaseDate"><TableCell><strong>Release Date</strong></TableCell><TableCell>{d.toLocaleDateString()}</TableCell></TableRow>);
    }
    if (songDetail.album) result.push(<TableRow key="album"><TableCell><strong>Album</strong></TableCell><TableCell>{songDetail.album}</TableCell></TableRow>);
    if (songDetail.language) result.push(<TableRow key="language"><TableCell><strong>Language</strong></TableCell><TableCell>{songDetail.language}</TableCell></TableRow>);
    if (songDetail.bpm) result.push(<TableRow key="bpm"><TableCell><strong>BPM</strong></TableCell><TableCell>{songDetail.bpm}</TableCell></TableRow>);
    if (songDetail.keySignature) result.push(<TableRow key="keySignature"><TableCell><strong>Key Signature</strong></TableCell><TableCell>{songDetail.keySignature}</TableCell></TableRow>);
    if (songDetail.seconds) result.push(<TableRow key="seconds"><TableCell><strong>Length</strong></TableCell><TableCell>{formatSeconds(songDetail.seconds)}</TableCell></TableRow>);



    if (songDetail.ccliId) result.push(<TableRow><TableCell><strong>CCLI ID</strong></TableCell><TableCell>{songDetail.ccliId}</TableCell></TableRow>);
    if (songDetail.geniusId) result.push(<TableRow><TableCell><strong>Genius ID</strong>: {songDetail.geniusId}</TableCell></TableRow>);
    if (songDetail.appleId) result.push(<TableRow><TableCell><strong>Apple ID</strong>: {songDetail.appleId}</TableCell></TableRow>);
    if (songDetail.youtubeId) result.push(<TableRow><TableCell><strong>YouTube ID</strong>: {songDetail.youtubeId}</TableCell></TableRow>);
    if (songDetail.hymnaryId) result.push(<TableRow><TableCell><strong>Hymnary ID</strong>: {songDetail.hymnaryId}</TableCell></TableRow>);
    //if (songDetail.musicBrainzId) result.push(<div key="musicBrainzId"><strong>MusicBrainz ID</strong>: {songDetail.musicBrainzId}</div>);


    return result;
  }

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }


  return (<>
    <Banner>
      <h1>{songDetail?.title}</h1>
    </Banner>
    <div id="mainContent">
      <Grid container spacing={3}>
        <Grid item md={8}>
          <DisplayBox headerText="Arrangements" headerIcon="library_music">
            test
          </DisplayBox>
          <DisplayBox headerText="Keys" headerIcon="music_note">
            test
          </DisplayBox>
        </Grid>
        <Grid item md={4}>
          <DisplayBox headerText={songDetail?.title} headerIcon="album">
            <img src={songDetail?.thumbnail} alt={songDetail?.title} style={{ display:"block", marginLeft:"auto", marginRight:"auto"}} onError={handleImageError} />
            <Table size="small">
              <TableBody>
                {getDetails()}
              </TableBody>
            </Table>
          </DisplayBox>
        </Grid>
      </Grid>

    </div>
  </>);
}

