// ----------------------------------------------------------------------

const ROOTS = {
  INDEX: '/',
  SIGN_IN: '/sign-in',
  ORGANIZATION: '/:slug',
};

// ----------------------------------------------------------------------

export const paths = {
  root: ROOTS.INDEX,
  // AUTH
  signIn: ROOTS.SIGN_IN,

  organization: {
    root: (slug: string) => `${ROOTS.INDEX}${slug}`,
    accounts: (slug: string) => `${ROOTS.INDEX}${slug}/accounts`,
    accountsTabMatch: `${ROOTS.INDEX}:slug/accounts/:tab`,
    banks: (slug: string) => `${ROOTS.INDEX}${slug}/banks`,
    creditCards: (slug: string) => `${ROOTS.INDEX}${slug}/credit-cards`,
    customers: (slug: string) => `${ROOTS.INDEX}${slug}/customers`,
    reports: (slug: string) => `${ROOTS.INDEX}${slug}/reports`,
    vendors: (slug: string) => `${ROOTS.INDEX}${slug}/vendors`,
    uploads: (slug: string) => `${ROOTS.INDEX}${slug}/uploads`,
  },

  // Error
  notFound: '/404',
};
