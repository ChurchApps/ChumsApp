import React, { SyntheticEvent } from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  columns: { key: string, label: string, shortName: string }[],
  selectedColumns: string[],
  toggleColumn: (key: string) => void
}

export function PeopleColumns(props: Props) {

  const [show, setShow] = React.useState(false)

  const getItems = () => {
    const result: JSX.Element[] = []
    props.columns.forEach(o => {
      const option = o;
      const selectedClass = (props.selectedColumns.indexOf(o.key) > -1) ? "checked" : ""
      result.push(<Dropdown.Item key={option.key} className={selectedClass} onClick={(e) => { props.toggleColumn(option.key) }}><i className="fa fa-check-square"></i> {o.label}</Dropdown.Item>);
    });
    return result;
  }

  const handleToggle = (isOpen: boolean, e: SyntheticEvent<Dropdown, Event>, metadata: any) => {
    if (metadata.source !== "select") setShow(!show);
  }

  return (
    <Dropdown alignRight={true} id="fieldsDropdown" style={{ float: "right" }} onSelect={() => false} show={show} onToggle={handleToggle}>
      <Dropdown.Toggle id="dropdown-custom-components" className="btn-sm">
        <i className="fa fa-columns" style={{ color: "#FFF" }}></i>
        Fields
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {getItems()}
      </Dropdown.Menu>
    </Dropdown>
  )
}
