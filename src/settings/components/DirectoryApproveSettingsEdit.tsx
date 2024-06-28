import React from "react";
import { FormControl, Icon, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { ApiHelper, GenericSettingInterface, GroupInterface, UniqueIdHelper } from "@churchapps/apphelper";

interface Props { churchId: string; saveTrigger: Date | null; }

export const DirectoryApproveSettingsEdit: React.FC<Props> = (props) => {
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("");
  const [setting, setSetting] = React.useState<GenericSettingInterface>(null);

  const save = () => {
    // if (selectedGroupId !== "") {
    const s: GenericSettingInterface = setting === null ? { churchId: props.churchId, public: 1, keyName: "directoryApprovalGroupId", } : setting;
    s.value = selectedGroupId;
    ApiHelper.post("/settings", [s], "MembershipApi");
    // }
  };

  const checkSave = () => {
    if (props.saveTrigger !== null) save();
  };

  const getFields = () => {
    let result: JSX.Element[] = [];
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

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.churchId)) loadData(); }, [props.churchId]); //eslint-disable-line
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <div>
        Directory Approval Group{" "}
        <Tooltip
          title="This group will handle all the member directory updates. Only after their approval, changes will be applied."
          arrow
        >
          <Icon fontSize="small" sx={{ paddingTop: "2px", cursor: "pointer" }} color="primary">info</Icon>
        </Tooltip>
      </div>
      <FormControl fullWidth>
        <InputLabel id="groups">Groups</InputLabel>
        <Select labelId="groups" name="groups" label="Groups" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          {groups?.length > 0 ? (getFields()) : (<MenuItem value="" disabled>No groups available</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
};
