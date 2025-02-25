import { TableHead, Table, TableCell, TableRow, TableBody } from "@mui/material";
import React, { useState } from "react";
import { ApiHelper, ErrorMessages, Banner, DisplayBox, DateHelper, SmallButton } from "@churchapps/apphelper"
import { PairScreen } from "./components/PairScreen";
import { Link } from "react-router-dom";
import { DeviceEdit } from "./components/DeviceEdit";

export interface DeviceInterface { id: string, appName: string, deviceId: string, personId: string, fcmToken: string, label: string, registrationDate: Date, lastActiveDate: Date, deviceInfo: string }

export const DevicesPage = () => {

  const [errors, setErrors] = useState([]);
  const [devices, setDevices] = useState<DeviceInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editDevice, setEditDevice] = useState<DeviceInterface>(null);


  const loadData = () => {
    ApiHelper.get("/devices/my", "MessagingApi").then(data => {
      data = data.filter((d: DeviceInterface) => d.appName === "ChurchAppsPlayer");
      setDevices(data)
    });
  }

  React.useEffect(loadData, []);

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true); }} />

  return (
    <>
      <Banner>
        <h1>Devices</h1>
      </Banner>
      <div id="mainContent">
        {showAdd && <PairScreen updatedFunction={() => { setShowAdd(false); loadData(); }} />}
        {editDevice && <DeviceEdit device={editDevice} updatedFunction={() => { setEditDevice(null); loadData(); }} />}
        <ErrorMessages errors={errors} />
        <DisplayBox headerText="Devices" headerIcon="tv" editContent={editContent}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Last Active Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device, index) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditDevice(device) }}>{device.label || "Device"}</a>
                  </TableCell>
                  <TableCell>{DateHelper.convertToDate(device.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{DateHelper.convertToDate(device.lastActiveDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DisplayBox>
      </div>
    </>
  );
}
