import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { PersonInterface, PersonHelper } from "@churchapps/apphelper";

interface PersonAvatarProps {
  person: PersonInterface;
  size: "small" | "medium" | "large" | "xlarge" | "xxlarge" | "responsive";
  editable?: boolean;
  onClick?: () => void;
}

const getSizeValue = (size: "small" | "medium" | "large" | "xlarge" | "xxlarge" | "responsive") => {
  switch (size) {
    case "small":
      return 48;
    case "medium":
      return 56;
    case "large":
      return 80;
    case "xlarge":
      return 100;
    case "xxlarge":
      return 120;
    case "responsive":
      return { xs: 70, sm: 80, md: 100 };
    default:
      return 48;
  }
};

export const PersonAvatar: React.FC<PersonAvatarProps> = ({ person, size, editable = false, onClick }) => {
  const sizeValue = getSizeValue(size);
  const hasPhoto = person?.photo;
  const [imageError, setImageError] = useState(false);
  const initials = `${person?.name?.first?.[0] || ""}${person?.name?.last?.[0] || ""}`;

  const getFontSize = () => {
    if (size === "responsive") {
      return { xs: 28, sm: 32, md: 40 };
    }
    return typeof sizeValue === "number" ? sizeValue * 0.4 : 32;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowInitials = !hasPhoto || imageError;

  return (
    <Avatar
      src={hasPhoto && !imageError ? PersonHelper.getPhotoUrl(person) : undefined}
      onClick={onClick}
      onError={handleImageError}
      sx={{
        width: sizeValue,
        height: sizeValue,
        cursor: editable || onClick ? "pointer" : "default",
        "&:hover": editable || onClick ? { opacity: 0.8 } : {},
        "& img": {
          width: "100% !important",
          height: "100% !important",
          borderRadius: "50% !important",
          objectFit: "cover",
          objectPosition: "center",
        },
        backgroundColor: shouldShowInitials ? "primary.main" : undefined,
        fontSize: getFontSize(),
        color: "primary.contrastText",
        fontWeight: 500,
      }}
    >
      {shouldShowInitials && initials}
    </Avatar>
  );
};
