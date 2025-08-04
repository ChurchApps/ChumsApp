import React from "react";
import {
  FormControl, Icon, InputLabel, MenuItem, Select, Stack, Tooltip, Typography 
} from "@mui/material";
import { type GenericSettingInterface, type GroupInterface } from "@churchapps/helpers";
import { ApiHelper, Locale, UniqueIdHelper } from "@churchapps/apphelper";

interface Props {
  churchId: string;
  saveTrigger: Date | null;
}

export const DirectoryApproveSettingsEdit: React.FC<Props> = (props) => {
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("");
  const [setting, setSetting] = React.useState<GenericSettingInterface>(null);

  const save = () => {
    // if (selectedGroupId !== "") {
    const s: GenericSettingInterface = setting === null ? { churchId: props.churchId, public: 1, keyName: "directoryApprovalGroupId" } : setting;
    s.value = selectedGroupId;
    ApiHelper.post("/settings", [s], "MembershipApi");
    // }
  };

  const checkSave = () => {
    if (props.saveTrigger !== null) save();
  };

  const getFields = () => {
    const result: JSX.Element[] = [];
    groups.forEach((g) => {
      result.push(<MenuItem value={g.id}>{g.name}</MenuItem>);
    });
    return result;
  };

  const loadData = async () => {
    const groups = await ApiHelper.get("/groups/tag/standard", "MembershipApi");
    setGroups(groups);
    const publicSettings = await ApiHelper.get("/settings", "MembershipApi");
    const approvalGroupSetting = publicSettings.filter((d: GenericSettingInterface) => d.keyName === "directoryApprovalGroupId");
    if (approvalGroupSetting.length > 0) {
      setSetting(approvalGroupSetting[0]);
      setSelectedGroupId(approvalGroupSetting[0].value);
    }
  };

  React.useEffect(() => {
    if (!UniqueIdHelper.isMissing(props.churchId)) loadData();
  }, [props.churchId]);
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <Stack direction="row" alignItems="center">
        <Typography>{Locale.label("settings.directoryApprovalSettingsEdit.directoryApprovalGroup")}</Typography>
        <Tooltip title={Locale.label("settings.directoryApprovalSettingsEdit.forceMsg")} arrow>
          <Icon fontSize="small" sx={{ cursor: "pointer", color: "#757575", paddingLeft: "2px" }}>
            help
          </Icon>
        </Tooltip>
      </Stack>
      <FormControl fullWidth>
        <InputLabel id="groups">{Locale.label("settings.directoryApprovalSettingsEdit.groups")}</InputLabel>
        <Select labelId="groups" name="groups" label={Locale.label("settings.directoryApprovalSettingsEdit.groups")} value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
          <MenuItem value="">{Locale.label("settings.directoryApprovalSettingsEdit.none")}</MenuItem>
          {groups?.length > 0 ? (
            getFields()
          ) : (
            <MenuItem value="" disabled>
              {Locale.label("settings.directoryApprovalSettingsEdit.noGroups")}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
};
