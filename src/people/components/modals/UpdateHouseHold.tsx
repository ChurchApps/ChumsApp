import React from "react";
import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

interface Props {
  show: boolean;
  onHide: () => void;
  handleNo: () => void;
  handleYes: () => void;
  text: string;
}

export const UpdateHouseHold: React.FC<Props> = (props) => (
  <Dialog open={props.show} aria-labelledby="contained-modal-title-vcenter" data-cy="update-household-modal">
    <DialogTitle>Update Address</DialogTitle>
    <DialogContent>
      <p>{props.text}</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleNo} data-cy="no-button">No</Button>
      <Button onClick={props.handleYes} data-cy="yes-button">Yes</Button>
    </DialogActions>
  </Dialog>
);
