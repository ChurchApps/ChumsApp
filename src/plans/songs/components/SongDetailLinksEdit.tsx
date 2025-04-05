import React, { useEffect } from "react";
import { ApiHelper, DisplayBox, InputBox, SmallButton } from "@churchapps/apphelper";
import { SongDetailLinkInterface } from "../../../helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { Api } from "@mui/icons-material";

interface Props {
  songDetailId: string;
}

export const SongDetailLinksEdit = (props: Props) => {
  const [songDetailLinks, setSongDetailLinks] = React.useState<SongDetailLinkInterface[]>([]);
  const [editLink, setEditLink] = React.useState<SongDetailLinkInterface>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const l = { ...editLink };
    switch (e.target.name) {
      case "serviceKey": l.serviceKey = e.target.value; break;
      case "service": l.service = e.target.value; break;
    }
    console.log(l);
    setEditLink(l);

  }

  const loadData = () => {
    if (props.songDetailId) {
      ApiHelper.get("/songDetailLinks/songDetail/" + props.songDetailId, "ContentApi").then(data => {
        setSongDetailLinks(data);
      });
    }
  }
  useEffect(() => { loadData(); }, [props.songDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

  const determineUrl = (link: SongDetailLinkInterface) => {
    let result = "";
    switch (link.service) {
      case "Apple": result = "https://music.apple.com/us/album/" + link.serviceKey; break;
      case "CCLI": result = "https://songselect.ccli.com/Songs/" + link.serviceKey; break;
      case "Genius": result = "https://genius.com/" + link.serviceKey; break;
      case "Hymnary": result = "https://hymnary.org/text/" + link.serviceKey; break;
      case "MusicBrainz": result = "https://musicbrainz.org/recording/" + link.serviceKey; break;
      case "Spotify": result = "https://open.spotify.com/track/" + link.serviceKey; break;
      case "YouTube": result = "https://www.youtube.com/watch?v=" + link.serviceKey; break;
    }
    return result;
  }

  const handleAdd = () => {
    const links = [...songDetailLinks];
    links.push({ songDetailId: props.songDetailId, service: "Apple" } as SongDetailLinkInterface);
    setSongDetailLinks(links);
  }

  const handleDelete = () => {
    ApiHelper.delete("/songDetailLinks/" + editLink.id, "ContentApi");
    setEditLink(null);
  }

  const handleSave = () => {
    const l = { ...editLink };
    l.url = determineUrl(l);

    ApiHelper.post("/songDetailLinks", [l], "ContentApi").then(() => {
      loadData();
      setEditLink(null);
    });
  }

  /*
  const getRow = (link: SongDetailLinkInterface, idx: number) => <TableRow>
    <TableCell>
      <FormControl fullWidth size="small">
        <InputLabel>Service</InputLabel>
        <Select size="small" name="service" label="Service" value={link.service} onChange={e => handleChange(e, idx)}>
          <MenuItem value="Apple">Apple</MenuItem>
          <MenuItem value="CCLI">CCLI</MenuItem>
          <MenuItem value="Genius">Genius</MenuItem>
          <MenuItem value="Hymnary">Hymnary</MenuItem>
          <MenuItem value="MusicBrainz">MusicBrainz</MenuItem>
          <MenuItem value="Spotify">Spotify</MenuItem>
          <MenuItem value="YouTube">YouTube</MenuItem>
        </Select>
      </FormControl>
    </TableCell>
    <TableCell><TextField size="small" name="serviceKey" fullWidth label="Id" value={link.serviceKey} onChange={e => handleChange(e, idx)} /></TableCell>
    <TableCell><SmallButton icon="delete" onClick={() => handleDelete(idx)} /></TableCell>
  </TableRow>
  */
  const getRow = (link: SongDetailLinkInterface, idx: number) => <TableRow>
    <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); setEditLink(link); }}>{link.service}</a></TableCell>
    <TableCell>{link.serviceKey}</TableCell>
  </TableRow>

  if (editLink) return <InputBox headerText="Links" headerIcon="link" cancelFunction={() => { setEditLink(null) }} saveFunction={handleSave} deleteFunction={(editLink.id) ? handleDelete : null}>
    <FormControl fullWidth size="small">
      <InputLabel>Service</InputLabel>
      <Select size="small" name="service" label="Service" value={editLink.service} onChange={handleChange}>
        <MenuItem value="Apple">Apple</MenuItem>
        <MenuItem value="CCLI">CCLI</MenuItem>
        <MenuItem value="Genius">Genius</MenuItem>
        <MenuItem value="Hymnary">Hymnary</MenuItem>
        <MenuItem value="MusicBrainz">MusicBrainz</MenuItem>
        <MenuItem value="Spotify">Spotify</MenuItem>
        <MenuItem value="YouTube">YouTube</MenuItem>
      </Select>
    </FormControl>
    <TextField size="small" name="serviceKey" fullWidth label="Id" value={editLink.serviceKey} onChange={handleChange} />
  </InputBox>
  else return <>
    <DisplayBox headerText="Links" headerIcon="link" editContent={<SmallButton icon="add" onClick={handleAdd} />}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songDetailLinks?.map((sd, i) => getRow(sd, i))}
        </TableBody>
      </Table>
    </DisplayBox>
  </>
}
