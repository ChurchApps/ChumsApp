import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Icon,
  Box,
  Typography,
  IconButton,
  Stack,
  Pagination
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { IconNamesList } from "./IconNamesList";

interface Props {
  currentIcon?: string;
  onUpdate: (icon: string) => void;
  onClose: () => void;
}

const defaultIcons = [
  "person",
  "group",
  "groups",
  "contact_mail",
  "mail",
  "church",
  "favorite",
  "chat",
  "link",
  "home",
  "settings",
  "calendar_today",
  "event",
  "video_library",
  "music_note",
  "school",
  "volunteer_activism",
  "prayer",
  "celebration",
  "campaign",
  "handshake",
  "auto_stories",
  "local_library",
  "menu_book",
  "article",
  "forum",
  "question_answer"
];

const ICONS_PER_PAGE = 45;

export const IconPicker: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const handleIconClick = (icon: string) => {
    props.onUpdate(icon);
    props.onClose();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase());
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filter icons based on search
  const filteredIcons = searchText
    ? IconNamesList.filter((icon) => icon.includes(searchText))
    : defaultIcons;

  // Paginate icons
  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
  const startIndex = (page - 1) * ICONS_PER_PAGE;
  const paginatedIcons = filteredIcons.slice(startIndex, startIndex + ICONS_PER_PAGE);

  return (
    <Dialog
      open={true}
      onClose={props.onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: "#1976d2",
        color: "#FFF",
        p: 2
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ fontSize: 20, color: '#FFF' }}>
                {props.currentIcon || 'insert_emoticon'}
              </Icon>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Select Icon
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={props.onClose}
            sx={{ color: '#FFF' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 3, marginTop:2 }}>
        <Stack spacing={2}>
          {/* Search Field */}
          <TextField
            fullWidth
            label="Search Icons"
            placeholder="Type to search (e.g., person, home, church)..."
            value={searchText}
            onChange={handleSearchChange}
            size="small"
            autoFocus
          />

          {/* Icon Grid */}
          <Box sx={{ minHeight: '300px' }}>
            {paginatedIcons.length > 0 ? (
              <Grid container spacing={0.75}>
                {paginatedIcons.map((iconName) => (
                  <Grid size={{ xs: 3, sm: 2, md: 1.5 }} key={iconName}>
                    <Box
                      onClick={() => handleIconClick(iconName)}
                      sx={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.25,
                        border: '1px solid',
                        borderColor: props.currentIcon === iconName ? '#1976d2' : 'grey.300',
                        backgroundColor: props.currentIcon === iconName ? 'rgba(25, 118, 210, 0.08)' : '#fff',
                        borderRadius: 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        py: 0.5,
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Icon sx={{ fontSize: 22, color: '#1976d2' }}>{iconName}</Icon>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.6rem',
                          color: 'text.secondary',
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          px: 0.25,
                          lineHeight: 1.1,
                          maxHeight: '2.2em',
                          overflow: 'hidden'
                        }}
                      >
                        {iconName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '300px',
                  gap: 1.5
                }}
              >
                <Icon sx={{ fontSize: 40, color: 'text.secondary' }}>search_off</Icon>
                <Typography variant="body2" color="text.secondary">
                  No icons found matching "{searchText}"
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Try a different search term
                </Typography>
              </Box>
            )}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {/* Helper Text */}
          <Box sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Icon sx={{ fontSize: 14, color: 'text.secondary' }}>info</Icon>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {searchText
                  ? `Showing ${filteredIcons.length} icons matching "${searchText}"`
                  : `Showing ${defaultIcons.length} commonly used icons. Use search to find more.`
                }
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
