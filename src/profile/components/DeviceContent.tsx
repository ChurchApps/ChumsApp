import React, { useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ApiHelper, ArrayHelper } from "@churchapps/apphelper";
import { type DeviceInterface } from "../DevicesPage";

interface Props {
  device: DeviceInterface;
}

interface DeviceContentInterface {
  deviceId: string;
  contentId: string;
  contentType: string;
}

export const DeviceContent = (props: Props) => {
  const [classRooms, setClassRooms] = React.useState<any[]>([]);
  const [contents, setContents] = React.useState<DeviceContentInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/classrooms", "LessonsApi").then((data) => {
      setClassRooms(data);
    });
    ApiHelper.get("/deviceContents/deviceId/" + props.device.id, "MessagingApi").then((data) => {
      setContents(data);
    });
  };

  useEffect(loadData, [props.device.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newRecord: DeviceContentInterface = { deviceId: props.device.id, contentType: "classroom", contentId: e.target.value };
      ApiHelper.post("/deviceContents", [newRecord], "MessagingApi").then(() => {
        loadData();
      });
    } else {
      console.log("CONTENTS ARE", contents);
      const existing = ArrayHelper.getOne(contents, "contentId", e.target.value);
      ApiHelper.delete("/deviceContents/" + existing.id, "MessagingApi").then(() => {
        loadData();
      });
    }
  };

  return (
    <>
      <hr />
      <h3>Associated Content</h3>
      <FormGroup>
        {classRooms.map((c) => (
          <FormControlLabel
            key={c.id}
            control={
              <Checkbox
                value={c.id}
                onChange={handleChange}
                defaultChecked={ArrayHelper.getOne(contents, "contentId", c.id) !== null}
                data-testid={`classroom-checkbox-${c.id}`}
                aria-label={`Classroom ${c.name}`}
              />
            }
            label={c.name}
          />
        ))}
      </FormGroup>
    </>
  );
};
