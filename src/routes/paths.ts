// ----------------------------------------------------------------------

const ROOTS = {
  SIGN_IN: '/sign-in',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  signIn: ROOTS.SIGN_IN,
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },

    user: {
      root: `${ROOTS.DASHBOARD}/users`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}`,
      new: `${ROOTS.DASHBOARD}/users/new`,
    },
    org: {
      root: `${ROOTS.DASHBOARD}/organizations`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/organizations/${id}`,
      editUserGroup: (id: string) => `${ROOTS.DASHBOARD}/organizations/${id}/user-group`,
      new: `${ROOTS.DASHBOARD}/organizations/new`,
    },
  },
  notFound: '/404',
};
