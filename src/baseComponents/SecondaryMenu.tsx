import React from "react";
import { Chip, Link  } from "@mui/material";

interface Props {
  label: string,
  menuItems: { url: string, label: string }[]
}

export const SecondaryMenu= (props:Props) => {
  const getItems = () => {
    const result:any[] = [];
    props.menuItems.forEach(item => {
      if (item.label === props.label) result.push(<Chip href={item.url} label={item.label} component="a" variant="filled" clickable style={{marginLeft:10, marginRight:10, backgroundColor:"#114A99", color:"#FFF", fontSize:16}} />);
      else result.push(<Link href={item.url} color="inherit" style={{ textDecoration: "none", marginLeft:10, marginRight:10}}>{item.label}</Link>);
    });
    return result;
  }

  return (<div id="secondaryMenu">
    {getItems()}
  </div>)
}
