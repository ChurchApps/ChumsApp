import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Tab, 
  Tabs,
  Stack,
  Paper
} from "@mui/material";
import React from "react";
import { SelectGroup } from ".";
import { type GroupInterface, Locale, PersonHelper, type PersonInterface } from "@churchapps/apphelper";
import { PersonAdd } from "@churchapps/apphelper";
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Close as CloseIcon
} from "@mui/icons-material";

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
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ContentPicker: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState(0);
  const handlePersonAdd = (p: PersonInterface) => { props.onSelect("person", p.id, p.name.display) }
  const handleGroupAdd = (g: GroupInterface) => { props.onSelect("group", g.id, g.name) }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog 
      open={true} 
      onClose={props.onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2
      }}>
        {Locale.label("tasks.contentPicker.selPers")}
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              label={Locale.label("tasks.contentPicker.pers")} 
              icon={<PersonIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={Locale.label("tasks.contentPicker.group")} 
              icon={<GroupIcon />} 
              iconPosition="start"
            />
          </Tabs>
          <Box sx={{ p: 2, minHeight: 400 }}>
            <TabPanel value={value} index={0}>
              <PersonAdd 
                getPhotoUrl={PersonHelper.getPhotoUrl} 
                addFunction={handlePersonAdd} 
                actionLabel={Locale.label("tasks.contentPicker.sel")} 
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SelectGroup addFunction={handleGroupAdd} />
            </TabPanel>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          onClick={props.onClose}
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {Locale.label("common.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
