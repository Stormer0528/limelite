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
  account: icon('ic_account'),
  bank: icon('ic_bank'), // hugeicons:bank
  creditCard: icon('ic_creditcard'), // hugeicons:credit-card
  customer: icon('ic_customer'), // octicon:people-16
  report: icon('ic_report'), // carbon:report
  vendor: icon('ic_vendor'), // hugeicons:service
  upload: icon('ic_upload'), // iconamoon:cloud-upload
};

// ----------------------------------------------------------------------

export const organizationNav = (slug: string) => [
  /**
   * Overview
   */
  {
    subheader: 'Management',

    items: [
      { title: 'Home', path: paths.organization.root(slug), icon: ICONS.school, matchStrict: true },
      { title: 'Accounts', path: paths.organization.accounts(slug), icon: ICONS.account },
      { title: 'Banks', path: paths.organization.banks(slug), icon: ICONS.bank },
      { title: 'Credit Cards', path: paths.organization.creditCards(slug), icon: ICONS.creditCard },
      { title: 'Customers', path: paths.organization.customers(slug), icon: ICONS.customer },
      { title: 'Reports', path: paths.organization.reports(slug), icon: ICONS.report },
      { title: 'Vendors', path: paths.organization.vendors(slug), icon: ICONS.vendor },
      { title: 'Uploads', path: paths.organization.uploads(slug), icon: ICONS.upload },
    ],
  },
];
