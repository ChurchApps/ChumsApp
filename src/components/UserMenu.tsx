import React from "react";
import { UserHelper } from "./";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, ListSubheader, Menu, MenuItem, Typography, Icon, Button } from "@mui/material";
import UserContext from "../UserContext";
import { NavItem } from "../appBase/components";

export const UserMenu: React.FC = () => {
  const userName = `${UserHelper.user.firstName} ${UserHelper.user.lastName}`;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const context = React.useContext(UserContext);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const getChurchLinks = () => {
    if (UserHelper.churches.length < 2) return null;
    else {
      let result: JSX.Element[] = [];
      result.push(<NavItem url="/profile" label="Profile" icon="person" />);
      result.push(<NavItem url="/logout" label="Logout" icon="logout" />);
      return result;
    }
  }

  const getProfilePic = () => {

    if (context.profilePicture) return <img src={context.profilePicture} alt="user" style={{ maxHeight: 32 }} />
    else return <Icon>person</Icon>
  }

  return (
    <>
      <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} style={{ textTransform: "none" }} endIcon={<Icon>expand_more</Icon>} >
        <Avatar sx={{ width: 32, height: 32, marginRight: 1 }}>{getProfilePic()}</Avatar>
        <Typography color="inherit" noWrap>{userName}</Typography>
      </Button>

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
            "&:before": { content: "\"\"", display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10, bgcolor: "background.paper", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 }
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
