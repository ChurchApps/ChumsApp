import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { type SongDetailInterface } from "../../helpers";
import { CreateSongDetail } from "./components/CreateSongDetail";

interface Props {
  searchText?: string
  onClose: () => void,
  onSelect: (songDetail: SongDetailInterface) => void
}

export const SongSearchDialog: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState<string>(props.searchText || "");
  const [songDetails, setSongDetails] = React.useState<SongDetailInterface[]>(null);
  const [showCreate, setShowCreate] = React.useState(false);

  useEffect(() => {
    if (props.searchText) handleSearch();
  }, [props.searchText]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    ApiHelper.get("/praiseCharts/search?q=" + searchText, "ContentApi").then((data) => { setSongDetails(data); });

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
    props.onSelect(songDetail);


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
        <TextField fullWidth label="Tile or Artist" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="song-search-dialog-input" aria-label="Song title or artist"
          InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={() => handleSearch()} data-testid="song-search-dialog-button" aria-label="Search songs">{Locale.label("common.search")}</Button> }}
        />



        {!showCreate && songDetails && <div style={{ overflowY: "scroll", height: 400 }}>
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
          <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowCreate(true); }}>Manaully Enter</a>
        </div>}

        {showCreate && <CreateSongDetail onSave={(sd: SongDetailInterface) => { props.onSelect(sd); }} />}


      </DialogContent>
      <DialogActions>
        <label style={{ color: "#999" }}>Powered by: <a href="https://www.praisecharts.com/?XID=churchapps" target="_blank" rel="noopener noreferrer">PraiseCharts</a></label> &nbsp;
        <Button variant="outlined" onClick={props.onClose} data-testid="song-search-dialog-close" aria-label="Close dialog">{Locale.label("common.close")}</Button>
      </DialogActions>
    </Dialog>
  </>);
};
