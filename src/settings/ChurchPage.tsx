//NOTE - Temporarily broken.

import React from "react";
import {
  ApiHelper,
  UserHelper,
  DisplayBox,
  SettingInterface,
  Permissions
} from "./components";
import { Row, Col } from "react-bootstrap";

enum SettingType {
  ALLOW_GUEST_CHECKIN = "Allow guest checkin"
}

enum boolValues {
  TRUE = "true",
  FALSE = "false"
}

export const ChurchPage: React.FC = () => {
  const [settings, setSettings] = React.useState<SettingInterface[]>(null);
  const [guestCheckin, setGuestCheckin] = React.useState<boolean>(false);

  const loadData = () => {
    try {
      ApiHelper.get("/settings", "AttendanceApi").then((data: SettingInterface[]) => {
        setSettings(data);
        const allowCheckIn: SettingInterface[] = findAllowCheckIn(data);
        if (allowCheckIn.length > 0) {
          if (allowCheckIn[0].value === boolValues.TRUE) {
            setGuestCheckin(true);
          } else {
            setGuestCheckin(false);
          }
        }
      });
    } catch (err) {
      console.log("Error in fetching settings: ", err)
    }
  };

  const findAllowCheckIn = (settings: SettingInterface[]): SettingInterface[] => {
    const result: SettingInterface[] = [];
    settings.forEach(e => {
      if (e.keyName === SettingType.ALLOW_GUEST_CHECKIN) {
        result.push(e)
      }
    })

    return result;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowCheckIn = findAllowCheckIn(settings);
    const id = allowCheckIn[0]?.id || null;
    const setting: SettingInterface = {
      id,
      keyName: SettingType.ALLOW_GUEST_CHECKIN,
      value: JSON.stringify(e.currentTarget.checked)
    };
    try {
      ApiHelper.post("/settings", [setting], "AttendanceApi").then(() => {
        setGuestCheckin(!guestCheckin);
      });
    } catch (err) {
      console.log("Error in updating setting: ", err)
    }
  };

  React.useEffect(loadData, []);

  if (!UserHelper.checkAccess(Permissions.attendanceApi.settings.edit)) {
    return <></>;
  }
  return (
    <>
      <h1>
        <i className="fas fa-church"></i> Church Settings
      </h1>
      <Row>
        <Col lg={8}>
          <DisplayBox headerText="Edit Church Settings" headerIcon="fas fa-cog">
            <Row>
              <Col>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={guestCheckin}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Allow self checkin of guests</label>
                </div>
              </Col>
            </Row>
          </DisplayBox>
        </Col>
      </Row>
    </>
  );
};
