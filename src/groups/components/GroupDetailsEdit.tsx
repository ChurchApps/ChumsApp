import React from "react";
import { ServiceTimesEdit } from ".";
import { ApiHelper, InputBox, ErrorMessages, Locale } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { useMountedState, GalleryModal, GroupInterface } from "@churchapps/apphelper";
import { MarkdownEditor } from "@churchapps/apphelper";
import { GroupLabelsEdit } from "./GroupLabelsEdit";

interface Props {
  group: GroupInterface;
  updatedFunction: (group: GroupInterface) => void;
}

export const GroupDetailsEdit: React.FC<Props> = (props) => {
  const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");
  const [selectPhotoField, setSelectPhotoField] = React.useState<string>(null);
  const isMounted = useMountedState();

  const handleCancel = () => props.updatedFunction(group);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (e: | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>| SelectChangeEvent<string>) => {
    e.preventDefault();
    let g = { ...group };
    switch (e.target.name) {
      case "categoryName": g.categoryName = e.target.value; break;
      case "name": g.name = e.target.value; break;
      case "meetingTime": g.meetingTime = e.target.value; break;
      case "meetingLocation": g.meetingLocation = e.target.value; break;
      case "trackAttendance": g.trackAttendance = e.target.value === "true"; break;
      case "parentPickup": g.parentPickup = e.target.value === "true"; break;
      case "printNametag": g.printNametag = e.target.value === "true"; break;
      case "slug": g.slug = e.target.value; break;
    }
    setGroup(g);
  };

  const handleArrayChange = (val:string[]) => {
    console.log("Array change", val)
    let g = { ...group };
    g.labelArray = val;
    setGroup(g);
  };

  const handlePhotoSelected = (image: string) => {
    let g = { ...group };
    g.photoUrl = image;
    setGroup(g);
    setSelectPhotoField(null);
  };

  const handleMarkdownChange = (newValue: string) => {
    if (group.id) {
      let g = { ...group };
      g.about = newValue;
      setGroup(g)
    }
  };

  const validate = () => {
    let errors = [];
    if (group.categoryName === "") errors.push(Locale.label("groups.groupDetailsEdit.catNameMsg"));
    if (group.name === "") errors.push(Locale.label("groups.groupDetailsEdit.groupNameMsg"));
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/groups", [group], "MembershipApi").then((data) => {
        setGroup(data);
        props.updatedFunction(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm(Locale.label("groups.groupDetailsEdit.confirmMsg"))) {
      ApiHelper.delete("/groups/" + group.id.toString(), "MembershipApi").then(() => setRedirect("/groups"));
    }
  };

  React.useEffect(() => {
    if (isMounted()) { setGroup(props.group); }
  }, [props.group, isMounted]);

  const getAttendance = () => {
    if (teamMode) return (<></>);
    else return(<>
      <div style={{ backgroundColor:"var(--c1l2)", color:"#FFF", padding:10, marginTop:20, marginBottom:20}}><b>Attendance</b></div>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>{Locale.label("groups.groupDetailsEdit.attTrack")}</InputLabel>
            <Select label={Locale.label("groups.groupDetailsEdit.attTrack")} id="trackAttendance" name="trackAttendance" data-cy="select-attendance-type" value={group.trackAttendance?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
              <MenuItem value="false">{Locale.label("common.no")}</MenuItem>
              <MenuItem value="true">{Locale.label("common.yes")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction={{ xs: "column", md: "row" }}>
            <FormControl fullWidth>
              <InputLabel>{Locale.label("groups.groupDetailsEdit.parPick")}</InputLabel>
              <Select label={Locale.label("groups.groupDetailsEdit.parPick")} name="parentPickup" value={group.parentPickup?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
                <MenuItem value="false">{Locale.label("common.no")}</MenuItem>
                <MenuItem value="true">{Locale.label("common.yes")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginLeft: { md: 2 } }}>
              <InputLabel>{Locale.label("groups.groupDetailsEdit.prinName")}</InputLabel>
              <Select label={Locale.label("groups.groupDetailsEdit.prinName")} name="printNametag" value={group.printNametag?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
                <MenuItem value="false">{Locale.label("common.no")}</MenuItem>
                <MenuItem value="true">{Locale.label("common.yes")}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
      <ServiceTimesEdit group={group} />
    </>);
  }

  const teamMode = group?.tags?.indexOf("team") !== -1;

  if (redirect !== "") return <Navigate to={redirect} />;
  else
    return (
      <>
        <InputBox id="groupDetailsBox" headerText={Locale.label("groups.groupDetailsEdit.groupDet")} headerIcon="group" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} help="chums/groups">
          <ErrorMessages errors={errors} />
          <Grid container spacing={3}>
            {!teamMode && (
              <Grid item md={6} xs={12}>
                <TextField fullWidth type="text" name="categoryName" label={Locale.label("groups.groupDetailsEdit.catName")} value={group.categoryName || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <TextField fullWidth label={Locale.label("groups.groupDetailsEdit.groupName")} type="text" name="name" value={group.name || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {!teamMode && (
              <Grid item md={6} xs={12}>
                <TextField fullWidth type="text" name="meetingTime" placeholder="Tuesdays at 7pm" label={Locale.label("groups.groupDetailsEdit.meetingTime")} value={group.meetingTime || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <TextField fullWidth type="text" name="meetingLocation" placeholder="Johnson Home" label={Locale.label("groups.groupDetailsEdit.meetingLocation")} value={group.meetingLocation || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
            </Grid>
          </Grid>
          {!teamMode && <>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <MarkdownEditor value={group.about || ""} onChange={(val) => handleMarkdownChange(val)} style={{ maxHeight: 200, overflowY: "scroll" }} placeholder={Locale.label("groups.groupDetailsEdit.groupDesc")} />
              </Grid>
              <Grid item md={6} xs={12}>
                {group.photoUrl && (<>
                  <img src={group.photoUrl} style={{ maxHeight: 100, maxWidth: "100%", width: "auto" }} alt="group" />
                  <br />
                </>)}
                {!group.photoUrl && <InputLabel>{Locale.label("groups.groupDetailsEdit.groupImg")}</InputLabel>}
                <Button variant="contained" onClick={() => setSelectPhotoField("photoUrl")}>{Locale.label("groups.groupDetailsEdit.selImg")}</Button>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField fullWidth type="text" name="slug" label={Locale.label("groups.groupDetailsEdit.slug")} value={group.slug || ""} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="group-name" />
              </Grid>
              <Grid item md={6} xs={12}>
                <GroupLabelsEdit group={group} onUpdate={handleArrayChange} />
              </Grid>

            </Grid>

          </>
          }
          {getAttendance()}
        </InputBox>

        {selectPhotoField && (
          <GalleryModal
            onClose={() => setSelectPhotoField(null)}
            onSelect={handlePhotoSelected}
            aspectRatio={1.78}
          />
        )}
      </>
    );
};
