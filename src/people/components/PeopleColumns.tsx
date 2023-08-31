import { Grid, Menu, MenuItem, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import { SmallButton } from "@churchapps/apphelper";

interface Props {
  columns: { key: string, label: string, shortName: string }[],
  selectedColumns: string[],
  toggleColumn: (key: string) => void
}

export function PeopleColumns(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getItems = () => {
    const result: JSX.Element[] = []
    props.columns.forEach((o, i) => {
      const option = o;
      const selectedClass = (props.selectedColumns.indexOf(o.key) > -1) ? "checked" : "";
      result.push(<Grid key={i} item md={6} xs={12}>
        <MenuItem key={i}><FormControlLabel control={<Checkbox size="small" checked={selectedClass === "checked"} onChange={(e) => { props.toggleColumn(e.target.name); }} name={option.key} />} label={option.label} /></MenuItem>
      </Grid>);
    });
    return result;
  }
  return (
    <>
      <SmallButton icon="view_column" onClick={handleClick} />
      <Menu id="fieldsMenu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <FormGroup>
          <Grid container spacing={3} style={{ maxWidth: 400 }}>
            {getItems()}
          </Grid>
        </FormGroup>
      </Menu>
    </>
  )
}
