import React from "react";
import { Dropdown } from "react-bootstrap";

interface Props {
  items: { key: string, label: string, shortName: string }[],
  selectedItem: string,
  toggleColumn: (key: string, index?: number) => void,
  index?: number
}

export function SingleSelectDropDown({items, selectedItem, toggleColumn, index}: Props) {

  const getItems = () => {
    const result: JSX.Element[] = []
    items.forEach(item => {
      result.push(<Dropdown.Item key={item.key} onClick={(e) => { toggleColumn(item.key, index) }}>{item.label}</Dropdown.Item>);
    });
    return result;
  }

  const selectedLabel = items.find(item => item.key === selectedItem)?.label;

  return (
    <Dropdown alignRight={true} id="fieldsDropdown" onSelect={() => false}>
      <Dropdown.Toggle id="dropdown-custom-components" className="btn-sm">
        {selectedLabel ?? "Fields"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {getItems()}
      </Dropdown.Menu>
    </Dropdown>
  )
}
