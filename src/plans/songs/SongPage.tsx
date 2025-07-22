import React, { memo, useCallback, useMemo } from "react";
import { ApiHelper, ArrayHelper } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";
import { useQuery } from "@tanstack/react-query";
import {
 Grid, Box, Card, CardContent, Typography, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Paper, Avatar, Chip, IconButton 
} from "@mui/material";
import {
  LibraryMusic as MusicIcon,
  Add as AddIcon,
  QueueMusic as ArrangementIcon,
  MusicNote as NoteIcon,
  Person as ArtistIcon,
  Album as AlbumIcon,
  Timer as TimerIcon,
  MusicOff as KeyIcon,
  Speed as BpmIcon,
  Edit as EditIcon,
  Language as LanguageIcon,
  DateRange as DateIcon,
  Schedule as TimeIcon,
} from "@mui/icons-material";
import { Arrangement } from "./components/Arrangement";
import { SongSearchDialog } from "./SongSearchDialog";
import { SongDetailsEdit } from "./components/SongDetailsEdit";
import { SongDetailLinks } from "./components/SongDetailLinks";
import { SongDetailLinksEdit } from "./components/SongDetailLinksEdit";

export const SongPage = memo(() => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [editSongDetails, setEditSongDetails] = React.useState(false);
  const [editLinks, setEditLinks] = React.useState(false);
  const [selectedArrangement, setSelectedArrangement] = React.useState(null);
  const params = useParams();

  const song = useQuery<SongInterface>({
    queryKey: ["/songs/" + params.id, "ContentApi"],
    enabled: !!params.id,
  });

  const arrangements = useQuery<ArrangementInterface[]>({
    queryKey: ["/arrangements/song/" + params.id, "ContentApi"],
    placeholderData: [],
    enabled: !!params.id,
  });

  const songDetailId = useMemo(() => {
    if (arrangements.data && arrangements.data.length > 0 && arrangements.data[0].songDetailId) {
      return arrangements.data[0].songDetailId;
    }
    return null;
  }, [arrangements.data]);

  const songDetail = useQuery<SongDetailInterface>({
    queryKey: ["/songDetails/" + songDetailId, "ContentApi"],
    enabled: !!songDetailId,
  });

  // Set selected arrangement when arrangements load
  React.useEffect(() => {
    if (arrangements.data && arrangements.data.length > 0 && !selectedArrangement) {
      setSelectedArrangement(arrangements.data[0]);
    }
  }, [arrangements.data, selectedArrangement]);

  const selectArrangement = useCallback((arrangementId: string) => {
      const arr = ArrayHelper.getOne(arrangements.data, "id", arrangementId);
      setSelectedArrangement(arr);
    }, [arrangements.data]);

  const refetch = useCallback(() => {
    song.refetch();
    arrangements.refetch();
    songDetail.refetch();
  }, [song, arrangements, songDetail]);

  const handleAdd = useCallback(async (songDetail: SongDetailInterface) => {
      if (!song.data?.id) return;
      const a: ArrangementInterface = {
        songId: song.data.id,
        songDetailId: songDetail.id,
        name: songDetail.artist,
        lyrics: "",
      };
      await ApiHelper.post("/arrangements", [a], "ContentApi");
      if (songDetail.keySignature) {
        const key: ArrangementKeyInterface = { arrangementId: a.id, keySignature: songDetail.keySignature, shortDescription: "Default" };
        await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
      }
      refetch();
      setShowSearch(false);
    }, [song.data?.id, refetch]);

  const arrangementNavigation = useMemo(() => (
      <Stack spacing={3}>
        <Card sx={{ height: "fit-content", borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <MusicIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                Arrangements
              </Typography>
            </Stack>

            <List sx={{ p: 0 }}>
              {arrangements.data.map((arrangement, index) => (
                <Box key={arrangement.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemButton
                      selected={selectedArrangement?.id === arrangement.id}
                      onClick={() => selectArrangement(arrangement.id)}
                      sx={{
                        borderRadius: 1,
                        "&.Mui-selected": {
                          backgroundColor: "primary.light",
                          "&:hover": { backgroundColor: "primary.light" },
                        },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArrangementIcon sx={{ color: selectedArrangement?.id === arrangement.id ? "primary.main" : "text.secondary" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={arrangement.name}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: selectedArrangement?.id === arrangement.id ? 600 : 400,
                            color: selectedArrangement?.id === arrangement.id ? "primary.main" : "text.primary",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < arrangements.data.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              ))}
            </List>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowSearch(true)}
              fullWidth
              sx={{
                mt: 2,
                borderStyle: "dashed",
                color: "text.secondary",
                borderColor: "grey.400",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  backgroundColor: "primary.light",
                },
              }}
            >
              Add Arrangement
            </Button>
          </CardContent>
        </Card>

        {/* External Links Card */}
        <Card sx={{ height: "fit-content", borderRadius: 2 }}>
          <CardContent>
            {songDetail.data && (
              editLinks ? (
                <SongDetailLinksEdit
                  songDetailId={songDetail.data.id}
                  reload={() => {
                    setEditLinks(false);
                    refetch();
                  }}
                />
              ) : (
                <SongDetailLinks
                  songDetail={songDetail.data}
                  onEdit={() => setEditLinks(true)}
                />
              )
            )}
          </CardContent>
        </Card>
      </Stack>
    ), [
arrangements.data,
selectedArrangement,
selectArrangement,
songDetail.data,
editLinks,
refetch
]);

  const currentContent = useMemo(() => {
    if (!selectedArrangement) {
      return (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <ArrangementIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Arrangement Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select an arrangement from the sidebar to get started.
          </Typography>
        </Paper>
      );
    }

    return <Arrangement arrangement={selectedArrangement} reload={refetch} />;
  }, [selectedArrangement, refetch]);

  const formatSeconds = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }, []);

  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Album Art, Title and Details */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
            {/* Album Art */}
            <Avatar
              src={songDetail.data?.thumbnail}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <MusicIcon sx={{ fontSize: 40, color: "#FFF" }} />
            </Avatar>

            {/* Song Info */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {songDetail.data?.title || song.data?.name || "Loading..."}
                </Typography>
                <IconButton
                  onClick={() => setEditSongDetails(true)}
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    "&:hover": {
                      color: "#FFF",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>

              {/* Song Stats - All Details */}
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1, gap: 1 }}>
                {songDetail.data?.artist && (
                  <Chip
                    icon={<ArtistIcon />}
                    label={songDetail.data.artist}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.album && (
                  <Chip
                    icon={<AlbumIcon />}
                    label={songDetail.data.album}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.releaseDate && (
                  <Chip
                    icon={<DateIcon />}
                    label={new Date(songDetail.data.releaseDate).toLocaleDateString()}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.language && (
                  <Chip
                    icon={<LanguageIcon />}
                    label={songDetail.data.language}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.seconds && (
                  <Chip
                    icon={<TimerIcon />}
                    label={formatSeconds(songDetail.data.seconds)}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.keySignature && (
                  <Chip
                    icon={<KeyIcon />}
                    label={`Key: ${songDetail.data.keySignature}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.tones && (
                  <Chip
                    icon={<NoteIcon />}
                    label={`Tones: ${songDetail.data.tones}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.meter && (
                  <Chip
                    icon={<TimeIcon />}
                    label={`Meter: ${songDetail.data.meter}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail.data?.bpm && (
                  <Chip
                    icon={<BpmIcon />}
                    label={`${songDetail.data.bpm} BPM`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Right side: Action Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowSearch(true)}
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Arrangement
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {editSongDetails ? (
          <SongDetailsEdit
            songDetail={songDetail.data}
            onCancel={() => setEditSongDetails(false)}
            onSave={() => {
              setEditSongDetails(false);
              refetch();
            }}
            reload={refetch}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>{arrangementNavigation}</Grid>

            <Grid size={{ xs: 12, md: 9 }}>{currentContent}</Grid>
          </Grid>
        )}
      </Box>

      {showSearch && <SongSearchDialog searchText={song.data?.name} onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
    </>
  );
});
