import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from "@mui/material";
import React from "react";
import { PersonHelper, PersonInterface } from ".";
import { PersonAdd } from "../../appBase/components";

interface Props {
  onClose: () => void
  onSelect: (contentType: string, contentId: string, label: string) => void
}

export const ContentPicker: React.FC<Props> = (props) => {


  const handlePersonAdd = (p: PersonInterface) => {
    props.onSelect("person", p.id, p.name.display)
  }


  return (<>
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Select a Person</DialogTitle>
      <DialogContent>
        <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} actionLabel="Select" />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  </>);
};
