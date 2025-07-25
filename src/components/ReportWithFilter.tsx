import React, { useState, useEffect } from "react";
import { ApiHelper, UserHelper, Locale, ArrayHelper, DateHelper } from "@churchapps/apphelper";
import { ReportInterface, ReportResultInterface, ParameterInterface } from "@churchapps/helpers";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Stack, Alert, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { PlayArrow as PlayArrowIcon, GetApp as GetAppIcon } from "@mui/icons-material";

interface ReportWithFilterProps {
  keyName: string;
  autoRun?: boolean;
}

export const ReportWithFilter: React.FC<ReportWithFilterProps> = ({ keyName, autoRun = false }) => {
  const [report, setReport] = useState<ReportInterface | null>(null);
  const [result, setResult] = useState<ReportResultInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadReport();
  }, [keyName]);

  useEffect(() => {
    if (autoRun && report) {
      runReport();
    }
  }, [autoRun, report]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiHelper.get("/reports/" + keyName, "ReportingApi");
      setReport(data);
      
      // Initialize default parameter values
      const defaultValues: Record<string, string> = {};
      data.parameters?.forEach((param: ParameterInterface) => {
        if (param.defaultValue) {
          defaultValues[param.keyName] = param.defaultValue;
        } else if (param.keyName === "churchId") {
          defaultValues[param.keyName] = UserHelper.currentUserChurch?.church?.id || "";
        } else if (param.keyName === "startDate") {
          defaultValues[param.keyName] = DateHelper.formatHtml5Date(new Date(new Date().getFullYear(), 0, 1));
        } else if (param.keyName === "endDate") {
          defaultValues[param.keyName] = DateHelper.formatHtml5Date(new Date());
        }
      });
      setParameterValues(defaultValues);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const runReport = async () => {
    if (!report) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare parameters for API call
      const params: any = {};
      Object.keys(parameterValues).forEach(key => {
        if (parameterValues[key]) {
          params[key] = parameterValues[key];
        }
      });
      
      const data = await ApiHelper.get("/reports/run/" + keyName + "?" + new URLSearchParams(params).toString(), "ReportingApi");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to run report");
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (paramKey: string, value: string) => {
    setParameterValues(prev => ({ ...prev, [paramKey]: value }));
  };

  const exportCsv = () => {
    if (!result || !result.table || result.table.length === 0) return;
    
    // Get headers from first output column definitions
    const output = result.outputs?.[0];
    if (!output) return;
    
    const headers = output.columns.map(col => col.header);
    const csvContent = [
      headers.join(","),
      ...result.table.map(row => 
        output.columns.map(col => {
          const value = row[col.value];
          // Escape values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        }).join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${report?.displayName || 'report'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderParameterInput = (param: ParameterInterface) => {
    if (param.options && param.options.length > 0) {
      return (
        <FormControl key={param.keyName} size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{param.displayName || param.keyName}</InputLabel>
          <Select
            value={parameterValues[param.keyName] || ""}
            onChange={(e) => handleParameterChange(param.keyName, e.target.value)}
            label={param.displayName || param.keyName}
          >
            <MenuItem value="">
              <em>{Locale.label("common.none")}</em>
            </MenuItem>
            {param.options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else if (param.keyName.includes("Date")) {
      return (
        <TextField
          key={param.keyName}
          type="date"
          label={param.displayName || param.keyName}
          value={parameterValues[param.keyName] || ""}
          onChange={(e) => handleParameterChange(param.keyName, e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
      );
    } else {
      return (
        <TextField
          key={param.keyName}
          label={param.displayName || param.keyName}
          value={parameterValues[param.keyName] || ""}
          onChange={(e) => handleParameterChange(param.keyName, e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
      );
    }
  };

  const renderTable = () => {
    if (!result || !result.table || result.table.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {Locale.label("common.noData")}
          </Typography>
        </Box>
      );
    }

    const output = result.outputs?.[0];
    if (!output) return null;

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {output.columns.map((col, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 600 }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {result.table.map((row, rowIdx) => (
              <TableRow key={rowIdx} hover>
                {output.columns.map((col, colIdx) => (
                  <TableCell key={colIdx}>
                    {formatCellValue(row[col.value], col.formatter)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const formatCellValue = (value: any, formatter?: string): string => {
    if (value === null || value === undefined) return "";
    
    switch (formatter) {
      case "currency":
        return "$" + parseFloat(value).toFixed(2);
      case "number":
        return parseFloat(value).toLocaleString();
      case "date":
        return value ? DateHelper.prettyDate(new Date(value)) : "";
      case "datetime":
        return value ? DateHelper.prettyDateTime(new Date(value)) : "";
      default:
        return value.toString();
    }
  };

  if (loading && !result) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="report-container" sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {report && (
        <>
          {/* Parameters Section */}
          {report.parameters && report.parameters.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {report.parameters.map(param => renderParameterInput(param))}
                <Button
                  variant="contained"
                  onClick={runReport}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                >
                  {Locale.label("reports.runReport")}
                </Button>
              </Stack>
            </Box>
          )}
          
          {/* Results Section */}
          {result && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {result.displayName || report.displayName}
                </Typography>
                <Button
                  size="small"
                  startIcon={<GetAppIcon />}
                  onClick={exportCsv}
                >
                  {Locale.label("common.export")}
                </Button>
              </Box>
              
              {result.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {result.description}
                </Typography>
              )}
              
              {renderTable()}
            </>
          )}
        </>
      )}
    </Box>
  );
};