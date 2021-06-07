import React from "react";
import { ApiHelper, CampusInterface } from "./";
import { ReportFilterInterface, ReportInterface, ReportFilterOptionInterface } from "../../appBase/interfaces/ReportInterfaces";
import { ReportWithFilter } from "../../appBase/components/reporting/ReportWithFilter";
import { ArrayHelper, DateHelper } from "../../appBase/helpers";
import { GroupInterface, ServiceInterface, ServiceTimeInterface } from "../../helpers";

export const AttendanceTrend = () => {
  const [campuses, setCampuses] = React.useState<CampusInterface[]>(null);
  const [services, setServices] = React.useState<ServiceInterface[]>(null);
  const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>(null);
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [updateFilter, setUpdateFilter] = React.useState(false);
  const [initialFilter, setInitialFilter] = React.useState<ReportFilterInterface>(null);

  const convertTrendToReportData = (data: any[]) => {
    const result: any[] = [];
    data.forEach(d => {
      result.push({
        week: DateHelper.prettyDate(new Date(d.week)),
        visits: d.visits,
      });
    });
    return result;
  }

  const getFilterOptions = (data: any[]) => {
    let result: ReportFilterOptionInterface[] = [];
        data?.forEach(d => { result.push({ keyName: d.id.toString(), value: d.id.toString(), label: d.name }) });
        return result;
  }

  const getCampusOptions = () => getFilterOptions(campuses);
  const getServiceOptions = () => getFilterOptions(services);
  const getServiceTimeOptions = () => getFilterOptions(serviceTimes);
  const getGroupOptions = () => getFilterOptions(groups);
  const getCategoryOptions = () => {
    let result: ReportFilterOptionInterface[] = [{ keyName: "Any", value: "", label: "Any" }];
    if (groups !== null) ArrayHelper.getUniqueValues(groups, "categoryName").forEach(cat => { if (cat !== "") result.push({ keyName: cat, value: cat, label: cat }) });
    return result;
  };

  const loadReport = async (filter: ReportFilterInterface) => {
    if (filter === null) return;

    const campusId = ArrayHelper.getOne(filter.fields, "keyName", "campusId").value;
    const serviceId = ArrayHelper.getOne(filter.fields, "keyName", "serviceId").value;
    const serviceTimeId = ArrayHelper.getOne(filter.fields, "keyName", "serviceTimeId").value;
    //const categoryName = ArrayHelper.getOne(filter.fields, "keyName", "categoryName").value;
    const groupId = ArrayHelper.getOne(filter.fields, "keyName", "groupId").value;

    let url = `/attendancerecords/trend?campusId=${campusId}&serviceId=${serviceId}&serviceTimeId=${serviceTimeId}&groupId=${groupId}`;
    return ApiHelper.get(url, "AttendanceApi").then((trend) => {
      const r: ReportInterface = {
        headings: [
          { name: "Week", field: "week" },
          { name: "Visits", field: "visits" },
        ],
        groupings: ["week"],
        data: convertTrendToReportData(trend),
        title: "Attendance Trend",
        keyName: "attendanceTrend",
        reportType: "Bar Chart",
      };
      return r;
    });
  }

  const initFilter = async () => {
    const promises: Promise<any>[] = [];
    promises.push(ApiHelper.get("/campuses", "AttendanceApi").then((data: CampusInterface[]) => { data.unshift({ id: "", name: "Any" }); setCampuses(data); }));
    promises.push(ApiHelper.get("/services", "AttendanceApi").then((data: ServiceInterface[]) => { data.unshift({ id: "", name: "Any" }); setServices(data); }));
    promises.push(ApiHelper.get("/servicetimes", "AttendanceApi").then((data: ServiceTimeInterface[]) => { data.unshift({ id: "", name: "Any" }); setServiceTimes(data); }));
    promises.push(ApiHelper.get("/groups", "MembershipApi").then((data: GroupInterface[]) => { data.unshift({ id: "", name: "Any" }); setGroups(data); }));
    await Promise.all(promises).then(() => {
      setUpdateFilter(true);
    });
  }

  const populateFilter = () => {
    if (updateFilter) {
      setInitialFilter({
        keyName: "attendanceTrendFilter",
        fields: [
          { keyName: "campusId", displayName: "Campus", dataType: "list", value: 0, options: getCampusOptions },
          { keyName: "serviceId", displayName: "Service", dataType: "list", value: 0, options: getServiceOptions },
          { keyName: "serviceTimeId", displayName: "Service Time", dataType: "list", value: 0, options: getServiceTimeOptions },
          { keyName: "categoryName", displayName: "Category", dataType: "list", value: 0, options: getCategoryOptions },
          { keyName: "groupId", displayName: "Group", dataType: "list", value: 0, options: getGroupOptions },
        ],
      });
      setUpdateFilter(false);
    }
  }

  React.useEffect(() => { initFilter() }, []);
  React.useEffect(populateFilter, [populateFilter]);

  return <ReportWithFilter fetchReport={loadReport} filter={initialFilter} />
}
