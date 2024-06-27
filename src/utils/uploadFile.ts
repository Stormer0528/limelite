import { CONFIG } from 'src/config';

import { getSession } from 'src/auth/utils';

export async function uploadFile(file: File) {
  const url = CONFIG.ASSET_URL; // replace with your upload URL
  const token = getSession();

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
}

export const getFileUrl = (url: string): string => `${CONFIG.ASSET_URL}/${url}`;
