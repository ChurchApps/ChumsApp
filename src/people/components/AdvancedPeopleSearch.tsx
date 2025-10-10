import React, { memo, useCallback, useState, useMemo, useEffect, useRef } from "react";
import { ChumsPersonHelper } from ".";
import { type GroupMemberInterface, type SearchCondition, type GroupInterface, type CampusInterface, type ServiceInterface, type ServiceTimeInterface } from "@churchapps/helpers";
import { ArrayHelper, InputBox, ApiHelper, Locale, DateHelper, Permissions } from "@churchapps/apphelper";
import { type PersonInterface, type FundDonationInterface, type FundInterface } from "@churchapps/helpers";
import {
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  alpha,
  type SelectChangeEvent,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  TextFields as TextFieldsIcon,
  Numbers as NumbersIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as AttendanceIcon,
} from "@mui/icons-material";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void;
  toggleFunction?: () => void;
  updatedFunction?: () => void;
  embedded?: boolean;
}

interface FilterField {
  key: string;
  label: string;
  type: "text" | "select" | "number" | "date" | "complex";
  operators?: string[];
  options?: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
}

interface ActiveFilter {
  field: string;
  operator: string;
  value: string;
}

interface ComplexFilterConfig {
  type: "donation" | "attendance";
  operator: string;
  entityValue: string;
  entityText: string;
  fromDate: string;
  toDate: string;
}

