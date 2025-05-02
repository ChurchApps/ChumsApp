import React from "react";
import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useAppTranslation } from "../../../contexts/TranslationContext";

interface Props {
  show: boolean;
  onHide: () => void;
  handleNo: () => void;
  handleYes: () => void;
  text: string;
}

export const UpdateHouseHold: React.FC<Props> = (props) => {
  const { t } = useAppTranslation();

  return (
    <Dialog open={props.show} onClose={props.onHide}>
      <DialogTitle>{t("people.updateHouseHold.update")}</DialogTitle>
      <DialogContent>
        <p>{props.text}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleNo} color="primary">No</Button>
        <Button onClick={props.handleYes} color="primary">Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
