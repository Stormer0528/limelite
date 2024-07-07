import { paths } from './routes/paths';
import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  site: {
    name: string;

    basePath: string;
    version: string;
  };
  SERVER_URL: string;
  ASSET_URL: string;
  redirectPath: string;
  storageTokenKey: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  site: {
    name: 'Limelite',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,
  },
  SERVER_URL: import.meta.env.VITE_SERVER_URL ?? '',
  ASSET_URL: import.meta.env.VITE_ASSET_URL ?? '',
  redirectPath: paths.root,
  storageTokenKey: 'token',
};
