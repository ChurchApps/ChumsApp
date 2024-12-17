import React from "react";
import { Box, Button, Icon, Menu } from "@mui/material";
import { Locale, NavItem } from "@churchapps/apphelper";

interface Props {
  label: string,
  menuItems: { url: string, icon:string, label: string }[]
}

export const PrimaryMenu = (props:Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => { setAnchorEl(null); };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const paperProps = {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",

      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
      minWidth: 300
    }
  };

  const getNavItems = () => {
    let result: JSX.Element[] = [];
    props.menuItems.forEach(item => {
      result.push(<NavItem url={item.url} label={item.label} icon={item.icon} key={item.url} />);
    });
    return result;
  }

  return (<>
    <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} endIcon={<Icon>expand_more</Icon>} id="primaryNavButton">
      <img src="/images/logo-icon.png" alt="CHUMS - Church Management Software" />
      <h2 style={{lineHeight:1}}>{props.label}</h2>
    </Button>

    <Menu anchorEl={anchorEl} id="account-menu" open={anchorEl!==null} onClose={handleClose} slotProps={{ paper: paperProps }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {getNavItems()}
      </Box>
    </Menu>
  </>

  )
}
