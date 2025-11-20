import { Dialog } from "@mui/material";
import { DisplayBox, Locale } from "@churchapps/apphelper";

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog(props: HelpDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DisplayBox id="dialogForm" headerIcon="help" headerText={Locale.label("common.help")}>
        <p>Use the plus icon in the corner to add new sections and elements to a page.  All elements must go within a section.</p>
        <p>Doubleclick any section or element to edit or remove it.</p>
        <p>Click and drag and section or element to rearrange content.</p>
      </DisplayBox>
    </Dialog>
  );
}
