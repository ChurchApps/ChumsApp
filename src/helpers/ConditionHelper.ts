import { ConditionInterface } from ".";

export class ConditionHelper {

  static getTitleCase = (word: string) => {
    const words = word.replace(/([A-Z])/g, " $1");
    return words.substring(0, 1).toUpperCase() + word.substring(1, word.length);
  }

  static getLabel(c: ConditionInterface) {
    let result = this.getTitleCase(c.field);

    let displayOperator = c.operator;
    if (displayOperator === "=") displayOperator = "is";
    else if (displayOperator === "!=") displayOperator = "is not";
    else if (displayOperator === "startsWith") displayOperator = "starts with";
    else if (displayOperator === "endsWith") displayOperator = "ends with";
    result += " " + displayOperator + " " + c.value;
    return result;
  }

}
