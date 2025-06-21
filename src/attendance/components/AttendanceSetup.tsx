import React from "react";

import { CampusEdit, ServiceEdit, ServiceTimeEdit } from "./";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow, TableHead, IconButton, Menu, MenuItem, Paper, Box } from "@mui/material";
import { type CampusInterface, type ServiceInterface, type ServiceTimeInterface, type GroupServiceTimeInterface, type GroupInterface, DisplayBox, ArrayHelper, Loading, Locale, type AttendanceInterface } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";




export const AttendanceSetup: React.FC = () => {

  const [selectedCampus, setSelectedCampus] = React.useState<CampusInterface>(null);
  const [selectedService, setSelectedService] = React.useState<ServiceInterface>(null);
  const [selectedServiceTime, setSelectedServiceTime] = React.useState<ServiceTimeInterface>(null);
  //const [filter, setFilter] = React.useState<AttendanceFilterInterface>(AttendanceHelper.createFilter());

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdated = () => { removeEditors(); refetch(); }
  const selectCampus = (campus: CampusInterface) => { removeEditors(); if (campus.name !== "Undefined") setSelectedCampus(campus); }
  const selectService = (service: ServiceInterface) => { removeEditors(); setSelectedService(service); }
  const selectServiceTime = (service: ServiceTimeInterface) => { removeEditors(); setSelectedServiceTime(service); }
  const removeEditors = () => { setSelectedCampus(null); setSelectedService(null); setSelectedServiceTime(null); }
  const refetch = () => { attendance.refetch(); groupServiceTimes.refetch(); groups.refetch(); }
  
  const attendance = useQuery<AttendanceInterface[]>({
    queryKey: ["/attendancerecords/tree", "AttendanceApi"],
    placeholderData: [],
  });

  const groupServiceTimes = useQuery<GroupServiceTimeInterface[]>({
    queryKey: ["/groupservicetimes", "AttendanceApi"],
    placeholderData: [],
  });

  const groups = useQuery<GroupInterface[]>({
    queryKey: ["/groups", "MembershipApi"],
    placeholderData: [],
  });

  let lastCampus = "";
  let lastService = "";
  let lastServiceTime = "";
  let lastCategory = "";

  const compare = (a: GroupInterface, b: GroupInterface) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name)

  const getRows = () => {
    const rows: JSX.Element[] = [];

    if (attendance.data.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("attendance.attendancePage.groupAttMsg")}</TableCell></TableRow>);
      return rows;
    }

    attendance.data.forEach((a, i) => {
      const filteredGroups = (a.serviceTime === undefined) ? [] : getGroups(a.serviceTime.id);
      const sortedGroups = filteredGroups.sort(compare);
      if (sortedGroups.length > 0) sortedGroups.forEach(g => { rows.push(getRow(a.campus, a.service, a.serviceTime, g, g.id.toString())); });
      else rows.push(getRow(a.campus, a.service, a.serviceTime, undefined, "index" + i.toString()));
    })
    getUnassignedGroups().forEach(g => { rows.push(getRow({ name: "Unassigned" }, undefined, undefined, g, g.id.toString())); });
    return rows;
  }

  const getRow = (campus: CampusInterface, service: ServiceInterface, serviceTime: ServiceTimeInterface, group: GroupInterface, key: string) => {
    let campusHtml = (campus === undefined || campus?.name === lastCampus) ? <></> : <Box sx={{display: "flex", alignItems: "center"}}><Icon>church</Icon><a href="about:blank" onClick={(e) => { e.preventDefault(); selectCampus(campus); }}>{campus.name}</a></Box>
    let serviceHtml = (service === undefined || service?.name === lastService) ? <></> : <Box sx={{display: "flex", alignItems: "center"}}><Icon>calendar_month</Icon><a href="about:blank" onClick={(e) => { e.preventDefault(); selectService(service); }}>{service.name}</a></Box>
    let serviceTimeHtml = (serviceTime === undefined || serviceTime?.name === lastServiceTime) ? <></> : <Box sx={{display: "flex", alignItems: "center"}}><Icon>schedule</Icon><a href="about:blank" onClick={(e) => { e.preventDefault(); selectServiceTime(serviceTime); }}>{serviceTime.name}</a></Box>
    let categoryHtml = (group === undefined || group?.categoryName === lastCategory) ? <></> : <Box sx={{display: "flex", alignItems: "center"}}><Icon>folder</Icon>{group.categoryName}</Box>
    let groupHtml = (group === undefined) ? <></> : <Box sx={{display: "flex", alignItems: "center"}}><Icon>list</Icon><Link to={"/groups/" + group.id}>{group.name}</Link></Box>

    const result = (<TableRow key={key}><TableCell>{campusHtml}</TableCell><TableCell>{serviceHtml}</TableCell><TableCell>{serviceTimeHtml}</TableCell><TableCell>{categoryHtml}</TableCell><TableCell>{groupHtml}</TableCell></TableRow>)

    lastCampus = campus?.name;
    lastService = service?.name;
    lastServiceTime = serviceTime?.name;
    lastCategory = group?.categoryName;
    return result;
  }

  const getUnassignedGroups = () => {
    const result: GroupInterface[] = [];
    groups.data.forEach(g => {
      if (g.trackAttendance) {
        const gsts: GroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes.data, "groupId", g.id);
        if (gsts.length === 0) result.push(g);
      }
    });
    return result;
  }

  const getGroups = (serviceTimeId: string) => {
    const result: GroupInterface[] = [];
    const gsts: GroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes.data, "serviceTimeId", serviceTimeId);
    gsts.forEach(gst => {
      const group: GroupInterface = ArrayHelper.getOne(groups.data, "id", gst.groupId);
      if (group !== null && group.trackAttendance) result.push(group);
    });
    return result;
  }

  const getEditLinks = () => (
    <>
      <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" aria-controls={open ? "add-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" onClick={handleClick}>
        <Icon color="primary">add</Icon>
      </IconButton>
      <Menu id="add-menu" MenuListProps={{ "aria-labelledby": "addBtnGroup" }} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem data-cy="add-campus" onClick={() => {handleClose(); selectCampus({ id: "", name: "New Campus" }); }}>
          <Icon sx={{mr: "3px"}}>church</Icon> {Locale.label("attendance.attendancePage.addCampus")}
        </MenuItem>
        <MenuItem aria-label="addService" data-cy="add-service" onClick={() => {handleClose(); selectService({ id: "", campusId: "", name: "New Service" }); }}>
          <Icon sx={{mr: "3px"}}>calendar_month</Icon> {Locale.label("attendance.attendancePage.addService")}
        </MenuItem>
        <MenuItem data-cy="add-service-time" onClick={() => {handleClose(); selectServiceTime({ id: "", serviceId: "", name: "New Service Time" }); }}>
          <Icon sx={{mr: "3px"}}>more_time</Icon> {Locale.label("attendance.attendancePage.addServiceTime")}
        </MenuItem>
      </Menu>
    </>
  )

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (attendance.data.length === 0) return rows;
    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>{Locale.label("attendance.attendancePage.campus")}</th><th>{Locale.label("attendance.attendancePage.service")}</th><th>{Locale.label("attendance.attendancePage.time")}</th><th>{Locale.label("attendance.attendancePage.category")}</th><th>{Locale.label("attendance.attendancePage.group")}</th></TableRow>);
    return rows;
  }

  const getTable = () => {
    if (attendance.isLoading) return <Loading />
    else return (<Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small">
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody sx={{whiteSpace: "nowrap"}}>{getRows()}</TableBody>
      </Table>
    </Paper>);
  }


  return (
    <>
      <CampusEdit campus={selectedCampus} updatedFunction={handleUpdated} />
      <ServiceEdit service={selectedService} updatedFunction={handleUpdated} />
      <ServiceTimeEdit serviceTime={selectedServiceTime} updatedFunction={handleUpdated} />
      <DisplayBox id="groupsBox" data-cy="attendance-groups" headerIcon="group" headerText={Locale.label("attendance.attendancePage.groups")} editContent={getEditLinks()} help="chums/attendance">
        {getTable()}
      </DisplayBox>
    </>
  );
}
