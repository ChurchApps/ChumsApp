import React, { memo, useCallback, useMemo } from "react";

import { CampusEdit, ServiceEdit, ServiceTimeEdit } from "./";
import { Link } from "react-router-dom";
import {
  Icon, Table, TableBody, TableCell, TableRow, TableHead, IconButton, Menu, MenuItem, Paper, Box, Typography, Button, Stack 
} from "@mui/material";
import {
  type AttendanceInterface,
  type CampusInterface,
  type ServiceInterface,
  type ServiceTimeInterface,
  type GroupServiceTimeInterface,
  type GroupInterface,
  ArrayHelper,
  Loading,
  Locale,
} from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";

export const AttendanceSetup = memo(() => {
  const [selectedCampus, setSelectedCampus] = React.useState<CampusInterface>(null);
  const [selectedService, setSelectedService] = React.useState<ServiceInterface>(null);
  const [selectedServiceTime, setSelectedServiceTime] = React.useState<ServiceTimeInterface>(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const removeEditors = useCallback(() => {
    setSelectedCampus(null);
    setSelectedService(null);
    setSelectedServiceTime(null);
  }, []);

  const refetch = useCallback(() => {
    attendance.refetch();
    groupServiceTimes.refetch();
    groups.refetch();
  }, [attendance, groupServiceTimes, groups]);

  const handleUpdated = useCallback(() => {
    removeEditors();
    refetch();
  }, [removeEditors, refetch]);

  const selectCampus = useCallback(
    (campus: CampusInterface) => {
      removeEditors();
      if (campus.name !== "Undefined") setSelectedCampus(campus);
    },
    [removeEditors]
  );

  const selectService = useCallback(
    (service: ServiceInterface) => {
      removeEditors();
      setSelectedService(service);
    },
    [removeEditors]
  );

  const selectServiceTime = useCallback(
    (service: ServiceTimeInterface) => {
      removeEditors();
      setSelectedServiceTime(service);
    },
    [removeEditors]
  );

  const compare = useCallback((a: GroupInterface, b: GroupInterface) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name), []);

  const unassignedGroups = useMemo(() => {
    const result: GroupInterface[] = [];
    groups.data.forEach((g) => {
      if (g.trackAttendance) {
        const gsts: GroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes.data, "groupId", g.id);
        if (gsts.length === 0) result.push(g);
      }
    });
    return result;
  }, [groups.data, groupServiceTimes.data]);

  const getGroups = useCallback(
    (serviceTimeId: string) => {
      const result: GroupInterface[] = [];
      const gsts: GroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes.data, "serviceTimeId", serviceTimeId);
      gsts.forEach((gst) => {
        const group: GroupInterface = ArrayHelper.getOne(groups.data, "id", gst.groupId);
        if (group !== null && group.trackAttendance) result.push(group);
      });
      return result;
    },
    [groups.data, groupServiceTimes.data]
  );

  const handleAddCampus = useCallback(() => {
    handleClose();
    selectCampus({ id: "", name: "New Campus" });
  }, [handleClose, selectCampus]);

  const handleAddService = useCallback(() => {
    handleClose();
    selectService({ id: "", campusId: "", name: "New Service" });
  }, [handleClose, selectService]);

  const handleAddServiceTime = useCallback(() => {
    handleClose();
    selectServiceTime({ id: "", serviceId: "", name: "New Service Time" });
  }, [handleClose, selectServiceTime]);

  const editLinks = useMemo(
    () => (
      <>
        <IconButton
          aria-label="Add attendance"
          id="addBtnGroup"
          data-cy="add-button"
          aria-controls={open ? "add-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          data-testid="add-attendance-button">
          <Icon color="primary">add</Icon>
        </IconButton>
        <Menu id="add-menu" MenuListProps={{ "aria-labelledby": "addBtnGroup" }} anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem data-cy="add-campus" onClick={handleAddCampus} data-testid="add-campus-menu-item" aria-label="Add campus">
            <Icon sx={{ mr: "3px" }}>church</Icon> {Locale.label("attendance.attendancePage.addCampus")}
          </MenuItem>
          <MenuItem aria-label="addService" data-cy="add-service" onClick={handleAddService} data-testid="add-service-menu-item">
            <Icon sx={{ mr: "3px" }}>calendar_month</Icon> {Locale.label("attendance.attendancePage.addService")}
          </MenuItem>
          <MenuItem data-cy="add-service-time" onClick={handleAddServiceTime} data-testid="add-service-time-menu-item" aria-label="Add service time">
            <Icon sx={{ mr: "3px" }}>more_time</Icon> {Locale.label("attendance.attendancePage.addServiceTime")}
          </MenuItem>
        </Menu>
      </>
    ),
    [open, anchorEl, handleClick, handleClose, handleAddCampus, handleAddService, handleAddServiceTime]
  );

  const tableHeader = useMemo(() => {
    if (attendance.data.length === 0) return [];
    return [
      <TableRow key="header">
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("attendance.attendancePage.campus")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("attendance.attendancePage.service")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("attendance.attendancePage.time")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("attendance.attendancePage.category")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("attendance.attendancePage.group")}</TableCell>
      </TableRow>,
    ];
  }, [attendance.data.length]);

  const getRows = useCallback(() => {
    const rows: JSX.Element[] = [];
    let lastCampus = "";
    let lastService = "";
    let lastServiceTime = "";
    let lastCategory = "";

    if (attendance.data.length === 0) {
      rows.push(
        <TableRow key="0">
          <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
            <Stack spacing={2} alignItems="center">
              <Icon sx={{ fontSize: 48, color: "#ccc" }}>group</Icon>
              <Typography variant="h6" color="text.secondary">
                {Locale.label("attendance.attendancePage.groupAttMsg")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up campuses, services, and service times to get started
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
      return rows;
    }

    const getRow = (campus: CampusInterface, service: ServiceInterface, serviceTime: ServiceTimeInterface, group: GroupInterface, key: string) => {
      const campusHtml =
        campus === undefined || campus?.name === lastCampus ? (
          <></>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: "#666", fontSize: 18 }}>church</Icon>
            <Button
              variant="text"
              size="small"
              onClick={() => selectCampus(campus)}
              sx={{
                color: "#1565C0",
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                p: 0,
              }}>
              {campus.name}
            </Button>
          </Stack>
        );

      const serviceHtml =
        service === undefined || service?.name === lastService ? (
          <></>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: "#666", fontSize: 18 }}>calendar_month</Icon>
            <Button
              variant="text"
              size="small"
              onClick={() => selectService(service)}
              sx={{
                color: "#1565C0",
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                p: 0,
              }}>
              {service.name}
            </Button>
          </Stack>
        );

      const serviceTimeHtml =
        serviceTime === undefined || serviceTime?.name === lastServiceTime ? (
          <></>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: "#666", fontSize: 18 }}>schedule</Icon>
            <Button
              variant="text"
              size="small"
              onClick={() => selectServiceTime(serviceTime)}
              sx={{
                color: "#1565C0",
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                p: 0,
              }}>
              {serviceTime.name}
            </Button>
          </Stack>
        );

      const categoryHtml =
        group === undefined || group?.categoryName === lastCategory ? (
          <></>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: "#666", fontSize: 18 }}>folder</Icon>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {group.categoryName}
            </Typography>
          </Stack>
        );

      const groupHtml =
        group === undefined ? (
          <></>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: "#666", fontSize: 18 }}>list</Icon>
            <Link
              to={"/groups/" + group.id}
              style={{
                textDecoration: "none",
                color: "#1565C0",
                fontWeight: 500,
              }}>
              {group.name}
            </Link>
          </Stack>
        );

      const result = (
        <TableRow
          key={key}
          sx={{
            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            borderBottom: "1px solid #e0e0e0",
          }}>
          <TableCell sx={{ py: 2 }}>{campusHtml}</TableCell>
          <TableCell sx={{ py: 2 }}>{serviceHtml}</TableCell>
          <TableCell sx={{ py: 2 }}>{serviceTimeHtml}</TableCell>
          <TableCell sx={{ py: 2 }}>{categoryHtml}</TableCell>
          <TableCell sx={{ py: 2 }}>{groupHtml}</TableCell>
        </TableRow>
      );

      lastCampus = campus?.name;
      lastService = service?.name;
      lastServiceTime = serviceTime?.name;
      lastCategory = group?.categoryName;
      return result;
    };

    attendance.data.forEach((a, i) => {
      const filteredGroups = a.serviceTime === undefined ? [] : getGroups(a.serviceTime.id);
      const sortedGroups = filteredGroups.sort(compare);
      if (sortedGroups.length > 0) {
        sortedGroups.forEach((g) => {
          rows.push(getRow(a.campus, a.service, a.serviceTime, g, g.id.toString()));
        });
      } else rows.push(getRow(a.campus, a.service, a.serviceTime, undefined, "index" + i.toString()));
    });
    unassignedGroups.forEach((g) => {
      rows.push(getRow({ name: "Unassigned" }, undefined, undefined, g, g.id.toString()));
    });
    return rows;
  }, [attendance.data, getGroups, compare, unassignedGroups, selectCampus, selectService, selectServiceTime]);

  const table = useMemo(() => {
    if (attendance.isLoading) return <Loading />;
    return (
      <Paper
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 0,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}>
        <Table size="medium">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>{tableHeader}</TableHead>
          <TableBody sx={{ whiteSpace: "nowrap" }}>{getRows()}</TableBody>
        </Table>
      </Paper>
    );
  }, [attendance.isLoading, tableHeader, getRows]);

  return (
    <>
      <CampusEdit campus={selectedCampus} updatedFunction={handleUpdated} />
      <ServiceEdit service={selectedService} updatedFunction={handleUpdated} />
      <ServiceTimeEdit serviceTime={selectedServiceTime} updatedFunction={handleUpdated} />

      {/* Modern Header Section */}
      <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Icon sx={{ color: "#1565C0", fontSize: 28 }}>group</Icon>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1565C0" }}>
              {Locale.label("attendance.attendancePage.groups")}
            </Typography>
          </Stack>
          {editLinks}
        </Stack>
      </Box>

      {/* Table Section */}
      <Box sx={{ p: 0 }}>{table}</Box>
    </>
  );
});
