import React from "react";
import { DisplayBox, Locale } from "@churchapps/apphelper";
import { type SongDetailInterface } from "../../../helpers";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { SongDetailsEdit } from "./SongDetailsEdit";
import { SongDetailLinks } from "./SongDetailLinks";

interface Props {
  songDetail: SongDetailInterface;
  reload: () => void;
}

export const SongDetails = (props: Props) => {
  const [editMode, setEditMode] = React.useState(false);


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
  }

  const getDetails = () => {
    const result: JSX.Element[] = [];
    if (!props.songDetail) return result;


    if (props.songDetail.artist) result.push(<TableRow><TableCell><strong>{Locale.label("songs.details.artist")}</strong></TableCell><TableCell>{props.songDetail.artist}</TableCell></TableRow>);
    if (props.songDetail.releaseDate) {
      const d = new Date(props.songDetail.releaseDate);
      result.push(<TableRow key="releaseDate"><TableCell><strong>{Locale.label("songs.details.releaseDate")}</strong></TableCell><TableCell>{d.toLocaleDateString()}</TableCell></TableRow>);
    }
    if (props.songDetail.album) result.push(<TableRow key="album"><TableCell><strong>{Locale.label("songs.details.album")}</strong></TableCell><TableCell>{props.songDetail.album}</TableCell></TableRow>);
    if (props.songDetail.language) result.push(<TableRow key="language"><TableCell><strong>{Locale.label("songs.details.language")}</strong></TableCell><TableCell>{props.songDetail.language}</TableCell></TableRow>);
    if (props.songDetail.bpm) result.push(<TableRow key="bpm"><TableCell><strong>{Locale.label("songs.details.bpm")}</strong></TableCell><TableCell>{props.songDetail.bpm}</TableCell></TableRow>);
    if (props.songDetail.keySignature) result.push(<TableRow key="keySignature"><TableCell><strong>{Locale.label("songs.details.keySignature")}</strong></TableCell><TableCell>{props.songDetail.keySignature}</TableCell></TableRow>);
    if (props.songDetail.tones) result.push(<TableRow key="tones"><TableCell><strong>{Locale.label("songs.details.keys")}</strong></TableCell><TableCell>{props.songDetail.tones}</TableCell></TableRow>);
    if (props.songDetail.meter) result.push(<TableRow key="meter"><TableCell><strong>{Locale.label("songs.details.meter")}</strong></TableCell><TableCell>{props.songDetail.meter}</TableCell></TableRow>);
    if (props.songDetail.seconds) result.push(<TableRow key="seconds"><TableCell><strong>{Locale.label("songs.details.length")}</strong></TableCell><TableCell>{formatSeconds(props.songDetail.seconds)}</TableCell></TableRow>);


    /*
    if (props.songDetail.ccliId) result.push(<TableRow><TableCell><strong>CCLI ID</strong></TableCell><TableCell><a target="_blank" rel="noopener noreferrer" href={`https://songselect.ccli.com/songs/${props.songDetail.ccliId}`}>{props.songDetail.ccliId}</a>{props.songDetail.ccliId}</TableCell></TableRow>);

    if (props.songDetail.geniusId) result.push(<TableRow><TableCell><strong>Genius ID</strong>: <a href={`https://genius.com/songs/${props.songDetail.geniusId}`} target="_blank" rel="noopener noreferrer">{props.songDetail.geniusId}</a></TableCell></TableRow>);
    if (props.songDetail.appleId) result.push(<TableRow><TableCell><strong>Apple ID</strong>: <a href={`https://music.apple.com/us/song/preview/${props.songDetail.appleId}`} target="_blank" rel="noopener noreferrer">{props.songDetail.appleId}</a></TableCell></TableRow>);
    if (props.songDetail.youtubeId) result.push(<TableRow><TableCell><strong>YouTube ID</strong>: <a href={`https://youtube.com/watch?v=${props.songDetail.youtubeId}`} target="_blank" rel="noopener noreferrer">{props.songDetail.youtubeId}</a></TableCell></TableRow>);
    if (props.songDetail.hymnaryId) result.push(<TableRow><TableCell><strong>Hymnary ID</strong>: <a href={`https://hymnary.org/hymn/${props.songDetail.hymnaryId}`} target="_blank" rel="noopener noreferrer">{props.songDetail.hymnaryId}</a></TableCell></TableRow>);
    */
    //if (songDetail.musicBrainzId) result.push(<div key="musicBrainzId"><strong>MusicBrainz ID</strong>: {songDetail.musicBrainzId}</div>);


    return result;
  }

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  const handleSave = () => {
    props.reload();
    setEditMode(false);
  }

  if (editMode) return <SongDetailsEdit songDetail={props.songDetail} onCancel={() => { setEditMode(false) }} onSave={handleSave} reload={props.reload} />

  return (<DisplayBox headerText={props.songDetail?.title} headerIcon="album" editFunction={() => { setEditMode(true) }}>
    <img src={props.songDetail?.thumbnail} alt={props.songDetail?.title} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} onError={handleImageError} />
    <Table size="small">
      <TableBody>
        {getDetails()}
      </TableBody>
    </Table>
    <SongDetailLinks songDetail={props.songDetail} />
  </DisplayBox>);
}

