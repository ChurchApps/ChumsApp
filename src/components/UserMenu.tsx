import React from "react";
import { UserHelper } from "./";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, ListSubheader, Menu, MenuItem, Typography, Icon } from "@mui/material";

export const UserMenu: React.FC = () => {
  const userName = `${UserHelper.user.firstName} ${UserHelper.user.lastName}`;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const getChurchLinks = () => {
    if (UserHelper.churches.length < 2) return null;
    else {
      let result: JSX.Element[] = [];
      result.push(<ListSubheader component="div">Switch Church</ListSubheader>);
      const churches = UserHelper.churches.filter(c => c.apis.length > 0)
      churches.forEach(c => {
        const church = c;
        const churchName = (c.id === UserHelper.currentChurch.id) ? (<b>{c.name}</b>) : (c.name);
        result.push(<MenuItem data-id={c.id} onClick={(e) => { e.preventDefault(); navigate("/" + church.id) }}>
          {churchName}
        </MenuItem>);
      });
      return result;
    }
  }

  return (
    <>
      <IconButton onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} style={{ outline: "0px !important" }}>
        <Avatar sx={{ width: 32, height: 32, marginRight: 1 }}><Icon>person</Icon></Avatar>
        <Typography color="inherit" noWrap>{userName}</Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
            "&:before": { content: "", display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10, bgcolor: "background.paper", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {getChurchLinks()}
      </Menu>
    </>
  );
};
