import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Stack,
  Icon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  type SelectChangeEvent
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper } from "@churchapps/apphelper";
import type { LinkInterface } from "@churchapps/helpers";

interface Props { currentTab: LinkInterface, updatedFunction?: () => void }

export const TabEdit: React.FC<Props> = (props) => {
  const [currentTab, setCurrentTab] = useState<LinkInterface>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await ApiHelper.delete("/links/" + currentTab.id, "ContentApi");
      setCurrentTab(null);
      props.updatedFunction();
    } catch {
      setErrors(["Failed to delete tab. Please try again."]);
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const t = { ...currentTab };
    switch (e.target.name) {
      case "text": t.text = val; break;
      case "type": t.linkType = val; break;
      case "url": t.url = val; break;
      case "icon": t.icon = val; break;
    }
    setCurrentTab(t);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const errors: string[] = [];

    if (!currentTab.text) errors.push("Please enter valid text");
    if (currentTab?.linkType === "url" && !currentTab.url) errors.push("Enter a valid URL");

    if (errors.length > 0) {
      setErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      if (currentTab.linkType !== "url") currentTab.url = "";
      await ApiHelper.post("/links", [currentTab], "ContentApi");
      props.updatedFunction();
    } catch {
      setErrors(["Failed to save tab. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrl = () => {
    if (currentTab?.linkType === "url") {
      return (
        <TextField
          fullWidth
          label="External URL"
          name="url"
          type="text"
          value={currentTab?.url || ""}
          onChange={handleChange}
          data-testid="tab-url-input"
          placeholder="https://example.com"
          size="small"
          sx={{ mt: 1 }}
        />
      );
    } else return null;
  };

  React.useEffect(() => { setCurrentTab(props.currentTab); }, [props.currentTab]);

  if (!currentTab) return <></>;

  return (
    <>
      <Dialog
        open={true}
        onClose={() => props.updatedFunction()}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '400px'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: "primary.main",
          color: "#FFF",
          p: 3
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon sx={{ fontSize: 24, color: '#FFF' }}>folder</Icon>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {currentTab?.id ? 'Edit Tab' : 'Create New Tab'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Configure streaming sidebar tab settings
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={() => props.updatedFunction()}
              sx={{ color: '#FFF' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />

          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Tab Display Section */}
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Icon sx={{ color: 'primary.main', fontSize: 18 }}>visibility</Icon>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Tab Display
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Tab Text"
                    name="text"
                    type="text"
                    value={currentTab?.text || ""}
                    onChange={handleChange}
                    placeholder="Enter tab display text"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Icon Name"
                    name="icon"
                    type="text"
                    value={currentTab?.icon || ""}
                    onChange={handleChange}
                    placeholder="e.g., link, chat, favorite"
                    size="small"
                    helperText="Enter a Material Icon name (e.g., link, chat, favorite)"
                    InputProps={{
                      endAdornment: currentTab?.icon && (
                        <Icon sx={{ color: 'primary.main' }}>{currentTab.icon}</Icon>
                      )
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Link Configuration Section */}
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Icon sx={{ color: 'primary.main', fontSize: 18 }}>settings</Icon>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Link Configuration
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="type">Link Type</InputLabel>
                    <Select
                      labelId="type"
                      label="Link Type"
                      name="type"
                      value={currentTab?.linkType || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="url">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon sx={{ fontSize: 18 }}>open_in_new</Icon>
                          <Typography>External URL</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="chat">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon sx={{ fontSize: 18 }}>chat</Icon>
                          <Typography>Chat</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="prayer">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Icon sx={{ fontSize: 18 }}>favorite</Icon>
                          <Typography>Prayer</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {getUrl()}

                  {/* Link Type Helper */}
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon sx={{ fontSize: 16, color: 'text.secondary' }}>info</Icon>
                      <Typography variant="caption" color="text.secondary">
                        {currentTab?.linkType === "url" && "External URL will open in a new tab"}
                        {currentTab?.linkType === "chat" && "Built-in chat functionality"}
                        {currentTab?.linkType === "prayer" && "Built-in prayer request feature"}
                        {!currentTab?.linkType && "Select a link type to configure the tab behavior"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            {currentTab?.id && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Delete
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              onClick={() => props.updatedFunction()}
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={isLoading ? null : <SaveIcon />}
              onClick={handleSave}
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100
              }}
            >
              {isLoading ? 'Saving...' : 'Save Tab'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Icon sx={{ color: 'error.main' }}>warning</Icon>
            <Typography variant="h6">Delete Tab</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this tab? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
