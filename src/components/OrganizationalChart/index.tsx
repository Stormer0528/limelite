import { Tree, TreeNode } from 'react-organizational-chart';

import { useTheme } from '@mui/material/styles';

import Node from './Node';

import type { ListProps, SubListProps, OrganizationalChartProps } from './types';

// ----------------------------------------------------------------------

export function OrganizationalChart({
  data,
  onEdit,
  onRemove,
  onAdd,
  onAssign,
  ...other
}: OrganizationalChartProps) {
  const theme = useTheme();

  return (
    <Tree
      lineWidth="1.5px"
      nodePadding="4px"
      lineBorderRadius="24px"
      lineHeight="40px"
      lineColor={theme.palette.divider}
      label={
        <Node node={data} onEdit={onEdit} onRemove={onRemove} onAdd={onAdd} onAssign={onAssign} />
      }
      {...other}
    >
      {data.children.map((list) => (
        <List
          key={list.name}
          depth={1}
          data={list}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onAssign={onAssign}
        />
      ))}
    </Tree>
  );
}

// ----------------------------------------------------------------------

export function List({ data, depth, onEdit, onRemove, onAdd, onAssign }: ListProps) {
  const hasChild = data.children && !!data.children;

  return (
    <TreeNode
      label={
        <Node node={data} onEdit={onEdit} onRemove={onRemove} onAdd={onAdd} onAssign={onAssign} />
      }
    >
      {hasChild && (
        <SubList
          data={data.children}
          depth={depth}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onAssign={onAssign}
        />
      )}
    </TreeNode>
  );
}

// ----------------------------------------------------------------------

function SubList({ data, depth, onEdit, onRemove, onAdd, onAssign }: SubListProps) {
  return (
    <>
      {data.map((list) => (
        <List
          key={list.name}
          data={list}
          depth={depth + 1}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onAssign={onAssign}
        />
      ))}
    </>
  );
}
