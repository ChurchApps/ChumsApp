import React, { useEffect } from "react";
import { ApiHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SongSearchDialog } from "./SongSearchDialog";
import { SongDetailInterface } from "../../helpers";

export const SongsPage = () => {
  const [songs, setSongs] = React.useState<SongDetailInterface[]>(null)
  const [showSearch, setShowSearch] = React.useState(false)

  const a=true;
  const loadData = async () => {
    ApiHelper.get("/songDetails", "ContentApi").then(data => setSongs(data));

  }

  const handleAdd = () => {
    loadData();
    setShowSearch(false);
  }

  useEffect(() => { loadData() }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display="none";
  }

  const getRows = () => {
    const result:JSX.Element[] = [];
    songs?.forEach((songDetail) => {
      result.push(
        <TableRow key={songDetail.id}>
          <TableCell><img src={songDetail.thumbnail} alt={songDetail.title} style={{width:50,height:50}} onError={handleImageError} /></TableCell>
          <TableCell><Link to={"/plans/songs/" + (songDetail as any).songId}>{songDetail.title}</Link></TableCell>
          <TableCell>{songDetail.artist}</TableCell>
        </TableRow>
      );
    });
    return result;
  }

  return (<>
    <Banner>
      <Button onClick={() => {setShowSearch(true);}} variant="contained" color="success" style={{float:"right", marginTop:6}}>Add Song</Button>
      <h1>Songs</h1>
    </Banner>
    <div id="mainContent">
      <DisplayBox headerText="Song Library" headerIcon="album">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{width:60}}></TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
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

