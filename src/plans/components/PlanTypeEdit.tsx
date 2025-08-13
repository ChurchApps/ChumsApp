import React from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, InputBox, Locale } from "@churchapps/apphelper";
import { type PlanTypeInterface } from "../../helpers";

interface Props {
  planType: PlanTypeInterface | null;
  onClose: () => void;
}

export const PlanTypeEdit: React.FC<Props> = ({ planType, onClose }) => {
  const [current, setCurrent] = React.useState<PlanTypeInterface>({ ...planType } || {});
  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    setErrors([]);

    try {
      const isNew = !current.id;
      const result = isNew 
        ? await ApiHelper.post("/planTypes", [current], "DoingApi")
        : await ApiHelper.post("/planTypes", [current], "DoingApi");
      
      onClose();
    } catch (error: any) {
      setErrors([error.message || "An error occurred while saving"]);
    }
    
    setLoading(false);
  };

  const handleChange = (field: keyof PlanTypeInterface, value: string) => {
    setCurrent(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: string[] = [];
    if (!current.name?.trim()) newErrors.push("Plan type name is required");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  React.useEffect(() => {
    if (current.name) validate();
  }, [current.name]);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{current.id ? "Edit" : "Add"} Plan Type</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <ErrorMessages errors={errors} />
          
          <InputBox
            headerIcon="assignment"
            headerText="Plan Type Details">
            <TextField
              fullWidth
              label="Plan Type Name"
              value={current.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              margin="normal"
            />
          </InputBox>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading || !current.name?.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};