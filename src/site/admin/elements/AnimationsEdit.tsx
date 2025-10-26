import type { AnimationsInterface } from "../../../helpers";
import type { SelectChangeEvent } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";

interface Props {
  animations: AnimationsInterface,
  onSave: (animations:AnimationsInterface) => void;
}


export const AnimationsEdit: React.FC<Props> = (props) => {
  const [animations, setAnimations] = React.useState(props.animations || { onShow: "", onShowSpeed: "" });

  useEffect(() => {
    if (props.animations) setAnimations(props.animations);
    else setAnimations({ onShow: "", onShowSpeed: "" });
  }, [props.animations]);

  const handleSave = () => {
    props.onSave(animations);
    props.onSave(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const a = { ...animations };
    switch (e.target.name) {
      case "onShow":
        a.onShow = val;
        if (val && !a.onShowSpeed) a.onShowSpeed = "normal";
        break;
      case "onShowSpeed": a.onShowSpeed=val; break;
    }
    setAnimations(a);
  }

  return <InputBox saveFunction={handleSave} saveText="Update" headerText="Edit Animations" cancelFunction={() => { props.onSave(null) }}>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <FormControl size="small" fullWidth style={{marginTop:10}}>
          <InputLabel>On Show Animation</InputLabel>
          <Select size="small" fullWidth label="On Show Animation" name="onShow" value={animations?.onShow || ""} onChange={handleChange}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="slideLeft">Slide Left</MenuItem>
            <MenuItem value="slideRight">Slide Right</MenuItem>
            <MenuItem value="slideUp">Slide Up</MenuItem>
            <MenuItem value="slideDown">Slide Down</MenuItem>
            <MenuItem value="fadeIn">Fade In</MenuItem>
            <MenuItem value="grow">Grow</MenuItem>
            <MenuItem value="shrink">Shrink</MenuItem>
            <MenuItem value="pulse">Pulse</MenuItem>
            <MenuItem value="colorize">Colorize</MenuItem>
            <MenuItem value="focus">Focus</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <FormControl size="small" fullWidth style={{marginTop:10}}>
          <InputLabel>On Show Speed</InputLabel>
          <Select size="small" fullWidth label="On Show Speed" name="onShowSpeed" value={animations?.onShowSpeed || "normal"} onChange={handleChange}>
            <MenuItem value="slow">Slow</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="fast">Fast</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>


  </InputBox>

}
