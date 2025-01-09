import React from "react";
import { GroupDetailsEdit, ServiceTimes } from ".";
import { GroupInterface, DisplayBox, UserHelper, Permissions, Loading, Locale, MarkdownPreviewLight, MarkdownPreview } from "@churchapps/apphelper";
import { Grid } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetails: React.FC<Props> = (props) => {
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) ? handleEdit : undefined

  const handleUpdated = (g: GroupInterface) => { setMode("display"); props.updatedFunction(g); }

  const isStandard = props.group?.tags?.indexOf("standard") > -1;

  const getTargetAndClasses = (extra: string) => {
    let result = "";
    const classRegex = /\.[^( |\})]+/g;
    const matches = extra.match(classRegex)
    if (matches && matches.length > 0) {
      let classes = matches.join(" ");
      classes = classes.replaceAll(".", "");
      result = " class=\"" + classes + "\"";
    }
    const targetRegex = /:target="([^"]+)"/g;
    let targets = targetRegex.exec(extra);
    if (targets) result += " " + targets[0].replace(":", "");
    return result;
  }

  // \[([^\]]+)\] - text
  // \(([^)]+)\) - url
  // \{([^\}]+)\} - target and classes
  // \[([^\]]+)\]\(([^)]+)\)\{([^\}]+)\} - full
  const getSpecialLinks = (markdownString: string) => {
    if (!markdownString) return "";
    const regex = /\[([^\]]+)\]\(([^)]+)\)\{([^\}]+)\}/g;
    const convertedText = markdownString.replace(regex, (match, text, url, extra) => {
      if (!match) return text;
      let result = "<a href=\"" + url + "\"";
      result += getTargetAndClasses(extra);
      result += ">" + text + "</a>";
      return result;
    });
    return convertedText
  }

  console.log("Group", getSpecialLinks(props.group?.about || ""));
  console.log("Empty String", getSpecialLinks(""));
  console.log("Null", getSpecialLinks(null));
  console.log("Undefined", getSpecialLinks(undefined));
  console.log("Undefined", getSpecialLinks("test"));

  const getRows = () => {
    if (!props.group) return <Loading />
    else return (<>
      <Grid container spacing={1}>
        {isStandard && <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.cat")}</label> {props.group.categoryName}</Grid>}
        <Grid item md={6} xs={12}><label>{Locale.label("common.name")}</label> {props.group.name}</Grid>
        {isStandard && <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.meetingTime")}</label> {props.group.meetingTime}</Grid>}
        {isStandard && <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.meetingLocation")}</label> {props.group.meetingLocation}</Grid>}
      </Grid>
      {isStandard && <>
        <Grid container spacing={1} marginTop="1px">
          <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.attTrack")}</label> {(props.group.trackAttendance?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || "")}</Grid>
          <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.parPick")}</label> {(props.group.parentPickup?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || "")}</Grid>
          <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.prinName")}</label> {(props.group.printNametag?.toString().replace("false", Locale.label("common.no")).replace("true", Locale.label("common.yes")) || "")}</Grid>
        </Grid>
        <br />
        <MarkdownPreview value={props.group?.about} />
        <ServiceTimes group={props.group} />
      </>}
    </>);

  }

  if (mode === "edit") return <GroupDetailsEdit group={props.group} updatedFunction={handleUpdated} />
  else return (
    <DisplayBox id="groupDetailsBox" data-cy="group-details-box" headerText={Locale.label("groups.groupDetails.groupDet")} headerIcon="group" editFunction={getEditFunction()} help="chums/groups">
      {getRows()}
    </DisplayBox>
  );
}

