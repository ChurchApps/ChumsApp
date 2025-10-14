import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  Card,
  CardContent
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  CalendarMonth as CalendarIcon,
  Title as TitleIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { InputBox } from "@churchapps/apphelper";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper } from "@churchapps/apphelper";
import { DateHelper } from "@churchapps/apphelper";
import { UniqueIdHelper } from "@churchapps/apphelper";
import { UserHelper } from "@churchapps/apphelper";
import { Permissions } from "@churchapps/helpers";
import type { PlaylistInterface } from "@churchapps/helpers";

interface Props {
  currentPlaylist: PlaylistInterface,
  updatedFunction?: () => void,
  showPhotoEditor: (photoType: string, url: string) => void,
  updatedPhoto: string
}

export const PlaylistEdit: React.FC<Props> = (props) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = React.useState<PlaylistInterface>(null);

  const checkDelete = () => { if (!UniqueIdHelper.isMissing(currentPlaylist?.id)) return handleDelete; else return null; };
  const handleCancel = () => { props.updatedFunction(); };

  const handleDelete = () => {
    const errors = [];
    if (!UserHelper.checkAccess(Permissions.contentApi.streamingServices.edit)) errors.push("Unauthorized to delete playlists");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    if (window.confirm("Are you sure you wish to delete this playlist?")) {
      ApiHelper.delete("/playlists/" + currentPlaylist.id, "ContentApi").then(() => { setCurrentPlaylist(null); props.updatedFunction(); });
    }
  };

  const handlePhotoUpdated = () => {
    if (props.updatedPhoto !== null && props.updatedPhoto !== currentPlaylist?.thumbnail) {
      const p = { ...currentPlaylist };
      p.thumbnail = props.updatedPhoto;
      props.showPhotoEditor("", null);
      setCurrentPlaylist(p);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    const v = { ...currentPlaylist };
    switch (e.target.name) {
      case "title": v.title = val; break;
      case "description": v.description = val; break;
      case "publishDate": v.publishDate = DateHelper.toDate(val); break;
    }
    setCurrentPlaylist(v);
  };

  const handleSave = () => {
    const errors = [];
    if (!UserHelper.checkAccess(Permissions.contentApi.streamingServices.edit)) errors.push("Unauthorized to create playlists");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    ApiHelper.post("/playlists", [currentPlaylist], "ContentApi").then(props.updatedFunction);
  };

  React.useEffect(() => { setCurrentPlaylist(props.currentPlaylist); }, [props.currentPlaylist]);
  React.useEffect(handlePhotoUpdated, [props.updatedPhoto, currentPlaylist]); //eslint-disable-line

  return (
    <>
      <InputBox
        headerIcon="calendar_month"
        headerText={UniqueIdHelper.isMissing(currentPlaylist?.id) ? "Create New Playlist" : "Edit Playlist"}
        saveFunction={handleSave}
        cancelFunction={handleCancel}
        deleteFunction={checkDelete()}
        data-testid="edit-playlist-inputbox"
      >
        <ErrorMessages errors={errors} />

        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid size={12}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TitleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Basic Information
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Playlist Title"
                  name="title"
                  value={currentPlaylist?.title || ""}
                  onChange={handleChange}
                  data-testid="playlist-title-input"
                  variant="outlined"
                  placeholder="Enter playlist title..."
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={currentPlaylist?.description || ""}
                  onChange={handleChange}
                  data-testid="playlist-description-input"
                  variant="outlined"
                  placeholder="Describe this playlist..."
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ color: 'text.secondary', mr: 1, mt: 1 }} />
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Publishing & Schedule Section */}
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Publishing & Schedule
              </Typography>
            </Stack>

            <TextField
              fullWidth
              type="date"
              label="Publish Date"
              name="publishDate"
              value={(currentPlaylist?.publishDate) ? DateHelper.formatHtml5Date(DateHelper.toDate(currentPlaylist?.publishDate)) : ""}
              onChange={handleChange}
              data-testid="playlist-publish-date-input"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              helperText="When should this playlist be available to viewers?"
            />
          </Grid>

          {/* Thumbnail Section */}
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PhotoCameraIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Thumbnail Image
              </Typography>
            </Stack>

            <Card
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 200,
                      backgroundColor: 'grey.50',
                      borderRadius: 1,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={currentPlaylist?.thumbnail || "/images/no-image.png"}
                      alt="Playlist thumbnail"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      props.showPhotoEditor("playlist", currentPlaylist?.thumbnail || "");
                    }}
                    sx={{
                      textTransform: 'none',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    {currentPlaylist?.thumbnail ? 'Change Thumbnail' : 'Add Thumbnail'}
                  </Button>

                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Recommended size: 1280x720 pixels (16:9 aspect ratio)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </InputBox>
    </>
  );
};
