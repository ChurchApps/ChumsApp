import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { SongDetailInterface } from "../../helpers";

interface Props {
  onClose: () => void,
  onSelect: (song:SongDetailInterface) => void
}

export const SongSearchDialog: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [songDetails, setSongDetails] = React.useState<SongDetailInterface[]>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    ApiHelper.get("/songDetails/search?q=" + searchText, "ContentApi").then((data) => { setSongDetails(data); });

  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display="none";
  }

  const handleSongClick = async (songDetail: SongDetailInterface) => {
    if (!songDetail.id) {
      songDetail = await ApiHelper.post("/songDetails/create", songDetail, "ContentApi")
    }
    const s = { songDetailId: songDetail.id, dateAdded: new Date() };
    const song = await ApiHelper.post("/songs/create", s, "ContentApi");
    props.onSelect(song);
  }

  const getRows = () => {
    const result:JSX.Element[] = [];
    songDetails.forEach((songDetail, index) => {
      result.push(
        <TableRow key={index}>
          <TableCell><img src={songDetail.thumbnail} alt={songDetail.title} style={{width:50,height:50}} onError={handleImageError} /></TableCell>
          <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); handleSongClick(songDetail) }}>{songDetail.title}</a></TableCell>
          <TableCell>{songDetail.artist}</TableCell>
        </TableRow>
      );
    });
    return result;
  }

  return (<>
    <Dialog open={true} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>Search for Song</DialogTitle>
      <DialogContent>

        <TextField fullWidth name="personAddText" label="Tile or Artist" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
          InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={() => handleSearch()}>{Locale.label("common.search")}</Button> }}
        />

        {songDetails && <div style={{overflowY:"scroll", height:400}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{width:82}}></TableCell>
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
        <Button variant="outlined" onClick={props.onClose}>{Locale.label("common.close")}</Button>
      </DialogActions>
    </Dialog>
  </>);
};
