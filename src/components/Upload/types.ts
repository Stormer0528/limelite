import type { DropzoneOptions } from 'react-dropzone';
import type { Theme, SxProps } from '@mui/material/styles';

import type { FileThumbnailProps } from '../file-thumbnail';

// ----------------------------------------------------------------------

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export type SingleFilePreviewProps = {
  file: File | string;
};

export type MultiFilePreviewProps = {
  files: FilesUploadType;
  sx?: SxProps<Theme>;
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onRemove: UploadProps['onRemove'];
  thumbnail: UploadProps['thumbnail'];
  slotProps?: {
    thumbnail?: Omit<FileThumbnailProps, 'file'>;
  };
};

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemoveAll?: () => void;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  onRemove?: (file: File | string) => void;
};
