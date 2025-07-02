import React, { useEffect, memo, useMemo, useCallback } from "react";
import { ApiHelper, Loading, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link, Navigate } from "react-router-dom";
import { 
  Button, 
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  MusicNote as MusicIcon,
  LibraryMusic as LibraryIcon,
  Add as AddIcon,
  Search as SearchIcon,
  PlayCircle as PlayIcon,
  Timer as TimerIcon,
  Person as ArtistIcon
} from "@mui/icons-material";
import { SongSearchDialog } from "./SongSearchDialog";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";

export const SongsPage = memo(() => {
  const [songs, setSongs] = React.useState<SongDetailInterface[]>(null)
  const [showSearch, setShowSearch] = React.useState(false)
  const [redirect, setRedirect] = React.useState("")
  const [searchFilter, setSearchFilter] = React.useState("")

  const loadData = useCallback(async () => {
    ApiHelper.get("/songDetails", "ContentApi").then(data => setSongs(data));
  }, [])

  const handleAdd = useCallback(async (songDetail: SongDetailInterface) => {
    let selectedSong = null;
    if (!songDetail.id) {
      songDetail = await ApiHelper.post("/songDetails/create", songDetail, "ContentApi")
    }

    const existing = await ApiHelper.get("/arrangements/songDetail/" + songDetail.id, "ContentApi");
    if (existing.length > 0) {
      const song = await ApiHelper.get("/songs/" + existing[0].songId, "ContentApi");
      selectedSong = song;
    } else {
      const s: SongInterface = { name: songDetail.title, dateAdded: new Date() };
      const songs = await ApiHelper.post("/songs", [s], "ContentApi");
      const a: ArrangementInterface = { songId: songs[0].id, songDetailId: songDetail.id, name: "(Default)", lyrics: "" };
      const arrangements = await ApiHelper.post("/arrangements", [a], "ContentApi");
      if (songDetail.keySignature) {
        const key: ArrangementKeyInterface = { arrangementId: arrangements[0].id, keySignature: songDetail.keySignature, shortDescription: "Default" };
        await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
      }
      selectedSong = songs[0];
    }

    loadData();
    setShowSearch(false);
    setRedirect("/plans/songs/" + selectedSong.id);
  }, [loadData])

  useEffect(() => { loadData() }, [loadData])

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = "none";
  }, []);

  const formatSeconds = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }, []);

  const filteredSongs = useMemo(() => {
    if (!songs) return null;
    if (!searchFilter.trim()) return songs;
    
    const filter = searchFilter.toLowerCase();
    return songs.filter(song => 
      song.title?.toLowerCase().includes(filter) ||
      song.artist?.toLowerCase().includes(filter)
    );
  }, [songs, searchFilter]);

  const songsContent = useMemo(() => {
    if (!songs) return <Loading size="sm" />;

    if (songs.length === 0) {
      return (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <LibraryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {Locale.label("songs.library.empty.title") || "No Songs Found"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {Locale.label("songs.library.empty.message") || "Get started by adding your first song to the library."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowSearch(true)}
            size="large"
          >
            {Locale.label("songs.library.empty.action") || "Add First Song"}
          </Button>
        </Paper>
      );
    }

    if (filteredSongs && filteredSongs.length === 0) {
      return (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <SearchIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {Locale.label("songs.library.noResults") || "No songs match your search criteria."}
          </Typography>
        </Paper>
      );
    }

    return (
      <Box sx={{
        '& .MuiCard-root': {
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200'
        }
      }}>
        <Stack spacing={2}>
          {filteredSongs?.map((songDetail) => (
            <Card 
              key={songDetail.id} 
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ pb: '16px !important' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Thumbnail/Avatar */}
                  <Avatar
                    src={songDetail.thumbnail}
                    sx={{ 
                      width: 60, 
                      height: 60,
                      bgcolor: 'primary.light'
                    }}
                    onError={handleImageError}
                  >
                    <MusicIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                  </Avatar>
                  
                  {/* Song Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      component={Link}
                      to={`/plans/songs/${(songDetail as any).songId}`}
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        '&:hover': {
                          textDecoration: 'underline'
                        },
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      {songDetail.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                      {songDetail.artist && (
                        <Chip
                          icon={<ArtistIcon />}
                          label={songDetail.artist}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            borderColor: 'grey.400',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                      
                      {songDetail.seconds && (
                        <Chip
                          icon={<TimerIcon />}
                          label={formatSeconds(songDetail.seconds)}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            borderColor: 'grey.400',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  {/* Action Button */}
                  <IconButton
                    component={Link}
                    to={`/plans/songs/${(songDetail as any).songId}`}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.dark'
                      }
                    }}
                    aria-label={`Play ${songDetail.title}`}
                  >
                    <PlayIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [songs, filteredSongs, formatSeconds, handleImageError]);

  if (redirect) return <Navigate to={redirect} />
  
  return (
    <>
      <Banner>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#FFF' }}>
            {Locale.label("songs.title") || "Songs"}
          </Typography>
          <Button 
            onClick={() => setShowSearch(true)} 
            variant="contained" 
            color="success" 
            startIcon={<AddIcon />}
            data-testid="add-song-button" 
            aria-label="Add song"
            sx={{ 
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'success.dark'
              }
            }}
          >
            {Locale.label("songs.addSong") || "Add Song"}
          </Button>
        </Stack>
      </Banner>
      
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <LibraryIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {Locale.label("songs.library.title") || "Song Library"}
          </Typography>
        </Stack>
        
        {songs && songs.length > 0 && (
          <TextField
            fullWidth
            variant="outlined"
            placeholder={Locale.label("songs.search.placeholder") || "Search songs by title or artist..."}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        )}
        
        {songsContent}
      </Box>
      
      {showSearch && (
        <SongSearchDialog 
          onClose={() => setShowSearch(false)} 
          onSelect={handleAdd} 
        />
      )}
    </>
  );
});

