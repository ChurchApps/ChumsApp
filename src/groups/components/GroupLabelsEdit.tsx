import React, { useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { ApiHelper, type GroupInterface } from "@churchapps/apphelper";

interface Props {
  group: GroupInterface;
  onUpdate: (array: string[]) => void;
}

export const GroupLabelsEdit: React.FC<Props> = (props) => {
  const [allLabels, setAllLabels] = React.useState<string[]>(["Small Group", "Sunday School Class"]);
  const groupLabels = props.group?.labelArray;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.name;
    const idx = groupLabels.indexOf(val);
    if (idx === -1) groupLabels.push(val);
    else groupLabels.splice(idx, 1);
    props.onUpdate(groupLabels);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLabel = prompt("Enter a new label");
    if (newLabel) {
      const val = newLabel.trim();
      if (val.length > 0) {
        const idx = allLabels.indexOf(val);
        if (idx === -1) {
          allLabels.push(val);
          setAllLabels(allLabels.sort());
          groupLabels.push(val);
          props.onUpdate(groupLabels);
        }
      }
    }
  };

  const loadData = () => {
    ApiHelper.get("/groups", "MembershipApi").then((groups) => {
      const result: string[] = [];
      groups.forEach((group: GroupInterface) => {
        group.labelArray.forEach((label) => {
          if (!result.includes(label)) result.push(label);
        });
      });
      setAllLabels(result.sort());
    });
  };

  useEffect(loadData, []);

  const getLabelCheck = (key: string) => {
    const isChecked = groupLabels.includes(key);
    return (
      <FormControlLabel
        key={key}
        control={<Checkbox name={key} checked={isChecked} onChange={handleChange} data-testid={`label-checkbox-${key.toLowerCase().replace(/\s+/g, "-")}`} aria-label={`Label ${key}`} />}
        label={key}
      />
    );
  };

  const getItems = () => allLabels.map((key) => getLabelCheck(key));

  return (
    <>
      <div style={{ marginTop: 10 }}>Labels</div>
      {getItems()}
      <a href="about:blank" onClick={handleAdd} data-testid="add-new-label-link" aria-label="Add new label">
        Add New Label
      </a>
    </>
  );
};
