import React, { memo, useCallback, useMemo } from "react";
import { GroupDetailsEdit, ServiceTimes } from ".";
import { type GroupInterface, DisplayBox, UserHelper, Permissions, Loading, Locale, MarkdownPreview } from "@churchapps/apphelper";
import { Chip, Grid } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetails = memo((props: Props) => {
  const [mode, setMode] = React.useState("display");
  
  const handleEdit = useCallback(() => setMode("edit"), []);
  
  const getEditFunction = useCallback(() => 
    (UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) ? handleEdit : undefined,
    [handleEdit]
  );

  const handleUpdated = useCallback((g: GroupInterface) => { 
    setMode("display"); 
    props.updatedFunction(g); 
  }, [props.updatedFunction]);

  const isStandard = useMemo(() => 
    props.group?.tags?.indexOf("standard") > -1, 
    [props.group?.tags]
  );


  const labelChips = useMemo(() => 
    props.group?.labelArray?.map((label, index) => (
      <Chip
        key={`${props.group.id}-${label}-${index}`}
        label={label}
        variant="outlined"
        size="small"
        style={{ marginRight: 5 }}
      />
    )) || [],
    [props.group?.labelArray, props.group?.id]
  );

  const booleanDisplays = useMemo(() => ({
    trackAttendance: props.group?.trackAttendance?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || "",
    parentPickup: props.group?.parentPickup?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || "",
    printNametag: props.group?.printNametag?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || ""
  }), [props.group?.trackAttendance, props.group?.parentPickup, props.group?.printNametag]);

  const rows = useMemo(() => {
    if (!props.group) return <Loading />
    
    return (
      <>
        <Grid container spacing={1}>
          {isStandard && <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.cat")}</label> {props.group.categoryName}</Grid>}
          <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("common.name")}</label> {props.group.name}</Grid>
          {isStandard && <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.meetingTime")}</label> {props.group.meetingTime}</Grid>}
          {isStandard && <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.meetingLocation")}</label> {props.group.meetingLocation}</Grid>}
        </Grid>
        {isStandard && <>
          <Grid container spacing={1} marginTop="1px">
            <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.attTrack")}</label> {booleanDisplays.trackAttendance}</Grid>
            <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.parPick")}</label> {booleanDisplays.parentPickup}</Grid>
            <Grid size={{ xs: 12, md: 6 }}><label>{Locale.label("groups.groupDetails.prinName")}</label> {booleanDisplays.printNametag}</Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {labelChips}
            </Grid>
          </Grid>
          <br />
          <MarkdownPreview value={props.group?.about} />
          <ServiceTimes group={props.group} />
        </>}
      </>
    );
  }, [props.group, isStandard, labelChips, booleanDisplays]);

  if (mode === "edit") return <GroupDetailsEdit group={props.group} updatedFunction={handleUpdated} />
  else return (
    <DisplayBox id="groupDetailsBox" data-cy="group-details-box" headerText={Locale.label("groups.groupDetails.groupDet")} headerIcon="group" editFunction={getEditFunction()} help="chums/groups">
      {rows}
    </DisplayBox>
  );
});

