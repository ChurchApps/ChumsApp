import React, { useEffect } from "react";
import { ApiHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link, Navigate } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SongSearchDialog } from "./SongSearchDialog";
import { ArrangementInterface, SongDetailInterface, SongInterface } from "../../helpers";

export const SongsPage = () => {
  const [songs, setSongs] = React.useState<SongDetailInterface[]>(null)
  const [showSearch, setShowSearch] = React.useState(false)
  const [redirect, setRedirect] = React.useState("")

  const a = true;
  const loadData = async () => {
    ApiHelper.get("/songDetails", "ContentApi").then(data => setSongs(data));

  }

  const handleAdd = async (songDetail: SongDetailInterface) => {

    let selectedSong = null;
    if (!songDetail.id) {
      songDetail = await ApiHelper.post("/songDetails/create", songDetail, "ContentApi")
    }

    const existing = await ApiHelper.get("/arrangements/songDetail/" + songDetail.id, "ContentApi");
    if (existing.length > 0) {
      const song = await ApiHelper.get("/songs/" + existing[0].songId, "ContentApi");
      selectedSong = song;
    } else {
      const s: SongInterface = { name: songDetail.title, dateAdded: new Date() };
      const songs = await ApiHelper.post("/songs", [s], "ContentApi");
      const a: ArrangementInterface = { songId: songs[0].id, songDetailId: songDetail.id, name: "(Default)", lyrics: "" };
      await ApiHelper.post("/arrangements", [a], "ContentApi");
      selectedSong = songs[0];
    }


    loadData();
    setShowSearch(false);
    setRedirect("/plans/songs/" + selectedSong.id);
  }

  useEffect(() => { loadData() }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    songs?.forEach((songDetail) => {
      result.push(
        <TableRow key={songDetail.id}>
          <TableCell><img src={songDetail.thumbnail} alt={songDetail.title} style={{ width: 50, height: 50 }} onError={handleImageError} /></TableCell>
          <TableCell><Link to={"/plans/songs/" + (songDetail as any).songId}>{songDetail.title}</Link></TableCell>
          <TableCell>{songDetail.artist}</TableCell>
          <TableCell>{(songDetail.seconds) ? formatSeconds(songDetail.seconds) : ""}</TableCell>
        </TableRow>
      );
    });
    return result;
  }

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  if (redirect) return <Navigate to={redirect} />
  else return (<>
    <Banner>
      <Button onClick={() => { setShowSearch(true); }} variant="contained" color="success" style={{ float: "right", marginTop: 6 }}>Add Song</Button>
      <h1>Songs</h1>
    </Banner>
    <div id="mainContent">
      <DisplayBox headerText="Song Library" headerIcon="album">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 60 }}></TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Length</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRows()}
          </TableBody>
        </Table>
      </DisplayBox>
    </div>
    {showSearch && <SongSearchDialog onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
  </>);
}