export const AdvancedPeopleSearch = memo(function AdvancedPeopleSearch(props: Props) {
  const [activeFilters, setActiveFilters] = useState<Record<string, ActiveFilter>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["names", "demographics"]);
  const [complexFilterDialog, setComplexFilterDialog] = useState<{ open: boolean; field: string | null }>({ open: false, field: null });
  const [complexConfig, setComplexConfig] = useState<ComplexFilterConfig | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Lazy-loaded options
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [funds, setFunds] = useState<FundInterface[]>([]);
  const [campuses, setCampuses] = useState<CampusInterface[]>([]);
  const [services, setServices] = useState<ServiceInterface[]>([]);
  const [serviceTimes, setServiceTimes] = useState<ServiceTimeInterface[]>([]);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);

  const getFieldIcon = (type: string, key: string) => {
    if (key.includes("email")) return <EmailIcon sx={{ fontSize: 18 }} />;
    if (key.includes("phone")) return <PhoneIcon sx={{ fontSize: 18 }} />;
    if (key.includes("address") || key.includes("city") || key.includes("state") || key.includes("zip")) return <HomeIcon sx={{ fontSize: 18 }} />;
    if (key.includes("birth") || key.includes("anniversary")) return <CakeIcon sx={{ fontSize: 18 }} />;
    if (key.includes("Name") || key === "prefix" || key === "suffix") return <PersonIcon sx={{ fontSize: 18 }} />;
    if (key.includes("group")) return <GroupIcon sx={{ fontSize: 18 }} />;
    if (key.includes("Donation")) return <MoneyIcon sx={{ fontSize: 18 }} />;
    if (key.includes("Attendance")) return <AttendanceIcon sx={{ fontSize: 18 }} />;

    switch (type) {
      case "text": return <TextFieldsIcon sx={{ fontSize: 18 }} />;
      case "number": return <NumbersIcon sx={{ fontSize: 18 }} />;
      case "date": return <CalendarIcon sx={{ fontSize: 18 }} />;
      case "select": return <CheckCircleIcon sx={{ fontSize: 18 }} />;
      case "complex": return <SettingsIcon sx={{ fontSize: 18 }} />;
      default: return <TextFieldsIcon sx={{ fontSize: 18 }} />;
    }
  };

  const filterCategories = useMemo(() => {
    const categories: Record<string, FilterField[]> = {
      names: [
        { key: "displayName", label: Locale.label("person.displayName"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "firstName", label: Locale.label("person.firstName"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "lastName", label: Locale.label("person.lastName"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "middleName", label: Locale.label("person.middleName"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "nickName", label: Locale.label("person.nickName"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "prefix", label: Locale.label("person.prefix"), type: "text", operators: ["equals", "contains"] },
        { key: "suffix", label: Locale.label("person.suffix"), type: "text", operators: ["equals", "contains"] },
      ],
      demographics: [
        {
          key: "gender",
          label: Locale.label("person.gender"),
          type: "select",
          operators: ["equals", "notEquals"],
          options: [
            { value: "Unspecified", label: Locale.label("person.unspecified") },
            { value: "Male", label: Locale.label("person.male") },
            { value: "Female", label: Locale.label("person.female") },
          ],
        },
        { key: "age", label: Locale.label("person.age"), type: "number", operators: ["equals", "greaterThan", "greaterThanEqual", "lessThan", "lessThanEqual"] },
        { key: "birthDate", label: Locale.label("person.birthDate"), type: "date", operators: ["equals", "greaterThan", "lessThan"] },
        {
          key: "birthMonth",
          label: Locale.label("people.editCondition.bMonth"),
          type: "select",
          operators: ["equals"],
          options: [
            { value: "1", label: Locale.label("month.jan") },
            { value: "2", label: Locale.label("month.feb") },
            { value: "3", label: Locale.label("month.mar") },
            { value: "4", label: Locale.label("month.apr") },
            { value: "5", label: Locale.label("month.may") },
            { value: "6", label: Locale.label("month.june") },
            { value: "7", label: Locale.label("month.july") },
            { value: "8", label: Locale.label("month.aug") },
            { value: "9", label: Locale.label("month.sep") },
            { value: "10", label: Locale.label("month.oct") },
            { value: "11", label: Locale.label("month.nov") },
            { value: "12", label: Locale.label("month.dec") },
          ],
        },
        {
          key: "maritalStatus",
          label: Locale.label("person.maritalStatus"),
          type: "select",
          operators: ["equals", "notEquals"],
          options: [
            { value: "Unknown", label: Locale.label("person.unknown") },
            { value: "Single", label: Locale.label("person.single") },
            { value: "Married", label: Locale.label("person.married") },
            { value: "Divorced", label: Locale.label("person.divorced") },
            { value: "Widowed", label: Locale.label("person.widowed") },
          ],
        },
        { key: "anniversary", label: Locale.label("person.anniversary"), type: "date", operators: ["equals", "greaterThan", "lessThan"] },
        {
          key: "anniversaryMonth",
          label: Locale.label("people.editCondition.anniMonth"),
          type: "select",
          operators: ["equals"],
          options: [
            { value: "1", label: Locale.label("month.jan") },
            { value: "2", label: Locale.label("month.feb") },
            { value: "3", label: Locale.label("month.mar") },
            { value: "4", label: Locale.label("month.apr") },
            { value: "5", label: Locale.label("month.may") },
            { value: "6", label: Locale.label("month.june") },
            { value: "7", label: Locale.label("month.july") },
            { value: "8", label: Locale.label("month.aug") },
            { value: "9", label: Locale.label("month.sep") },
            { value: "10", label: Locale.label("month.oct") },
            { value: "11", label: Locale.label("month.nov") },
            { value: "12", label: Locale.label("month.dec") },
          ],
        },
        { key: "yearsMarried", label: Locale.label("people.editCondition.marYears"), type: "number", operators: ["equals", "greaterThan", "greaterThanEqual", "lessThan", "lessThanEqual"] },
      ],
      contact: [
        { key: "email", label: Locale.label("person.email"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "phone", label: Locale.label("person.phone"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "address", label: Locale.label("person.address"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "city", label: Locale.label("person.city"), type: "text", operators: ["equals", "contains", "startsWith", "endsWith"] },
        { key: "state", label: Locale.label("person.state"), type: "text", operators: ["equals", "contains"] },
        { key: "zip", label: Locale.label("person.zip"), type: "text", operators: ["equals", "contains", "startsWith"] },
      ],
      membership: [
        {
          key: "membershipStatus",
          label: Locale.label("person.membershipStatus"),
          type: "select",
          operators: ["equals", "notEquals"],
          options: [
            { value: "Visitor", label: Locale.label("person.visitor") },
            { value: "Regular Attendee", label: Locale.label("person.regularAttendee") },
            { value: "Member", label: Locale.label("person.member") },
            { value: "Staff", label: Locale.label("person.staff") },
            { value: "Inactive", label: Locale.label("person.inactive") },
          ],
        },
      ],
      activity: [],
    };

    // Add group membership if permissions allow
    if (Permissions.membershipApi.groupMembers) {
      categories.membership.push({
        key: "groupMember",
        label: Locale.label("people.editCondition.groupMem"),
        type: "select",
        operators: ["in", "notIn"],
        options: groups.map((g) => ({ value: g.id, label: g.name })),
      });
    }

    // Add donations if permissions allow
    if (Permissions.givingApi.donations) {
      categories.activity.push({
        key: "memberDonations",
        label: Locale.label("people.editCondition.memDon"),
        type: "complex",
        operators: ["donatedToAny", "donatedTo"],
      });
    }

    // Add attendance if permissions allow
    if (Permissions.attendanceApi.attendance) {
      categories.activity.push({
        key: "memberAttendance",
        label: Locale.label("people.editCondition.memAtt"),
        type: "complex",
        operators: ["attendedAny", "attendedCampus", "attendedService", "attendedServiceTime", "attendedGroup"],
      });
    }

    return categories;
  }, [groups]);

  const loadCategoryData = useCallback(async (category: string) => {
    if (loadedCategories.includes(category)) return;

    if (category === "membership" && Permissions.membershipApi.groupMembers) {
      const groupData = await ApiHelper.get("/groups", "MembershipApi");
      setGroups(groupData);
    }

    if (category === "activity") {
      if (Permissions.givingApi.donations) {
        const fundData = await ApiHelper.get("/funds", "GivingApi");
        setFunds(fundData);
      }
      if (Permissions.attendanceApi.attendance) {
        const [campusData, serviceData, serviceTimeData, groupData] = await Promise.all([
          ApiHelper.get("/campuses", "AttendanceApi"),
          ApiHelper.get("/services", "AttendanceApi"),
          ApiHelper.get("/serviceTimes", "AttendanceApi"),
          ApiHelper.get("/groups", "MembershipApi"),
        ]);
        setCampuses(campusData);
        setServices(serviceData);
        setServiceTimes(serviceTimeData);
        if (!groups.length) setGroups(groupData);
      }
    }

    setLoadedCategories([...loadedCategories, category]);
  }, [loadedCategories, groups]);

  const handleCategoryExpand = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded) {
      setExpandedCategories([...expandedCategories, category]);
      loadCategoryData(category);
    } else {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    }
  };

  const toggleFilter = (field: string) => {
    const filters = { ...activeFilters };
    if (filters[field]) {
      delete filters[field];
    } else {
      const fieldConfig = Object.values(filterCategories)
        .flat()
        .find((f) => f.key === field);
      if (fieldConfig) {
        if (fieldConfig.type === "complex") {
          setComplexFilterDialog({ open: true, field });
          return;
        }
        filters[field] = {
          field,
          operator: fieldConfig.operators?.[0] || "equals",
          value: fieldConfig.type === "select" ? fieldConfig.options?.[0]?.value || "" : "",
        };
      }
    }
    setActiveFilters(filters);
  };

  const removeFilter = (field: string) => {
    const filters = { ...activeFilters };
    delete filters[field];
    setActiveFilters(filters);
  };

  const updateFilterOperator = (field: string, operator: string) => {
    const filters = { ...activeFilters };
    if (filters[field]) {
      filters[field].operator = operator;
      setActiveFilters(filters);
    }
  };

  const updateFilterValue = (field: string, value: string) => {
    const filters = { ...activeFilters };
    if (filters[field]) {
      filters[field].value = value;
      setActiveFilters(filters);
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        const postConditions = await convertConditions();
        ApiHelper.post("/people/advancedSearch", postConditions, "MembershipApi").then((data) => {
          props.updateSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)));
        });
      }, 500);
    }
  }, [activeFilters]);

  const handleComplexFilterSave = () => {
    if (!complexFilterDialog.field || !complexConfig) return;

    const filters = { ...activeFilters };
    if (complexConfig.type === "donation") {
      if (complexConfig.operator === "donatedToAny") {
        filters[complexFilterDialog.field] = {
          field: "memberDonations",
          operator: "donatedToAny",
          value: JSON.stringify([{ value: "any", text: "Any" }, { from: complexConfig.fromDate, to: complexConfig.toDate }]),
        };
      } else {
        filters[complexFilterDialog.field] = {
          field: "memberDonations",
          operator: "donatedTo",
          value: JSON.stringify([{ value: complexConfig.entityValue, text: complexConfig.entityText }, { from: complexConfig.fromDate, to: complexConfig.toDate }]),
        };
      }
    } else if (complexConfig.type === "attendance") {
      filters[complexFilterDialog.field] = {
        field: "memberAttendance",
        operator: complexConfig.operator,
        value: JSON.stringify([{ value: complexConfig.entityValue, text: complexConfig.entityText }, { from: complexConfig.fromDate, to: complexConfig.toDate }]),
      };
    }

    setActiveFilters(filters);
    setComplexFilterDialog({ open: false, field: null });
    setComplexConfig(null);
  };

  const convertConditions = useCallback(async () => {
    const result: SearchCondition[] = [];
    for (const filter of Object.values(activeFilters)) {
      switch (filter.field) {
        case "groupMember":
          const members: GroupMemberInterface[] = await ApiHelper.get(`/groupmembers?groupId=${filter.value}`, "MembershipApi");
          const peopleIds = ArrayHelper.getIds(members, "personId");
          result.push({ field: "id", operator: filter.operator, value: peopleIds.join(",") });
          break;
        case "memberDonations":
          const fundVal = JSON.parse(filter.value);
          let memberDonations: FundDonationInterface[];
          if (filter.operator === "donatedToAny") {
            memberDonations = await ApiHelper.get(`/funddonations?startDate=${fundVal[1].from}&endDate=${fundVal[1].to}`, "GivingApi");
          } else {
            memberDonations = await ApiHelper.get(`/funddonations?fundId=${fundVal[0].value}&startDate=${fundVal[1].from}&endDate=${fundVal[1].to}`, "GivingApi");
          }
          const memberIds = ArrayHelper.getUniqueValues(memberDonations, "donation.personId").filter((f) => f !== null);
          result.push({ field: "id", operator: filter.operator, value: memberIds.join(",") });
          break;
        case "memberAttendance":
          const attendanceValue = JSON.parse(filter.value);
          let attendees;
          const dateParams = `startDate=${attendanceValue[1].from}&endDate=${attendanceValue[1].to}`;
          if (filter.operator === "attendedCampus") {
            attendees = await ApiHelper.get(`/attendancerecords/search?campusId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (filter.operator === "attendedService") {
            attendees = await ApiHelper.get(`/attendancerecords/search?serviceId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (filter.operator === "attendedServiceTime") {
            attendees = await ApiHelper.get(`/attendancerecords/search?serviceTimeId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (filter.operator === "attendedGroup") {
            attendees = await ApiHelper.get(`/attendancerecords/search?groupId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else {
            attendees = await ApiHelper.get(`/attendancerecords/search?${dateParams}`, "AttendanceApi");
          }
          const attendeeIds = ArrayHelper.getIds(attendees, "personId");
          result.push({ field: "id", operator: filter.operator, value: attendeeIds.join(",") });
          break;
        default:
          result.push(filter);
          break;
      }
    }
    return result;
  }, [activeFilters]);

  const handleAdvancedSearch = useCallback(async () => {
    const postConditions = await convertConditions();
    ApiHelper.post("/people/advancedSearch", postConditions, "MembershipApi").then((data) => {
      props.updateSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)));
    });
  }, [convertConditions, props]);

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = (category: string) => {
    const categoryFields = filterCategories[category]?.map((f) => f.key) || [];
    return Object.keys(activeFilters).filter((key) => categoryFields.includes(key)).length;
  };

  const getFilterDisplayValue = (filter: ActiveFilter) => {
    const fieldConfig = Object.values(filterCategories).flat().find((f) => f.key === filter.field);
    if (!fieldConfig) return filter.value;

    if (filter.field === "memberAttendance" || filter.field === "memberDonations") {
      try {
        const parsed = JSON.parse(filter.value);
        return `${parsed[0]?.text || "Any"}`;
      } catch (e) {
        return filter.value;
      }
    }

    if (fieldConfig.type === "select" && fieldConfig.options) {
      const option = fieldConfig.options.find(opt => opt.value === filter.value);
      return option?.label || filter.value;
    }

    return filter.value;
  };

  const renderOperatorSelect = (field: FilterField) => {
    if (!activeFilters[field.key] || !field.operators) return null;

    const operatorLabels: Record<string, string> = {
      equals: "=",
      notEquals: "≠",
      contains: Locale.label("people.editCondition.contains"),
      startsWith: Locale.label("people.editCondition.startW"),
      endsWith: Locale.label("people.editCondition.endW"),
      greaterThan: ">",
      greaterThanEqual: "≥",
      lessThan: "<",
      lessThanEqual: "≤",
      in: Locale.label("people.editCondition.isMem"),
      notIn: Locale.label("people.editCondition.notMem"),
    };

    return (
      <Select
        value={activeFilters[field.key].operator}
        onChange={(e) => updateFilterOperator(field.key, e.target.value)}
        variant="outlined"
        size="small"
        sx={{ minWidth: 100, maxWidth: 140 }}
      >
        {field.operators.map((op) => (
          <MenuItem key={op} value={op}>
            {operatorLabels[op] || op}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const renderValueInput = (field: FilterField) => {
    if (!activeFilters[field.key]) return null;

    if (field.type === "select" && field.options) {
      return (
        <Select
          value={activeFilters[field.key].value}
          onChange={(e) => updateFilterValue(field.key, e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
        >
          {field.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      );
    }

    if (field.type === "date") {
      return <TextField size="small" type="date" fullWidth value={activeFilters[field.key].value} onChange={(e) => updateFilterValue(field.key, e.target.value)} InputLabelProps={{ shrink: true }} variant="outlined" />;
    }

    if (field.type === "number") {
      return <TextField size="small" type="number" fullWidth value={activeFilters[field.key].value} onChange={(e) => updateFilterValue(field.key, e.target.value)} variant="outlined" placeholder="Value" />;
    }

    return <TextField size="small" fullWidth value={activeFilters[field.key].value} onChange={(e) => updateFilterValue(field.key, e.target.value)} placeholder="Enter value..." variant="outlined" />;
  };

  const renderComplexFilterButton = (field: FilterField) => {
    if (!activeFilters[field.key]) return null;

    const filter = activeFilters[field.key];
    let displayText = "Configure";
    if (filter.value) {
      try {
        const parsed = JSON.parse(filter.value);
        displayText = `${parsed[0]?.text || "Any"} [${parsed[1]?.from} - ${parsed[1]?.to}]`;
      } catch (e) {
        // ignore
      }
    }

    return (
      <Button
        size="small"
        variant="outlined"
        startIcon={<SettingsIcon />}
        onClick={() => {
          setComplexFilterDialog({ open: true, field: field.key });
          if (filter.value) {
            try {
              const parsed = JSON.parse(filter.value);
              setComplexConfig({
                type: field.key === "memberDonations" ? "donation" : "attendance",
                operator: filter.operator,
                entityValue: parsed[0]?.value || "any",
                entityText: parsed[0]?.text || "Any",
                fromDate: parsed[1]?.from || DateHelper.formatHtml5Date(new Date()),
                toDate: parsed[1]?.to || DateHelper.formatHtml5Date(new Date()),
              });
            } catch (e) {
              // ignore
            }
          }
        }}
        sx={{ textTransform: "none", justifyContent: "flex-start" }}>
        {displayText}
      </Button>
    );
  };

  const getCategoryLabel = (key: string) => {
    const labels: Record<string, string> = {
      names: "Names",
      demographics: "Demographics",
      contact: "Contact Information",
      membership: "Membership & Groups",
      activity: "Activity",
    };
    return labels[key] || key;
  };

  const getCategoryIcon = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      names: <PersonIcon />,
      demographics: <CakeIcon />,
      contact: <EmailIcon />,
      membership: <GroupIcon />,
      activity: <AttendanceIcon />,
    };
    return icons[key] || <PersonIcon />;
  };

  useEffect(() => {
    loadCategoryData("names");
    loadCategoryData("demographics");
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const renderContent = () => (
    <>

        {/* Active Filters Summary */}
        {Object.keys(activeFilters).length > 0 && (
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
              Active Filters ({Object.keys(activeFilters).length})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Object.entries(activeFilters).map(([key, filter]) => {
                const fieldConfig = Object.values(filterCategories).flat().find((f) => f.key === key);
                return (
                  <Chip
                    key={key}
                    label={`${fieldConfig?.label}: ${getFilterDisplayValue(filter)}`}
                    onDelete={() => removeFilter(key)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{ mb: 0.5 }}
                  />
                );
              })}
              <Chip
                label="Clear All"
                onClick={clearAllFilters}
                size="small"
                variant="outlined"
                color="default"
                sx={{ mb: 0.5 }}
              />
            </Stack>
          </Paper>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select filters below to refine your search. Check boxes to enable filters.
        </Typography>

        <Box>
          {Object.entries(filterCategories).map(([categoryKey, fields]) => {
            if (fields.length === 0) return null;
            const activeCount = getActiveFilterCount(categoryKey);

            return (
              <Accordion
                key={categoryKey}
                expanded={expandedCategories.includes(categoryKey)}
                onChange={handleCategoryExpand(categoryKey)}
                sx={{
                  mb: 1.5,
                  '&:before': { display: 'none' },
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  '&.Mui-expanded': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }
                }}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    },
                    minHeight: 56,
                    '&.Mui-expanded': {
                      minHeight: 56,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(categoryKey)}
                    </Box>
                    <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{getCategoryLabel(categoryKey)}</Typography>
                    {activeCount > 0 && (
                      <Chip
                        label={activeCount}
                        size="small"
                        color="primary"
                        sx={{
                          height: 22,
                          minWidth: 22,
                          '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 600 }
                        }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2.5 }}>
                  <Stack spacing={0} divider={<Divider />}>
                    {fields.map((field) => (
                      <Box
                        key={field.key}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3),
                          },
                          transition: 'background-color 0.2s',
                          borderRadius: 1,
                          px: 1,
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Checkbox
                                checked={!!activeFilters[field.key]}
                                onChange={() => toggleFilter(field.key)}
                                size="small"
                                sx={{
                                  '&.Mui-checked': {
                                    color: 'primary.main',
                                  }
                                }}
                              />
                              <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                                {getFieldIcon(field.type, field.key)}
                              </Box>
                              <Typography
                                sx={{
                                  color: activeFilters[field.key] ? "text.primary" : "text.secondary",
                                  fontWeight: activeFilters[field.key] ? 500 : 400,
                                  fontSize: '0.9rem',
                                }}>
                                {field.label}
                              </Typography>
                            </Stack>
                          </Grid>
                          {activeFilters[field.key] && (
                            <Grid item xs={12} sm={7}>
                              <Stack direction="row" spacing={1} sx={{ width: "100%", alignItems: "center" }}>
                                {field.type !== "complex" && field.type !== "select" && renderOperatorSelect(field)}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  {field.type === "complex" ? renderComplexFilterButton(field) : renderValueInput(field)}
                                </Box>
                              </Stack>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
    </>
  );

  if (props.embedded) {
    return (
      <>
        {renderContent()}
        {/* Complex Filter Dialog */}
      <Dialog open={complexFilterDialog.open} onClose={() => setComplexFilterDialog({ open: false, field: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {complexFilterDialog.field === "memberDonations" ? Locale.label("people.editCondition.memDon") : Locale.label("people.editCondition.memAtt")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={complexConfig?.operator || ""}
                label="Type"
                onChange={(e) => {
                  const newConfig = complexConfig || {
                    type: complexFilterDialog.field === "memberDonations" ? "donation" : "attendance",
                    operator: e.target.value,
                    entityValue: "any",
                    entityText: "Any",
                    fromDate: DateHelper.formatHtml5Date(new Date()),
                    toDate: DateHelper.formatHtml5Date(new Date()),
                  };
                  setComplexConfig({ ...newConfig, operator: e.target.value });
                }}>
                {complexFilterDialog.field === "memberDonations" ? (
                  <>
                    <MenuItem value="donatedToAny">{Locale.label("people.editCondition.hasDon")}</MenuItem>
                    <MenuItem value="donatedTo">{Locale.label("people.editCondition.donTo")}</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="attendedAny">{Locale.label("people.editCondition.attGen")}</MenuItem>
                    <MenuItem value="attendedCampus">{Locale.label("people.editCondition.attCamp")}</MenuItem>
                    <MenuItem value="attendedService">{Locale.label("people.editCondition.attServ")}</MenuItem>
                    <MenuItem value="attendedServiceTime">{Locale.label("people.editCondition.attServTime")}</MenuItem>
                    <MenuItem value="attendedGroup">{Locale.label("people.editCondition.attGroup")}</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>

            {complexConfig?.operator &&
              complexConfig.operator !== "donatedToAny" &&
              complexConfig.operator !== "attendedAny" && (
                <FormControl fullWidth>
                  <InputLabel>
                    {complexFilterDialog.field === "memberDonations"
                      ? "Fund"
                      : complexConfig.operator === "attendedCampus"
                        ? "Campus"
                        : complexConfig.operator === "attendedService"
                          ? "Service"
                          : complexConfig.operator === "attendedServiceTime"
                            ? "Service Time"
                            : "Group"}
                  </InputLabel>
                  <Select
                    value={complexConfig?.entityValue || ""}
                    label={
                      complexFilterDialog.field === "memberDonations"
                        ? "Fund"
                        : complexConfig.operator === "attendedCampus"
                          ? "Campus"
                          : complexConfig.operator === "attendedService"
                            ? "Service"
                            : complexConfig.operator === "attendedServiceTime"
                              ? "Service Time"
                              : "Group"
                    }
                    onChange={(e) => {
                      let text = "";
                      if (complexFilterDialog.field === "memberDonations") {
                        text = funds.find((f) => f.id === e.target.value)?.name || "";
                      } else if (complexConfig.operator === "attendedCampus") {
                        text = campuses.find((c) => c.id === e.target.value)?.name || "";
                      } else if (complexConfig.operator === "attendedService") {
                        const service = services.find((s) => s.id === e.target.value);
                        text = service ? `${service.campus.name} - ${service.name}` : "";
                      } else if (complexConfig.operator === "attendedServiceTime") {
                        text = serviceTimes.find((st) => st.id === e.target.value)?.longName || "";
                      } else {
                        text = groups.find((g) => g.id === e.target.value)?.name || "";
                      }
                      setComplexConfig({ ...complexConfig, entityValue: e.target.value, entityText: text });
                    }}>
                    {complexFilterDialog.field === "memberDonations"
                      ? funds.map((f) => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.name}
                          </MenuItem>
                        ))
                      : complexConfig.operator === "attendedCampus"
                        ? campuses.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.name}
                            </MenuItem>
                          ))
                        : complexConfig.operator === "attendedService"
                          ? services.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.campus.name} - {s.name}
                              </MenuItem>
                            ))
                          : complexConfig.operator === "attendedServiceTime"
                            ? serviceTimes.map((st) => (
                                <MenuItem key={st.id} value={st.id}>
                                  {st.longName}
                                </MenuItem>
                              ))
                            : groups.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                  {g.name}
                                </MenuItem>
                              ))}
                  </Select>
                </FormControl>
              )}

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label={Locale.label("people.editCondition.from")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={complexConfig?.fromDate || ""}
                onChange={(e) => setComplexConfig({ ...complexConfig!, fromDate: e.target.value })}
              />
              <TextField
                fullWidth
                label={Locale.label("people.editCondition.to")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={complexConfig?.toDate || ""}
                onChange={(e) => setComplexConfig({ ...complexConfig!, toDate: e.target.value })}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComplexFilterDialog({ open: false, field: null })}>Cancel</Button>
          <Button onClick={handleComplexFilterSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }

  return (
    <>
      <InputBox
        id="advancedSearch"
        headerIcon="person"
        headerText={Locale.label("people.peopleSearch.advSearch")}
        headerActionContent={
          props.toggleFunction && (
            <Button onClick={props.toggleFunction} sx={{ textTransform: "none" }}>
              {Locale.label("people.peopleSearch.simp")}
            </Button>
          )
        }
        saveFunction={handleAdvancedSearch}
        saveText="Search"
        isSubmitting={Object.keys(activeFilters).length < 1}
        help="chums/advanced-search">
        {renderContent()}
      </InputBox>

      {/* Complex Filter Dialog */}
      <Dialog open={complexFilterDialog.open} onClose={() => setComplexFilterDialog({ open: false, field: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {complexFilterDialog.field === "memberDonations" ? Locale.label("people.editCondition.memDon") : Locale.label("people.editCondition.memAtt")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={complexConfig?.operator || ""}
                label="Type"
                onChange={(e) => {
                  const newConfig = complexConfig || {
                    type: complexFilterDialog.field === "memberDonations" ? "donation" : "attendance",
                    operator: e.target.value,
                    entityValue: "any",
                    entityText: "Any",
                    fromDate: DateHelper.formatHtml5Date(new Date()),
                    toDate: DateHelper.formatHtml5Date(new Date()),
                  };
                  setComplexConfig({ ...newConfig, operator: e.target.value });
                }}>
                {complexFilterDialog.field === "memberDonations" ? (
                  <>
                    <MenuItem value="donatedToAny">{Locale.label("people.editCondition.hasDon")}</MenuItem>
                    <MenuItem value="donatedTo">{Locale.label("people.editCondition.donTo")}</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="attendedAny">{Locale.label("people.editCondition.attGen")}</MenuItem>
                    <MenuItem value="attendedCampus">{Locale.label("people.editCondition.attCamp")}</MenuItem>
                    <MenuItem value="attendedService">{Locale.label("people.editCondition.attServ")}</MenuItem>
                    <MenuItem value="attendedServiceTime">{Locale.label("people.editCondition.attServTime")}</MenuItem>
                    <MenuItem value="attendedGroup">{Locale.label("people.editCondition.attGroup")}</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>

            {complexConfig?.operator &&
              complexConfig.operator !== "donatedToAny" &&
              complexConfig.operator !== "attendedAny" && (
                <FormControl fullWidth>
                  <InputLabel>
                    {complexFilterDialog.field === "memberDonations"
                      ? "Fund"
                      : complexConfig.operator === "attendedCampus"
                        ? "Campus"
                        : complexConfig.operator === "attendedService"
                          ? "Service"
                          : complexConfig.operator === "attendedServiceTime"
                            ? "Service Time"
                            : "Group"}
                  </InputLabel>
                  <Select
                    value={complexConfig?.entityValue || ""}
                    label={
                      complexFilterDialog.field === "memberDonations"
                        ? "Fund"
                        : complexConfig.operator === "attendedCampus"
                          ? "Campus"
                          : complexConfig.operator === "attendedService"
                            ? "Service"
                            : complexConfig.operator === "attendedServiceTime"
                              ? "Service Time"
                              : "Group"
                    }
                    onChange={(e) => {
                      let text = "";
                      if (complexFilterDialog.field === "memberDonations") {
                        text = funds.find((f) => f.id === e.target.value)?.name || "";
                      } else if (complexConfig.operator === "attendedCampus") {
                        text = campuses.find((c) => c.id === e.target.value)?.name || "";
                      } else if (complexConfig.operator === "attendedService") {
                        const service = services.find((s) => s.id === e.target.value);
                        text = service ? `${service.campus.name} - ${service.name}` : "";
                      } else if (complexConfig.operator === "attendedServiceTime") {
                        text = serviceTimes.find((st) => st.id === e.target.value)?.longName || "";
                      } else {
                        text = groups.find((g) => g.id === e.target.value)?.name || "";
                      }
                      setComplexConfig({ ...complexConfig, entityValue: e.target.value, entityText: text });
                    }}>
                    {complexFilterDialog.field === "memberDonations"
                      ? funds.map((f) => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.name}
                          </MenuItem>
                        ))
                      : complexConfig.operator === "attendedCampus"
                        ? campuses.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.name}
                            </MenuItem>
                          ))
                        : complexConfig.operator === "attendedService"
                          ? services.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.campus.name} - {s.name}
                              </MenuItem>
                            ))
                          : complexConfig.operator === "attendedServiceTime"
                            ? serviceTimes.map((st) => (
                                <MenuItem key={st.id} value={st.id}>
                                  {st.longName}
                                </MenuItem>
                              ))
                            : groups.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                  {g.name}
                                </MenuItem>
                              ))}
                  </Select>
                </FormControl>
              )}

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label={Locale.label("people.editCondition.from")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={complexConfig?.fromDate || ""}
                onChange={(e) => setComplexConfig({ ...complexConfig!, fromDate: e.target.value })}
              />
              <TextField
                fullWidth
                label={Locale.label("people.editCondition.to")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={complexConfig?.toDate || ""}
                onChange={(e) => setComplexConfig({ ...complexConfig!, toDate: e.target.value })}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComplexFilterDialog({ open: false, field: null })}>Cancel</Button>
          <Button onClick={handleComplexFilterSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
