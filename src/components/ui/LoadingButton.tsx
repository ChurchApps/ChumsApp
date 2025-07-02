import React from "react";
import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, loadingText, children, disabled, ...props }) => {
  return (
    <Button {...props} disabled={disabled || loading} startIcon={loading ? <CircularProgress size={16} /> : props.startIcon}>
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};
