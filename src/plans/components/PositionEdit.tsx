import React, { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, GroupInterface, InputBox, PositionInterface } from "@churchapps/apphelper";
import ReactSelect from "react-select";
import { useAppTranslation } from "../../contexts/TranslationContext";

interface Props {
  position: PositionInterface;
  categoryNames: string[];
  updatedFunction: () => void
}

interface OptionType {
  value: string;
  label: string;
}

export const PositionEdit = (props: Props) => {
  const { t } = useAppTranslation();

  const options: OptionType[] = [];
  props.categoryNames.forEach(cn => {
    options.push({ value: cn, label: cn });
  });

  const [position, setPosition] = React.useState<PositionInterface>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [categoryInput, setCategoryInput] = React.useState("");
  const [categoryOption, setCategoryOption] = React.useState<OptionType>(null);
  const [groups, setGroups] = React.useState<GroupInterface[]>([]);

  useEffect(() => {
    if (props.position?.id) setPosition(props.position);
    else setPosition({ name: "", count: 1, categoryName: "" });
    ApiHelper.get("/groups", "MembershipApi").then(data => setGroups(data));
  }, [props.position]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const p = { ...position };
    const value = e.target.value;
    switch (e.target.name) {
      case "name": p.name = value; break;
      case "count": p.count = parseInt(value); break;
      case "groupId": p.groupId = value; break;
    }
    setPosition(p);
  }

  const handleSave = () => {
    const errors: string[] = [];
    if (!position.categoryName) errors.push(t("plans.positionEdit.catNameReq"));
    if (!position.name) errors.push(t("plans.positionEdit.nameReq"));
    setErrors(errors);
    if (errors.length === 0) ApiHelper.post("/positions", [position], "DoingApi").then(props.updatedFunction);
  }

  const handleDelete = () => {
    if (window.confirm(t("plans.positionEdit.confirmDelete"))) {
      ApiHelper.delete("/positions/" + position.id, "DoingApi").then(props.updatedFunction);
    }
  }

  const getGroupOptions = () => {
    const result: JSX.Element[] = [];
    groups.forEach(g => {
      result.push(<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>);
    });
    return result;
  }

  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText={(props.position?.id) ? t("plans.positionEdit.posEdit") : t("plans.positionEdit.posAdd")} headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(position.id) ? handleDelete : null}>
      <FormControl fullWidth>
        <div style={{ fontSize: 12, color: "#999", position: "absolute", top: -8, left: 10, backgroundColor: "#FFF", zIndex: 999 }}>{t("plans.positionEdit.catName")}</div>
        <ReactSelect onInputChange={(newValue: string) => { setCategoryInput(newValue) }}
          value={categoryOption}
          onChange={(e: OptionType) => {
            setCategoryOption(e);
            const p = { ...position };
            p.categoryName = e.value;
            setPosition(p);
          }}
          options={options}
          isClearable
          placeholder={t("plans.positionEdit.selectCategory")}
        />
      </FormControl>
      <TextField fullWidth label={t("common.name")} id="name" name="name" type="text" value={position.name} onChange={handleChange} />
      <TextField fullWidth label={t("plans.positionEdit.volCount")} id="count" name="count" type="number" value={position.count} onChange={handleChange} />
      <FormControl fullWidth>
        <InputLabel>{t("plans.positionEdit.volGroup")}</InputLabel>
        <Select name="groupId" label={t("plans.positionEdit.volGroup")} value={position.groupId} onChange={handleChange}>
          {getGroupOptions()}
        </Select>
      </FormControl>
    </InputBox>
  </>);
}

