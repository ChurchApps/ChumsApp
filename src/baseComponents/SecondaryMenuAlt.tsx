import React from "react";
import { Box, Button, Chip, Icon, Link, Menu  } from "@mui/material";
import { NavItem } from "@churchapps/apphelper";


interface Props {
  label: string,
  menuItems: { url: string, label: string }[]
}

export const SecondaryMenuAlt = (props:Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => { setAnchorEl(null); };
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const getItems = () => {
    const result:any[] = [];
    props.menuItems.forEach(item => {
      result.push(<NavItem url={item.url} label={item.label} key={item.url} icon="people" />);
    });
    return result;
  }

  return (
    <div id="secondaryMenuAlt">
      <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} endIcon={<Icon>expand_more</Icon>} id="secondaryMenuButton">
        <h3 style={{lineHeight:1}}>{props.label}</h3>
      </Button>
      <Menu anchorEl={anchorEl} id="account-menu" open={anchorEl!==null} onClose={handleClose} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {getItems()}
        </Box>
      </Menu>
    </div>)
}
