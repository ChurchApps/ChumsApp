import { type ConditionInterface } from "@churchapps/apphelper";

export class ConditionHelper {
  static getTitleCase = (word: string) => {
    const words = word.replace(/([A-Z])/g, " $1");
    return words.substring(0, 1).toUpperCase() + words.substring(1, words.length);
  };

  static getLabel(c: ConditionInterface) {
    const fieldData = c.fieldData ? JSON.parse(c.fieldData) : {};

    let displayField = this.getTitleCase(c.field);
    if (fieldData.datePart === "dayOfWeek") displayField += ": Day of week";
    if (fieldData.datePart === "dayOfMonth") displayField += ": Day of month";
    if (fieldData.datePart === "month") displayField += ": Month";
    if (fieldData.datePart === "years") displayField = "Years since " + displayField.toLowerCase();

    let displayOperator = c.operator;
    if (displayOperator === "=") displayOperator = "is";
    else if (displayOperator === "!=") displayOperator = "is not";
    else if (displayOperator === "startsWith") displayOperator = "starts with";
    else if (displayOperator === "endsWith") displayOperator = "ends with";

    let displayValue = c.value;
    const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthLabels = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    if (fieldData.datePart === "dayOfWeek") displayValue = dayLabels[parseInt(c.value) - 1];
    if (fieldData.datePart === "month") {
      if (c.value.indexOf("{") > -1) displayValue = this.getTitleCase(c.value.replace("{", "").replace("}", ""));
      else displayValue = monthLabels[parseInt(c.value) - 1];
    }

    const result = displayField + " " + displayOperator + " " + displayValue;

    return result;
  }
}
