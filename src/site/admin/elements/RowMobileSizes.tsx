import { MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React from "react";

type Props = {
  cols: number[]
  parsedData: any;
  onRealtimeChange: (parsedData: any) => void;
};

export function RowMobileSizes(props: Props) {
  const mobileSizes: number[] = [];
  props.parsedData.columns?.split(",").forEach((c: string) => mobileSizes.push(parseInt(c)));
  props.parsedData.mobileSizes?.split(",").forEach((c: string, idx:number) => mobileSizes[idx] = parseInt(c));

  const updateMobileSizes = () => {
    const data = { ...props.parsedData };
    data.mobileSizes = mobileSizes.toString();
    props.onRealtimeChange(data);
  };

  const handleColumnChange = (e: SelectChangeEvent<number>, idx: number) => {
    const val = parseInt(e.target.value.toString());
    mobileSizes[idx] = val;
    updateMobileSizes();
  };

  const getCustomSizes = () => {
    const result: React.ReactElement[] = [];
    props.cols.forEach((c:number, idx:number) => {
      const index = idx;
      const mobileSize = (mobileSizes.length > idx) ? mobileSizes[idx] || c : c;
      result.push(<TableRow key={idx}>
        <TableCell>{c}</TableCell>
        <TableCell>
          <Select name="width" fullWidth size="small" value={mobileSize} onChange={(e) => handleColumnChange(e, index)} data-testid={`mobile-width-select-${index}`} aria-label={`Select mobile width for column ${index + 1}`}>
            <MenuItem value="1" data-testid="mobile-width-1" aria-label="1/12th width">1 - 1/12th</MenuItem>
            <MenuItem value="2" data-testid="mobile-width-2" aria-label="1/6th width">2 - 1/6th</MenuItem>
            <MenuItem value="3" data-testid="mobile-width-3" aria-label="1/4th width">3 - 1/4th</MenuItem>
            <MenuItem value="4" data-testid="mobile-width-4" aria-label="1/3rd width">4 - 1/3rd</MenuItem>
            <MenuItem value="5" data-testid="mobile-width-5" aria-label="5/12th width">5 - 5/12th</MenuItem>
            <MenuItem value="6" data-testid="mobile-width-6" aria-label="Half width">6 - half</MenuItem>
            <MenuItem value="7" data-testid="mobile-width-7" aria-label="7/12th width">7 - 7/12th</MenuItem>
            <MenuItem value="8" data-testid="mobile-width-8" aria-label="2/3rd width">8 - 2/3rd</MenuItem>
            <MenuItem value="9" data-testid="mobile-width-9" aria-label="3/4th width">9 - 3/4th</MenuItem>
            <MenuItem value="10" data-testid="mobile-width-10" aria-label="5/6th width">10 - 5/6th</MenuItem>
            <MenuItem value="11" data-testid="mobile-width-11" aria-label="11/12th width">11 - 11/12th</MenuItem>
            <MenuItem value="12" data-testid="mobile-width-12" aria-label="Full width">12 - whole</MenuItem>
          </Select>
        </TableCell>
      </TableRow>);
    });

    return (<>
      <div style={{ marginTop: 10 }}><b>Customize Mobile Layout</b></div>
      <p><i>Mobile widths do not need to add up to 12.  Values that add up to 24 will span two rows.</i></p>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Desktop Width</TableCell>
            <TableCell>Mobile Width</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result}
        </TableBody>
      </Table><br /></>);
  };

  return (
    <>
      {getCustomSizes()}
    </>
  );


}
