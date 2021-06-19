import React from "react";
import { ApiHelper } from "./";
import { ReportFilterInterface, ReportInterface, ReportFilterOptionInterface } from "../../appBase/interfaces/ReportInterfaces";
import { ReportWithFilter } from "../../appBase/components/reporting/ReportWithFilter";
import { ArrayHelper, DateHelper } from "../../appBase/helpers";
import { GroupInterface, PersonInterface, ServiceInterface } from "../../helpers";

export const GroupAttendance = () => {
  const [services, setServices] = React.useState<ServiceInterface[]>(null);
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [updateFilter, setUpdateFilter] = React.useState(false);
  const [initialFilter, setInitialFilter] = React.useState<ReportFilterInterface>(null);

  const convertToReportData = (data: any[], people: PersonInterface[]) => {
    const result: any[] = [];
    data.forEach(d => {
      let group: GroupInterface = ArrayHelper.getOne(groups, "id", d.groupId);
      let person: PersonInterface = ArrayHelper.getOne(people, "id", d.personId);
      result.push({
        serviceName: d.serviceName,
        serviceTimeName: d.serviceTimeName,
        groupName: group?.name || "",
        personName: person?.name?.display || ""
      });
    });
    return result;
  }

  const getFilterOptions = (data: any[]) => {
    let result: ReportFilterOptionInterface[] = [];
        data?.forEach(d => { result.push({ keyName: d.id.toString(), value: d.id.toString(), label: d.name }) });
        return result;
  }

  const getServiceOptions = () => getFilterOptions(services);

  const loadReport = async (filter: ReportFilterInterface) => {
    if (filter === null) return;
    const serviceId = ArrayHelper.getOne(filter.fields, "keyName", "serviceId").value;
    const week = ArrayHelper.getOne(filter.fields, "keyName", "week").value;
    let url = `/attendancerecords/groups?serviceId=${serviceId}&week=${DateHelper.formatHtml5Date(week)}`;
    return ApiHelper.get(url, "AttendanceApi").then(async (data: any) => {

      const peopleIds = ArrayHelper.getUniqueValues(data, "personId");
      const people = (peopleIds.length === 0) ? [] : await ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi");

      const r: ReportInterface = {
        headings: [
          { name: "Service Time", field: "serviceTimeName" },
          { name: "Group", field: "groupName" },
          { name: "Person", field: "personName" }
        ],
        groupings: ["serviceTimeName", "groupName"],
        data: convertToReportData(data, people),
        title: "Group Attendance",
        keyName: "groupAttendance",
        reportType: "Grouped"
      };
      return r;
    });
  }

  const initFilter = async () => {
    const promises: Promise<any>[] = [];
    promises.push(ApiHelper.get("/services", "AttendanceApi").then((data: ServiceInterface[]) => { data.unshift({ id: "", name: "Any" }); setServices(data); }));
    promises.push(ApiHelper.get("/groups", "MembershipApi").then((data: GroupInterface[]) => { setGroups(data); }));
    await Promise.all(promises).then(() => {
      setUpdateFilter(true);
    });
  }

  const populateFilter = () => {
    if (updateFilter) {
      setInitialFilter({
        keyName: "groupAttendanceFilter",
        fields: [
          { keyName: "serviceId", displayName: "Service", dataType: "list", value: 0, options: getServiceOptions },
          { keyName: "week", displayName: "Week", dataType: "date", value: new Date() }
        ]
      });
      setUpdateFilter(false);
    }
  }

  React.useEffect(() => { initFilter() }, []);
  React.useEffect(populateFilter, [populateFilter]);

  return <ReportWithFilter fetchReport={loadReport} filter={initialFilter} />
}
