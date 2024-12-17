import React from "react";
import { AppBar, Link, styled, Toolbar } from "@mui/material";
import { UserHelper, Permissions, UserMenu, PersonHelper } from "@churchapps/apphelper";
import UserContext from "../UserContext";
import { PrimaryMenu } from "./PrimaryMenu";
import { SecondaryMenu } from "./SecondaryMenu";
import { SecondaryMenuAlt } from "./SecondaryMenuAlt";

interface Props {
  primaryMenuLabel: string,
  primaryMenuItems:{ url: string, icon:string, label: string }[]
  secondaryMenuLabel: string,
  secondaryMenuItems:{ url: string, label: string }[]
}

export const SiteHeader = (props:Props) => {
  const context = React.useContext(UserContext);

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
  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<>
    <div style={{backgroundColor:"#1565c0", color: "#FFF"}}>
      <CustomAppBar position="absolute">
        <Toolbar sx={{ pr: "24px", backgroundColor: "#1565C0" }}>
          <PrimaryMenu label={props.primaryMenuLabel} menuItems={props.primaryMenuItems}  />
          <SecondaryMenu label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems} />
          <div style={{ flex: 1 }}>
            <SecondaryMenuAlt label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems}  />
          </div>
          {UserHelper.user && <UserMenu profilePicture={PersonHelper.getPhotoUrl(context?.person)} userName={`${UserHelper.user?.firstName} ${UserHelper.user?.lastName}`} userChurches={UserHelper.userChurches} currentUserChurch={UserHelper.currentUserChurch} context={context} appName={"CHUMS"} loadCounts={() => {}} notificationCounts={{notificationCount:0, pmCount:0}} />}
          {!UserHelper.user && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
        </Toolbar>
      </CustomAppBar>

    </div>
  </>
  );
}
