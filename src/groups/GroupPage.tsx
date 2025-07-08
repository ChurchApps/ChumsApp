import React from "react";
import { GroupBanner, GroupDetailsEdit } from "./components";
import { ApiHelper, type GroupInterface, ImageEditor } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { GroupMembersTab } from "./components/GroupMembersTab";
import { GroupSessionsTab } from "./components/GroupSessionsTab";
import { Grid } from "@mui/material";

export const GroupPage = () => {
  const params = useParams();

  const [group, setGroup] = React.useState({} as GroupInterface);
  const [selectedTab, setSelectedTab] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState(false);

  const loadData = () => {
    ApiHelper.get("/groups/" + params.id, "MembershipApi").then((data) => setGroup(data));
  };
  React.useEffect(loadData, [params.id]);

  React.useEffect(() => {
    if (selectedTab === "") {
      setSelectedTab("members");
    }
  }, [selectedTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "members":
        currentTab = <GroupMembersTab key="members" group={group} />;
        break;
      case "sessions":
        currentTab = <GroupSessionsTab key="sessions" group={group} />;
        break;
      default:
        currentTab = <GroupMembersTab key="members" group={group} />;
        break;
    }
    return currentTab;
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdated = () => {
    setEditMode(false);
    loadData();
  };

  const handlePhotoUpdated = (dataUrl: string) => {
    const updatedGroup = { ...group };
    updatedGroup.photoUrl = dataUrl;
    setGroup(updatedGroup);
    setInPhotoEditMode(false);
  };

  const togglePhotoEditor = (show: boolean, updatedGroup?: GroupInterface) => {
    setInPhotoEditMode(show);
    if (updatedGroup) {
      setGroup(updatedGroup);
    }
  };

  const imageEditor = inPhotoEditMode && <ImageEditor aspectRatio={16 / 9} photoUrl={group.photoUrl} onCancel={() => togglePhotoEditor(false)} onUpdate={handlePhotoUpdated} />;

  return (
    <>
      {imageEditor}
      <GroupBanner group={group} selectedTab={selectedTab} onTabChange={setSelectedTab} togglePhotoEditor={togglePhotoEditor} onEdit={handleEdit} editMode={editMode} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <div id="mainContent">
            {editMode ? (
              <GroupDetailsEdit id="groupDetailsBox" group={group} updatedFunction={handleUpdated} togglePhotoEditor={togglePhotoEditor} />
            ) : (
              getCurrentTab()
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};
