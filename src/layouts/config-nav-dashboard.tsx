import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config';

import { SvgColor } from 'src/components/SvgColor';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic_user'),
  school: icon('ic_school'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Limelite Administration',
    items: [
      { title: 'User', path: paths.dashboard.user.root, icon: ICONS.user },
      { title: 'Organization', path: paths.dashboard.org.root, icon: ICONS.school },
    ],
  },
];
