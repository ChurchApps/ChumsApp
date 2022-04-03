import React from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  toggleColumn: (key: string, index?: number) => void;
  paramType: string | undefined;
  selectedOperator: string;
  index?: number;
}

type Operations = {
  [key: string]: string
}

const stringOperations: Operations = {
  eq: "is equal to",
  nteq: "is not equal to",
  null: "is null",
  ntnull: "is not null",
  ctns: "contains",
  ntctns: "does not contain",
  bg: "begins with",
  end: "ends with"
}

const boolOperations: Operations = {
  true: "TRUE",
  false: "FALSE"
}

const dateOperations: Operations = {
  eq: "is equal to",
  nteq: "is not equal to",
  null: "is null",
  ntnull: "is not null",
  bf: "before",
  af: "after",
  btwn: "between"
}

const numberOperations: Operations = {
  eq: "is equal to",
  nteq: "is not equal to",
  lt: "is less than",
  gt: "is greater than",
  btwn: "is between",
  null: "is null",
  ntnull: "is not null",
  ctns: "contains",
  ntctns: "does not contain",
  bg: "begins with",
  end: "ends with"
}

const operationExample: Operations = {
  eq: "Example: John",
  nteq: "Example: John",
  lt: "Example: 89",
  gt: "Example: 89",
  btwn: "Example: 33-89",
  null: "",
  ntnull: "",
  ctns: "Example: Jo",
  ntctns: "Example: Jo",
  bg: "Example: Jo",
  end: "Example: son"
}

export function FilterDropDown({ toggleColumn, paramType, selectedOperator, index }: Props) {
  const getStringOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(stringOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op, index) }}>{stringOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getNumberOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(numberOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op, index) }}>{numberOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getBooleanOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(boolOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op, index) }}>{boolOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getDateOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(dateOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op, index) }}>{dateOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getOperatorName = () => {
    if(!selectedOperator) return "Operations"
    switch(paramType){
      case "number":
        return numberOperations[selectedOperator]
      case "string":
        return stringOperations[selectedOperator]
      case "boolean":
        return boolOperations[selectedOperator]
      case "date":
        return dateOperations[selectedOperator]
      default:
        return "Operations"
    }
  }

  return (
    <Dropdown id="fieldsDropdown">
      <Dropdown.Toggle id="dropdown-custom-components" className="btn-sm">
        {getOperatorName()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {paramType === "number"
          && getNumberOperations()
        }
        {paramType === "string"
          && getStringOperations()
        }
        {paramType === "boolean"
          && getBooleanOperations()
        }
        {paramType === undefined
          && getStringOperations()
        }
        {paramType === "date"
          && getDateOperations()
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}
