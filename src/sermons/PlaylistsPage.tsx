import React, { memo } from "react";
import { UserHelper, Permissions } from "@churchapps/apphelper";
import { Playlists } from "./components/Playlists";

export const PlaylistsPage = memo(() => {
  if (!UserHelper.checkAccess(Permissions.contentApi.streamingServices.edit)) return <></>;

  return (
    <Playlists />
  );
});
