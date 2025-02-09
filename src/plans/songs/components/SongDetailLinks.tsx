import React, { useEffect } from "react";
import { ApiHelper, SmallButton } from "@churchapps/apphelper";
import { SongDetailLinkInterface } from "../../../helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";

interface Props {
  songDetailId: string;
}

export const SongDetailLinks = (props: Props) => {
  const [songDetailLinks, setSongDetailLinks] = React.useState<SongDetailLinkInterface[]>([]);

  useEffect(() => {
    if (props.songDetailId) {
      ApiHelper.get("/songDetailLinks/songDetail/" + props.songDetailId, "ContentApi").then(data => {
        setSongDetailLinks(data);
      });
    }
  }, [props.songDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLink = (link:SongDetailLinkInterface, idx:number) => {
    let result = <a href={link.url}>{link.service}</a>
    switch (link.service) {
      case "Apple": result = <a href={link.url}>Apple</a>
    }
    return result;
  }

  if (!songDetailLinks || songDetailLinks.length===0) return null;
  else return <>
    <hr />
    <h4>Links</h4>
    <Stack direction="column">
      {songDetailLinks?.map((sd, i) => getLink(sd, i))}
    </Stack>
  </>
}
