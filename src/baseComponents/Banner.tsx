import { Button, Grid } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode
}

export const Banner = (props:Props) => {
  const a="";
  return (<div id="banner">
    {props.children}
  </div>);
}
