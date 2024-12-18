import React from "react";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  label: string,
  menuItems: { url: string, label: string }[]
}

export const SecondaryMenu= (props:Props) => {
  const navigate = useNavigate();

  const getItems = () => {
    const result:any[] = [];
    props.menuItems.forEach(item => {
      if (item.label === props.label) result.push(<Chip onClick={() => navigate(item.url)} label={item.label} component="a" variant="filled" clickable style={{marginLeft:10, marginRight:10, backgroundColor:"var(--c1d2)", color:"#FFF", fontSize:16}} />);
      else result.push(<Link to={item.url} style={{ color:"#FFF", textDecoration: "none", marginLeft:10, marginRight:10}}>{item.label}</Link>);
    });
    return result;
  }

  return (<div id="secondaryMenu">
    {getItems()}
  </div>)
}
