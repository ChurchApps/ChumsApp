import React, { SyntheticEvent, useState } from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  toggleColumn: (key: string) => void;
  filterParam: any;
}

type Operations = {
  [key: string]: string
}

const stringOperations: Operations = {
  EQUAL: "is equal to",
  NOT_EQUAL: "is not equal to",
  NULL: "is null",
  NOT_NULL: "is not null",
  CONTAINS: "contains",
  NOT_CONTAINS: "does not contain",
  BEGINS: "begins with",
  ENDS: "ends with"
}

const boolOperations: Operations = {
  TRUE: "TRUE",
  FALSE: "FALSE"
}

const dateOperations: Operations = {
  EQUAL: "is equal to",
  NOT_EQUAL: "is not equal to",
  NULL: "is null",
  NOT_NULL: "is not null",
  BEFORE: "before",
  AFTER: "after",
  BETWEEN: "between"
}

const numberOperations: Operations = {
  EQUAL: "is equal to",
  NOT_EQUAL: "is not equal to",
  LESS_THAN: "is less than",
  GREATER_THAN: "is greater than",
  BETWEEN: "is between",
  NULL: "is null",
  NOT_NULL: "is not null",
  CONTAINS: "contains",
  NOT_CONTAINS: "does not contain",
  BEGINS: "begins with",
  ENDS: "ends with"
}

const operationExample: Operations = {
  EQUAL: "Example: John",
  NOT_EQUAL: "Example: John",
  LESS_THAN: "Example: 89",
  GREATER_THAN: "Example: 89",
  BETWEEN: "Example: 33-89",
  NULL: "",
  NOT_NULL: "",
  CONTAINS: "Example: Jo",
  NOT_CONTAINS: "Example: Jo",
  BEGINS: "Example: Jo",
  ENDS: "Example: son"
}

export function FilterDropDown({ toggleColumn, filterParam }: Props) {

  const [show, setShow] = useState(false)

  const getStringOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(stringOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op) }}><i className="fa fa-check-square"></i>{stringOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getNumberOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(numberOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op) }}><i className="fa fa-check-square"></i>{numberOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getBooleanOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(boolOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op) }}><i className="fa fa-check-square"></i>{boolOperations[op]}</Dropdown.Item>)
    })
    return result;
  }
  const getDateOperations = () => {
    const result: JSX.Element[] = []
    Object.keys(dateOperations).map((op) => {
      result.push(<Dropdown.Item key={op} onClick={(e) => { toggleColumn(op) }}><i className="fa fa-check-square"></i>{dateOperations[op]}</Dropdown.Item>)
    })
    return result;
  }

  return (
    <Dropdown id="fieldsDropdown">
      <Dropdown.Toggle id="dropdown-custom-components" className="btn-sm">
        <i className="fa fa-greater-than-equal" style={{ color: "#FFF" }}></i>
        Operations
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {typeof filterParam === "number"
          && getNumberOperations()
        }
        {typeof filterParam === "string"
          && getStringOperations()
        }
        {typeof filterParam === "boolean"
          && getBooleanOperations()
        }
        {/* {typeof filterParam?.getDate() === "function"
          && Object.keys(dateOperations).map((op: string) => {
            <Dropdown.Item key={op} onClick={(e) => { toggleColumn(op) }}><i className="fa fa-check-square"></i>{dateOperations[op]}</Dropdown.Item>
          })
        } */}
      </Dropdown.Menu>
    </Dropdown>
  )
}
