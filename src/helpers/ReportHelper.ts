import { ReportInterface, ReportColumnInterface } from "./Interfaces";
import { DateHelper } from ".";

export class ReportHelper {

  static setDefaultValues(r: ReportInterface): void {
    r.values = [];
    r.parameters.split(",").forEach(p => {
      if (p === "churchId") r.values.push({ key: "churchId", value: 0 });
      if (p === "campusId") r.values.push({ key: "campusId", value: 0 });
      if (p === "serviceId") r.values.push({ key: "serviceId", value: 0 });
      if (p === "serviceTimeId") r.values.push({ key: "serviceTimeId", value: 0 });
      if (p === "groupCategory") r.values.push({ key: "groupCategory", value: "" });
      if (p === "groupId") r.values.push({ key: "groupId", value: 0 });
      if (p === "fundId") r.values.push({ key: "fundId", value: 0 });
      if (p === "week") r.values.push({ key: "week", value: DateHelper.getLastSunday() });
      if (p === "startDate") r.values.push({ key: "startDate", value: new Date(new Date().getFullYear(), 0, 1) });
      if (p === "endDate") r.values.push({ key: "endDate", value: new Date() });
    });
  }

  static getPrettyName(parameterName: string): string {
    let result = parameterName;
    switch (parameterName) {
      case "week": result = "Week"; break;
      case "startDate": result = "Start Date"; break;
      case "endDate": result = "End Date"; break;
      case "campusId": result = "Campus"; break;
      case "serviceId": result = "Service"; break;
      case "serviceTimeId": result = "Service Time"; break;
      case "groupCategory": result = "Category"; break;
      case "groupId": result = "Group"; break;
    }
    return result;
  }

  static getPrettyValue(col: ReportColumnInterface, value: any): string {
    let result = value && value.toString();
    switch (col.formatType) {
      case "date":
        try {
          console.log(new Date(value));
          result = DateHelper.prettyDate(new Date(value));
        } catch {
        //keep the original value
        }
        break;
    }
    return result;
  }

  static getFilteredRecords(records: any[], col: ReportColumnInterface, val: any) {
    let result: any[] = [];
    for (let i = 0; i < records.length; i++) if (records[i][col.field] === val) result.push(records[i]);
    return result;
  }

  static getSingleRecord(records: any[], col: ReportColumnInterface, val: any) {
    for (let i = 0; i < records.length; i++) if (records[i][col.field] === val) return records[i];
    return null;
  }

}
