import React, {useState, useEffect} from "react";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns, FilterDropDown, PeopleColumnsDropDown, SingleSelectDropDown } from "./";
import { FormControl, Button } from "react-bootstrap";
import { PersonHelper } from "../../helpers";

interface Props {
  columns: {
    key: string;
    label: string;
    shortName: string;
    type: string;
}[],
handleResetButton: () => void;
}

type FilterCriteria = {
    field: string;
    operator: string;
    criteria: string;
  }

const emptyFilter = {
  field: "",
  operator: "",
  criteria: ""
}

export const FilterBox = ({ columns, handleResetButton }: Props) => {
  const [filterArray, setFilterArray] = useState<FilterCriteria[]>([emptyFilter]);

  const updateFilterArrayField = (field: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      field
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }
  const updateFilterArrayOperator = (operator: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      operator
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }
  const updateFilterArrayCriteria = (criteria: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      criteria
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }

  const handleAddFilter = () => {
    setFilterArray([...filterArray, emptyFilter])
  }
  const handleClearFilters = () => {
    handleResetButton();
    setFilterArray([emptyFilter])
  }

  const handleSubmitFilters = () => {
    const query = buildQueryString();
    console.log(query)
    ApiHelper.get("/people" + query, "MembershipApi").then(data => {
      console.log(data)
    });
  }
  const buildQueryString = () => {
    let query = "?"
    filterArray.forEach((filter, i) => {
      if(filter.field !== "" && filter.operator !== ""){
        if(i > 0)query += "&"
        if(filter.field.toLocaleLowerCase() === "age"){
          if(filter.operator === "btwn"){
            if(filter.criteria.includes("-")){
              const val1 = filter.criteria.split("-")[0];
              const val2 = filter.criteria.split("-")[1];
              const val1Date = PersonHelper.convertAgeToDate(Number(val1));
              const val2Date = PersonHelper.convertAgeToDate(Number(val2));
              query += "birthDate" + `[${filter.operator}]=` + `${val2Date}-${val1Date}`
            }
          }else{
            if(filter.operator === "null" || filter.operator === "ntnull"){
              query += "birthDate" + `[${filter.operator}]`;
            }else{
              query += "birthDate" + `[${filter.operator}]=` + PersonHelper.convertAgeToDate(Number(filter.criteria))
            }
          }
        }else{
          if(filter.operator === "null" || filter.operator === "ntnull"){
            query += filter.field + `[${filter.operator}]`;
          }else{
            query += filter.field + `[${filter.operator}]=` +  filter.criteria;
          }
        }
      }
    })
    return query;
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmitFilters(); } }

  return (
    <DisplayBox headerIcon="fas fa-filter" headerText="Filter">
      {filterArray.map((filter, i) => (
        <>
          {i > 0 && <p>AND</p>}
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop:10, marginBottom:10}}>
            <SingleSelectDropDown toggleColumn={updateFilterArrayField} items={columns} selectedItem={filterArray[i].field} index={i} />
            <FilterDropDown toggleColumn={updateFilterArrayOperator} paramType={columns.find(col => col.key === filterArray[i].field)?.type} selectedOperator={filterArray[i].operator} index={i} />
            {(filterArray[i].operator !== "null" && filterArray[i].operator !== "ntnull") ? <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Filter criteria" value={filterArray[i].criteria} onChange={(e) => updateFilterArrayCriteria(e.currentTarget.value, i)} onKeyDown={handleKeyDown} style={{maxWidth: 100}} /> : <span style={{width: 100}}></span>}
          </div>
        </>
      ))}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 50}}>
        <Button id="addFilterButton" variant="primary" onClick={handleAddFilter}>Add Filter</Button>
        <Button id="resetFilterButton" variant="warning" onClick={handleClearFilters}>Clear All</Button>
        <Button id="applyFilterButton" variant="success" onClick={handleSubmitFilters}>Apply</Button>
      </div>
    </DisplayBox>
  )
}
