import React from "react";
import { GroupBanner } from "./components";
import { ApiHelper, type GroupInterface } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { GroupMembersTab } from "./components/GroupMembersTab";
import { GroupSessionsTab } from "./components/GroupSessionsTab";
import { Grid } from "@mui/material";

export const GroupPage = () => {
  const params = useParams();

  const [group, setGroup] = React.useState({} as GroupInterface);
  const [selectedTab, setSelectedTab] = React.useState("");

  const loadData = () => { ApiHelper.get("/groups/" + params.id, "MembershipApi").then(data => setGroup(data)); }
  React.useEffect(loadData, [params.id]);

  const handleGroupUpdated = (g: GroupInterface) => {
    setGroup(g);
    loadData();
  }



  React.useEffect(() => {
    if (selectedTab === "") {
      setSelectedTab("members");
    }
  }, [selectedTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "members": currentTab = <GroupMembersTab key="members" group={group} />; break;
      case "sessions": currentTab = <GroupSessionsTab key="sessions" group={group} />; break;
      default: currentTab = <GroupMembersTab key="members" group={group} />; break;
    }
    return currentTab;
  }


  return (
    <>
      <GroupBanner 
        group={group} 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        togglePhotoEditor={() => {}}
        onEdit={() => {}}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <div id="mainContent">
            {getCurrentTab()}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
