import { FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React from "react";
import { RowMobileSizes } from "./RowMobileSizes";
import { RowMobileOrder } from "./RowMobileOrder";

type Props = {
  parsedData: any;
  onRealtimeChange: (parsedData: any) => void;
  setErrors: (errors: string[]) => void
};

export function RowEdit(props: Props) {
  const cols: number[] = []
  props.parsedData.columns?.split(",").forEach((c: string) => cols.push(parseInt(c)));
  const [showMobileSizes, setShowMobileSizes] = React.useState(false);
  const [showMobileOrder, setShowMobileOrder] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    const data = { ...props.parsedData };
    if (e.target.name === "columns") data.columns = (e.target.value === "custom") ? "6,3,3" : e.target.value;
    props.onRealtimeChange(data)
    props.setErrors([]);
  };

  const getPreviewTable = () => {
    const colors = ["#FBF8CC", "#FDE4CF", "#FFCFD2", "#F1C0E8", "#CFBAF0", "#A3C4F3", "#90DBF4", "#8EECF5", "#98F5E1", "B9FBC0", "#FBF8CC", "#FDE4CF"]
    let result: React.ReactElement[] = [];
    let idx = 0;
    cols.forEach(c => {
      result.push(<TableCell key={idx} style={{ backgroundColor: colors[idx], width: Math.round(c / 12 * 100).toString() + "%" }} colSpan={c}>{c}</TableCell>)
      idx++;
    });
    return (<Table size="small">
      <TableBody>
        <TableRow>
          {result}
        </TableRow>
      </TableBody>
    </Table>);
  }

  const updateColumns = () => {
    const data = { ...props.parsedData };
    data.columns = cols.toString();
    props.onRealtimeChange(data);
    let total = 0;
    cols.forEach(c => total += c);
    if (total === 12) props.setErrors([]); else props.setErrors(["Columns must add up to 12"]);
  }

  const handleRemove = (idx: number) => {
    cols.splice(idx, 1);
    updateColumns();
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    let total = 0;
    cols.forEach(c => total += c);
    const newVal = (total >= 12) ? 1 : 12 - total;
    cols.push(newVal);
    updateColumns();
  }

  const handleColumnChange = (e: SelectChangeEvent<number>, idx: number) => {
    const val = parseInt(e.target.value.toString());
    cols[idx] = val;
    updateColumns();
  }

  const getCustomSizes = () => {
    let result: React.ReactElement[] = [];
    let idx = 0;
    let total = 0;
    cols.forEach(c => {
      total += c;
      const index = idx;
      result.push(<TableRow>
        <TableCell key={idx}>
          <Select name="width" fullWidth size="small" value={c} onChange={(e) => handleColumnChange(e, index)}>
            <MenuItem value="1">1 - 1/12th</MenuItem>
            <MenuItem value="2">2 - 1/6th</MenuItem>
            <MenuItem value="3">3 - 1/4th</MenuItem>
            <MenuItem value="4">4 - 1/3rd</MenuItem>
            <MenuItem value="5">5 - 5/12th</MenuItem>
            <MenuItem value="6">6 - half</MenuItem>
            <MenuItem value="7">7 - 7/12th</MenuItem>
            <MenuItem value="8">8 - 2/3rd</MenuItem>
            <MenuItem value="9">9 - 3/4th</MenuItem>
            <MenuItem value="10">10 - 5/6th</MenuItem>
            <MenuItem value="11">11 - 11/12th</MenuItem>
            <MenuItem value="12">12 - whole</MenuItem>
          </Select>
        </TableCell>
        <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); handleRemove(index); }}>Remove</a></TableCell>
      </TableRow>)
      idx++;
    });

    if (total === 12) result.push(<TableRow><TableCell colSpan={2}><div className="text-success">Total: 12/12</div></TableCell></TableRow>)
    else result.push(<TableRow><TableCell colSpan={2}><div className="text-danger">Total: {total}/12</div></TableCell></TableRow>);


    return (<>
      <div><b>Custom</b> - <small>Numbers represent twelfths of page.</small></div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Width</TableCell>
            <TableCell><a href="about:blank" onClick={handleAdd}>Add Column</a></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result}
        </TableBody>
      </Table><br /></>);
  }

  const getMobileSize = () => {
    if (!showMobileSizes) return <a href="about:blank" style={{marginTop:10, display:"block"}} onClick={(e) => {e.preventDefault(); setShowMobileSizes(true)}}>Show Mobile Sizes</a>
    else {
      return <>
        <a href="about:blank" style={{marginTop:10, display:"block"}} onClick={(e) => {e.preventDefault(); setShowMobileSizes(false)}}>Hide Mobile Sizes</a>
        <RowMobileSizes cols={cols} parsedData={props.parsedData} onRealtimeChange={props.onRealtimeChange} />
      </>
    }
  }

  const getMobileOrder = () => {
    if (!showMobileOrder) return <a href="about:blank" style={{marginTop:10, display:"block"}} onClick={(e) => {e.preventDefault(); setShowMobileOrder(true)}}>Show Mobile Order</a>
    else {
      return <>
        <a href="about:blank" style={{marginTop:10, display:"block"}} onClick={(e) => {e.preventDefault(); setShowMobileOrder(false)}}>Hide Mobile Order</a>
        <RowMobileOrder cols={cols} parsedData={props.parsedData} onRealtimeChange={props.onRealtimeChange} />
      </>
    }
  }

  let commonValue = props.parsedData?.columns || "custom";
  if (["6,6", "4,4,4", "3,3,3,3"].indexOf(commonValue) === -1) commonValue = "custom";
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Common Options</InputLabel>
        <Select name="columns" fullWidth label={"Common Options"} size="small" value={commonValue} onChange={handleChange}>
          <MenuItem value="6,6">Halves</MenuItem>
          <MenuItem value="4,4,4">Thirds</MenuItem>
          <MenuItem value="3,3,3,3">Quarters</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
      {(commonValue === "custom") && getCustomSizes()}
      <div><b>Preview</b> - <small>Numbers represent twelfths of page.</small></div>
      {getPreviewTable()}
      {getMobileSize()}
      {getMobileOrder()}

    </>
  );


}
