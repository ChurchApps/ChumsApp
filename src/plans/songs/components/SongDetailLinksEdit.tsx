import React, { useEffect } from "react";
import { ApiHelper, SmallButton } from "@churchapps/apphelper";
import { SongDetailLinkInterface } from "../../../helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";

interface Props {
  songDetailId: string;
  pendingSave?: number;
  onSave?: (songDetailLinks: SongDetailLinkInterface[]) => void;
}

export const SongDetailLinksEdit = (props: Props) => {
  const [songDetailLinks, setSongDetailLinks] = React.useState<SongDetailLinkInterface[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>, index: number) => {
    const links = [...songDetailLinks];
    const l = links[index];
    switch (e.target.name) {
      case "serviceKey": l.serviceKey = e.target.value; break;
      case "service": l.service = e.target.value; break;
    }
    console.log(l);
    setSongDetailLinks(links);
  }

  useEffect(() => {
    if (props.pendingSave > 0) {
      pendingDeleteIds.forEach(id => {
        ApiHelper.delete("/songDetailLinks/" + id, "ContentApi");
      });

      songDetailLinks.forEach(link => { link.url = determineUrl(link); });


      ApiHelper.post("/songDetailLinks", songDetailLinks, "ContentApi").then(() => {
        if (props.onSave) props.onSave(songDetailLinks);
      });
    }
  }, [props.pendingSave]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.songDetailId) {
      ApiHelper.get("/songDetailLinks/songDetail/" + props.songDetailId, "ContentApi").then(data => {
        setSongDetailLinks(data);
      });
    }
  }, [props.songDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleDelete = (idx: number) => {
    const links = [...songDetailLinks];
    const toDelete = links.splice(idx, 1);
    if (toDelete[0].id) setPendingDeleteIds([...pendingDeleteIds, toDelete[0].id]);
    setSongDetailLinks(links);
  }

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

  return <>
    <hr />
    <h4>Links</h4>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Service</TableCell>
          <TableCell>Key</TableCell>
          <TableCell style={{ textAlign: "right" }}><SmallButton icon="add" onClick={handleAdd} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {songDetailLinks?.map((sd, i) => getRow(sd, i))}
      </TableBody>
    </Table>
  </>
}
