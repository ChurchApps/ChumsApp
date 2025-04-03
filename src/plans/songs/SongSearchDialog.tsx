import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { ArrangementInterface, SongDetailInterface, SongInterface } from "../../helpers";

interface Props {
  onClose: () => void,
  onSelect: (song: SongInterface) => void
}

export const SongSearchDialog: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [songDetails, setSongDetails] = React.useState<SongDetailInterface[]>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    ApiHelper.get("/songDetails/praiseCharts/search?q=" + searchText, "ContentApi").then((data) => { setSongDetails(data); });

  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
  }

  const handleSongClick = async (songDetail: SongDetailInterface) => {
    if (!songDetail.id) {
      songDetail = await ApiHelper.post("/songDetails/create", songDetail, "ContentApi")
    }

    const existing = await ApiHelper.get("/arrangements/songDetail/" + songDetail.id, "ContentApi");
    if (existing.length > 0) {
      const song = await ApiHelper.get("/songs/" + existing[0].songId, "ContentApi");
      props.onSelect(song);
    } else {
      const s: SongInterface = { name: songDetail.title, dateAdded: new Date() };
      const songs = await ApiHelper.post("/songs", [s], "ContentApi");
      const a: ArrangementInterface = { songId: songs[0].id, songDetailId: songDetail.id, name: "(Default)", lyrics: "" };
      await ApiHelper.post("/arrangements", [a], "ContentApi");
      props.onSelect(songs[0]);
    }

  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    songDetails.forEach((songDetail, index) => {
      result.push(
        <TableRow key={index}>
          <TableCell><img src={songDetail.thumbnail} alt={songDetail.title} style={{ width: 50, height: 50 }} onError={handleImageError} /></TableCell>
          <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); handleSongClick(songDetail) }}>{songDetail.title}</a></TableCell>
          <TableCell>{songDetail.artist}</TableCell>
        </TableRow>
      );
    });
    return result;
  }

  return (<>
    <Dialog open={true} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>Search for a Song</DialogTitle>
      <DialogContent>
        <TextField fullWidth name="personAddText" label="Tile or Artist" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
          InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={() => handleSearch()}>{Locale.label("common.search")}</Button> }}
        />

        {songDetails && <div style={{ overflowY: "scroll", height: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 82 }}></TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getRows()}
            </TableBody>
          </Table>
        </div>}


      </DialogContent>
      <DialogActions>
        <label style={{ color: "#999" }}>Powered by: PraiseCharts</label> &nbsp;
        <Button variant="outlined" onClick={props.onClose}>{Locale.label("common.close")}</Button>
      </DialogActions>
    </Dialog>
  </>);
};
