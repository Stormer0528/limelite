import type { UserGroup } from 'src/__generated__/graphql';

// ----------------------------------------------------------------------
export type UserGroupWithChildren = UserGroup & { children: UserGroupWithChildren[] };

export enum UserGroupRole {
  None = 'None',
  Viewer = 'Viewer',
  Editor = 'Editor',
  Owner = 'Owner',
}
