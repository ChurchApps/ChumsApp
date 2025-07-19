import { ColumnInterface } from "@churchapps/helpers";
import { DateHelper } from "@churchapps/apphelper";

export class ReportHelper {

  static getField = (column: ColumnInterface, dataRow: any) => {
    let result = "";
    try {
      result = dataRow[column.value]?.toString() || "";
    } catch {
      // Keep original empty value
    }

    switch (column.formatter) {
      case "date":
        const dt = new Date(result);
        result = DateHelper.prettyDate(dt);
        break;
      case "number":
        try {
          const num = parseFloat(result);
          result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch {
          // Keep original value if parsing fails
        }
        break;
      case "dollars":
        try {
          const num = parseFloat(result);
          const usd = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" });
          result = usd.format(num).replace(".00", "");
        } catch {
          // Keep original value if parsing fails
        }
        break;
    }
    return result;
  };

}