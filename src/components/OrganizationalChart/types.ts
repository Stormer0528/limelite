import type { TreeProps } from 'react-organizational-chart';
import type { UserGroupWithChildren } from 'src/sections/OrganizationEdit/types';

// ----------------------------------------------------------------------

type NodeAction = {
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onAssign: (id: string) => void;
};

export type ListProps = NodeAction & {
  data: UserGroupWithChildren;
  depth: number;
};

export type SubListProps = NodeAction & {
  data: UserGroupWithChildren[];
  depth: number;
};

export type OrganizationalChartProps = Partial<TreeProps> &
  NodeAction & {
    data: UserGroupWithChildren;
  };
