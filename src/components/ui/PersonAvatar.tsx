import React from 'react';
import { Avatar } from '@mui/material';
import { PersonInterface, PersonHelper } from '@churchapps/apphelper';

interface PersonAvatarProps {
  person: PersonInterface;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  editable?: boolean;
  onClick?: () => void;
}

const getSizeValue = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
  switch (size) {
    case 'small': return 48;
    case 'medium': return 56;
    case 'large': return 80;
    case 'xlarge': return 100;
    default: return 48;
  }
};

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  person,
  size,
  editable = false,
  onClick
}) => {
  const sizeValue = getSizeValue(size);
  const hasPhoto = person?.photo;
  const initials = `${person?.firstName?.[0] || ''}${person?.lastName?.[0] || ''}`;
  
  return (
    <Avatar 
      src={hasPhoto ? PersonHelper.getPhotoUrl(person) : undefined}
      onClick={onClick}
      sx={{ 
        width: sizeValue, 
        height: sizeValue,
        cursor: (editable || onClick) ? 'pointer' : 'default',
        '&:hover': (editable || onClick) ? { opacity: 0.8 } : {},
        '& img': {
          objectFit: 'cover',
          objectPosition: 'center'
        },
        backgroundColor: !hasPhoto ? 'primary.main' : undefined,
        fontSize: sizeValue * 0.4
      }}
    >
      {!hasPhoto && initials}
    </Avatar>
  );
};