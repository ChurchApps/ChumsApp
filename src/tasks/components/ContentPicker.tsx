import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import React from "react";
import { SelectGroup } from ".";
import { GroupInterface, PersonHelper, PersonInterface } from "@churchapps/apphelper";
import { PersonAdd } from "@churchapps/apphelper";
import { useAppTranslation } from "../../contexts/TranslationContext";

interface Props {
  onClose: () => void,
  onSelect: (contentType: string, contentId: string, label: string) => void
}

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`contentPickerPanel-${index}`}>
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ContentPicker: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState(0);
  const { t } = useAppTranslation();
  const handlePersonAdd = (p: PersonInterface) => { props.onSelect("person", p.id, p.name.display) }
  const handleGroupAdd = (g: GroupInterface) => { props.onSelect("group", g.id, g.name) }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (<>
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>{t("tasks.contentPicker.selPers")}</DialogTitle>
      <DialogContent>

        <Tabs value={value} onChange={handleChange} style={{ minWidth: 400 }}>
          <Tab label={t("tasks.contentPicker.pers")} />
          <Tab label={t("tasks.contentPicker.group")} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} actionLabel={t("tasks.contentPicker.sel")} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SelectGroup addFunction={handleGroupAdd} />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={props.onClose}>{t("common.close")}</Button>
      </DialogActions>
    </Dialog>
  </>);
};
