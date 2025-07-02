# CHUMS Application Style Guide

This document defines the design patterns, components, and styling conventions used throughout the CHUMS (CHUrch Management Software) application. All new features and pages should follow these established patterns to maintain visual consistency and code maintainability.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Header/Banner Patterns](#headerBanner-patterns)
5. [Layout Patterns](#layout-patterns)
6. [Component Library](#component-library)
7. [Navigation Patterns](#navigation-patterns)
8. [Data Display Patterns](#data-display-patterns)
9. [Responsive Design](#responsive-design)
10. [Implementation Examples](#implementation-examples)

## Design Principles

### Consistency
- Use established color variables and Material-UI theme tokens
- Follow consistent spacing and layout patterns
- Maintain uniform component styling across pages

### Accessibility
- Ensure proper color contrast ratios
- Use semantic HTML elements and ARIA labels
- Support keyboard navigation

### Performance
- Leverage Material-UI's optimization features
- Use CSS variables for theme consistency
- Minimize custom CSS when Material-UI components suffice

## Color System

### Primary Color Palette

```css
:root {
  --c1: #1565C0;     /* Primary blue */
  --c1l1: #3578CC;   /* Light blue 1 */
  --c1l2: #568BDA;   /* Light blue 2 (main header background) */
  --c1l3: #77A0E5;   /* Light blue 3 */
  --c1l4: #99B5F0;   /* Light blue 4 */
  --c1l5: #BBCBF8;   /* Light blue 5 */
  --c1l6: #DDE1FC;   /* Light blue 6 */
  --c1l7: #F0F4FF;   /* Light blue 7 */
  --c1d1: #1358AD;   /* Dark blue 1 */
  --c1d2: #114A99;   /* Dark blue 2 */
  --c1d3: #0E3D86;   /* Dark blue 3 */
  --c1d4: #0C3172;   /* Dark blue 4 */
  --c1d5: #09245F;   /* Dark blue 5 */
  --c1d6: #07184B;   /* Dark blue 6 */
  --c1d7: #050C37;   /* Dark blue 7 */
}
```

### Usage Guidelines

- **Headers**: `var(--c1l2)` for background
- **Text on Headers**: `#FFF` (white)
- **Primary Actions**: Material-UI `primary.main`
- **Secondary Text**: `rgba(255,255,255,0.9)` on dark backgrounds
- **Icon Backgrounds**: `rgba(255,255,255,0.2)` on headers

## Typography

### Hierarchy

```tsx
// Page Title (Header)
<Typography 
  variant="h4" 
  sx={{ 
    fontWeight: 600, 
    mb: 0.5,
    fontSize: { xs: '1.75rem', md: '2.125rem' }
  }}
/>

// Section Title
<Typography 
  variant="h6" 
  sx={{ 
    fontWeight: 600, 
    color: 'primary.main' 
  }}
/>

// Body Text
<Typography 
  variant="body1" 
  sx={{ 
    color: 'rgba(255,255,255,0.9)', // on dark backgrounds
    fontSize: { xs: '0.875rem', md: '1rem' }
  }}
/>

// Caption/Subtitle
<Typography 
  variant="caption" 
  sx={{ 
    color: 'rgba(255,255,255,0.7)',
    fontSize: { xs: '0.75rem', md: '0.875rem' }
  }}
/>
```

### Font Weights
- **400**: Normal text
- **500**: Medium emphasis
- **600**: Headings and important text

## Header/Banner Patterns

### Standard Page Header

```tsx
<Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
  <Stack 
    direction={{ xs: "column", md: "row" }} 
    spacing={{ xs: 2, md: 4 }} 
    alignItems={{ xs: "flex-start", md: "center" }} 
    sx={{ width: "100%" }}
  >
    {/* Left side: Title and Icon */}
    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
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
        <PageIcon sx={{ fontSize: 32, color: '#FFF' }} />
      </Box>
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            mb: 0.5,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Page Title
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Page description or subtitle
        </Typography>
      </Box>
    </Stack>
    
    {/* Right side: Action Buttons */}
    <Stack 
      direction="row" 
      spacing={1} 
      sx={{ 
        flexShrink: 0,
        justifyContent: { xs: "flex-start", md: "flex-end" },
        width: { xs: "100%", md: "auto" }
      }}
    >
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          color: '#FFF',
          borderColor: 'rgba(255,255,255,0.5)',
          '&:hover': {
            borderColor: '#FFF',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        Primary Action
      </Button>
    </Stack>
  </Stack>
</Box>
```

### Header with Tabs

```tsx
{/* Tab Buttons in Header */}
{tabs.map((tab, index) => (
  <Button
    key={tab.key}
    variant={selectedTab === index ? "contained" : "outlined"}
    startIcon={tab.icon}
    onClick={() => setSelectedTab(index)}
    sx={{
      color: selectedTab === index ? "var(--c1l2)" : "#FFF",
      backgroundColor: selectedTab === index ? "#FFF" : "transparent",
      borderColor: selectedTab === index ? "#FFF" : "rgba(255,255,255,0.5)",
      "&:hover": {
        borderColor: "#FFF",
        backgroundColor: selectedTab === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"
      }
    }}
  >
    {tab.label}
  </Button>
))}
```

## Layout Patterns

### Standard Page Layout

```tsx
<>
  {/* Header */}
  <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
    {/* Header content */}
  </Box>
  
  {/* Main Content */}
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 9 }}>
        {/* Main content area */}
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        {/* Sidebar content */}
      </Grid>
    </Grid>
  </Box>
</>
```

### Full-Width Layout (Notes, Tasks)

```tsx
<>
  {/* Header */}
  <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
    {/* Header content */}
  </Box>
  
  {/* Content */}
  <Box sx={{ p: 3 }}>
    {/* Full-width content */}
  </Box>
</>
```

## Component Library

### Cards

```tsx
// Standard Card
<Card sx={{ 
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'grey.200'
}}>
  <CardContent>
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Card Title
        </Typography>
      </Stack>
      {/* Action buttons */}
    </Stack>
    {/* Card content */}
  </CardContent>
</Card>

// Interactive Card (with hover)
<Card sx={{ 
  transition: 'all 0.2s ease-in-out',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: 2,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 3,
    borderColor: 'primary.main'
  }
}}>
```

### Buttons

```tsx
// Primary Action Button
<Button
  variant="contained"
  startIcon={<Icon />}
  sx={{ 
    textTransform: 'none',
    borderRadius: 2,
    fontWeight: 600
  }}
>
  Primary Action
</Button>

// Secondary Action Button
<Button
  variant="outlined"
  size="small"
  startIcon={<Icon />}
  sx={{ 
    textTransform: 'none',
    minWidth: 'auto' 
  }}
>
  Secondary Action
</Button>

// Header Button (on blue background)
<Button
  variant="outlined"
  startIcon={<Icon />}
  sx={{
    color: '#FFF',
    borderColor: 'rgba(255,255,255,0.5)',
    '&:hover': {
      borderColor: '#FFF',
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  }}
>
  Header Action
</Button>
```

### Status Chips

```tsx
// Success Status
<Chip 
  label="Active" 
  size="small" 
  sx={{ 
    backgroundColor: "#e8f5e9", 
    color: "#2e7d32",
    fontWeight: 600
  }} 
/>

// Warning Status
<Chip 
  label="Pending" 
  size="small" 
  sx={{ 
    backgroundColor: "#fff3e0", 
    color: "#f57c00",
    fontWeight: 600
  }} 
/>

// Info Chip
<Chip
  icon={<Icon />}
  label="Info"
  variant="outlined"
  size="small"
  sx={{ 
    color: 'text.secondary',
    borderColor: 'grey.400',
    fontSize: '0.75rem'
  }}
/>
```

## Navigation Patterns

### Search Sidebar

```tsx
<Grid size={{ xs: 12, md: 3 }}>
  <Card sx={{ 
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'grey.200'
  }}>
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <SearchIcon />
        <Typography variant="h6">Search</Typography>
      </Stack>
    </Box>
    <Box sx={{ p: 2 }}>
      {/* Search form content */}
    </Box>
  </Card>
</Grid>
```

### Menu Items

```tsx
<Menu
  PaperProps={{
    sx: {
      minWidth: 200,
      maxHeight: 300,
      mt: 1
    }
  }}
>
  <MenuItem
    sx={{
      py: 1.5,
      px: 2,
      "&:hover": { backgroundColor: "action.hover" }
    }}
  >
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText>Menu Item</ListItemText>
  </MenuItem>
</Menu>
```

## Data Display Patterns

### Table Styling

```tsx
<Table sx={{ minWidth: 650 }}>
  <TableHead 
    sx={{ 
      backgroundColor: 'grey.50',
      '& .MuiTableCell-root': {
        borderBottom: '2px solid',
        borderBottomColor: 'divider'
      }
    }}
  >
    <TableRow>
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Column Header
        </Typography>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow sx={{ 
      '&:hover': { backgroundColor: 'action.hover' },
      transition: 'background-color 0.2s ease'
    }}>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Empty States

```tsx
// Table Empty State
<TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
  <Stack spacing={2} alignItems="center">
    <Icon sx={{ fontSize: 48, color: 'text.secondary' }} />
    <Typography variant="body1" color="text.secondary">
      No data found. Get started by adding your first item.
    </Typography>
    <Button variant="contained" startIcon={<AddIcon />}>
      Add First Item
    </Button>
  </Stack>
</TableCell>

// Card Empty State
<Paper 
  sx={{ 
    p: 6, 
    textAlign: 'center', 
    backgroundColor: 'grey.50',
    border: '1px dashed',
    borderColor: 'grey.300'
  }}
>
  <Icon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
  <Typography variant="h6" color="text.secondary" gutterBottom>
    No Items Found
  </Typography>
  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
    Get started by adding your first item.
  </Typography>
  <Button
    variant="contained"
    color="primary"
    startIcon={<AddIcon />}
    size="large"
  >
    Add First Item
  </Button>
</Paper>
```

### Loading States

```tsx
import { Loading } from "@churchapps/apphelper";

// Standard loading
{!data ? <Loading /> : <DataComponent data={data} />}

// Small loading indicator
{!data ? <Loading size="sm" /> : <DataComponent data={data} />}
```

## Responsive Design

### Breakpoint Usage

- **xs**: Mobile (< 600px)
- **md**: Desktop (≥ 900px)
- **Common Pattern**: `{ xs: mobileValue, md: desktopValue }`

### Typography Responsive Scaling

```tsx
// Page titles
fontSize: { xs: '1.75rem', md: '2.125rem' }

// Body text
fontSize: { xs: '0.875rem', md: '1rem' }

// Caption text
fontSize: { xs: '0.75rem', md: '0.875rem' }
```

### Layout Responsive Patterns

```tsx
// Stack direction
direction={{ xs: "column", md: "row" }}

// Spacing
spacing={{ xs: 2, md: 4 }}

// Alignment
alignItems={{ xs: "flex-start", md: "center" }}

// Grid sizing
size={{ xs: 12, md: 9 }} // Main content
size={{ xs: 12, md: 3 }} // Sidebar
```

## Implementation Examples

### Complete Page Example

```tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { Add as AddIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

export const ExamplePage = () => {
  return (
    <>
      {/* Standard Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={{ xs: 2, md: 4 }} 
          alignItems={{ xs: "flex-start", md: "center" }} 
          sx={{ width: "100%" }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
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
              <DashboardIcon sx={{ fontSize: 32, color: '#FFF' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                Page Title
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Page description
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                color: '#FFF',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: '#FFF',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Card sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <CardContent>
                {/* Main content */}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            {/* Sidebar */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
```

---

## Style Guide Maintenance

### Adding New Patterns
1. Document new patterns in this guide
2. Include code examples
3. Test across all supported browsers
4. Update related components to maintain consistency

### Breaking Changes
- Major style updates should be versioned
- Provide migration guides for existing components
- Maintain backward compatibility when possible

### Contributing
- Follow established patterns before creating new ones
- Test responsive behavior across all breakpoints
- Ensure accessibility compliance
- Update this guide with any new patterns or changes

---

*This style guide is a living document that should be updated as the CHUMS application evolves. All contributors should reference this guide when implementing new features or modifying existing components.*