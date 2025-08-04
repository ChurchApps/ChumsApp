import React from "react";
import { GroupBanner, GroupDetailsEdit } from "./components";
import { type GroupInterface } from "@churchapps/helpers";
import { ImageEditor } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { GroupMembersTab } from "./components/GroupMembersTab";
import { GroupSessionsTab } from "./components/GroupSessionsTab";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export const GroupPage = () => {
  const params = useParams();

  const [selectedTab, setSelectedTab] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState(false);

  const group = useQuery<GroupInterface>({
    queryKey: [`/groups/${params.id}`, "MembershipApi"],
    placeholderData: {} as GroupInterface,
  });

  React.useEffect(() => {
    if (selectedTab === "") {
      setSelectedTab("members");
    }
  }, [selectedTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "members":
        currentTab = <GroupMembersTab key="members" group={group.data} />;
        break;
      case "sessions":
        currentTab = <GroupSessionsTab key="sessions" group={group.data} />;
        break;
      default:
        currentTab = <GroupMembersTab key="members" group={group.data} />;
        break;
    }
    return currentTab;
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdated = () => {
    setEditMode(false);
    group.refetch();
  };

  const handlePhotoUpdated = () => {
    group.refetch();
    setInPhotoEditMode(false);
  };

  const togglePhotoEditor = (show: boolean, updatedGroup?: GroupInterface) => {
    setInPhotoEditMode(show);
    if (updatedGroup) {
      group.refetch();
    }
  };

  const imageEditor = inPhotoEditMode && <ImageEditor aspectRatio={16 / 9} photoUrl={group.data?.photoUrl} onCancel={() => togglePhotoEditor(false)} onUpdate={handlePhotoUpdated} />;

  return (
    <>
      {imageEditor}
      <GroupBanner group={group.data} selectedTab={selectedTab} onTabChange={setSelectedTab} togglePhotoEditor={togglePhotoEditor} onEdit={handleEdit} editMode={editMode} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <div id="mainContent">{editMode ? <GroupDetailsEdit id="groupDetailsBox" group={group.data} updatedFunction={handleUpdated} togglePhotoEditor={togglePhotoEditor} /> : getCurrentTab()}</div>
        </Grid>
      </Grid>
    </>
  );
};
