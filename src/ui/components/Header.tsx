import React from "react";
import { AppBar, Box, Chip, Icon, IconButton, Link, styled, Toolbar, Typography } from "@mui/material";
import { Locale, PersonHelper, UserHelper, UserMenu } from "@churchapps/apphelper";

export const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => { setOpen(!open); };

  const CustomAppBar = styled(AppBar)(
    ({ theme }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      "& .MuiIcon-root": { color: "#FFFFFF" }
    })
  );

  return (<div style={{backgroundColor:"#1565c0", color: "#FFF"}}>
    <CustomAppBar position="absolute">
      <Toolbar sx={{ pr: "24px", backgroundColor: "#1565C0" }}>
        <img src="/images/logo-icon.png" alt="CHUMS - Church Management Software" style={{height:35, marginRight:15}} />
        <span style={{marginRight:50}}>
          <h2 style={{lineHeight:1}}>People</h2>
        </span>
        <Link href="/groups" color="inherit" style={{ textDecoration: "none", marginLeft:10, marginRight:10}}>Groups</Link>
        <Chip href="/groups" label="People" component="a" variant="filled" clickable style={{marginLeft:10, marginRight:10, backgroundColor:"#114A99", color:"#FFF", fontSize:16}} />
        <Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>
        <div style={{ flex: 1 }}></div>

        {!UserHelper.user && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
      </Toolbar>
    </CustomAppBar>
  </div>);
}
