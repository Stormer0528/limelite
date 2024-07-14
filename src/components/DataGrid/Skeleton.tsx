import * as React from 'react';

import { Box, styled, Skeleton } from '@mui/material';
import {
  useGridSelector,
  useGridRootProps,
  useGridApiContext,
  gridDimensionsSelector,
  gridDensityFactorSelector,
  gridVisibleColumnDefinitionsSelector,
} from '@mui/x-data-grid';

// Pseudo random number. See https://stackoverflow.com/a/47593316
function mulberry32(a: number): () => number {
  return () => {
    /* eslint-disable */
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    /* eslint-enable */
  };
}

function randomBetween(seed: number, min: number, max: number): () => number {
  const random = mulberry32(seed);
  return () => min + (max - min) * random();
}

const SkeletonCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: `1px dashed ${theme.palette.divider}`,
}));

export function DataGridSkeleton() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const factor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(rootProps.rowHeight * factor);

  const skeletonRowsCount = Math.ceil(viewportHeight / rowHeight);

  const columns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);

  const children = React.useMemo(() => {
    // reseed random number generator to create stable lines between renders
    const random = randomBetween(12345, 25, 75);
    const array: React.ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      columns.forEach((column) => {
        const width = Math.round(random());
        array.push(
          <SkeletonCell key={`col-${column.field}-${i}`} sx={{ justifyContent: column.align }}>
            <Skeleton sx={{ mx: 1 }} width={`${width}%`} />
          </SkeletonCell>
        );
      });
      array.push(<SkeletonCell key={`fill-${i}`} />);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(
    () =>
      // The `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`.
      apiRef.current.subscribeEvent('scrollPositionChange', (params) => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = params.left;
        }
      }),
    [apiRef]
  );

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `${columns
          .map(({ computedWidth }) => `${computedWidth}px`)
          .join(' ')} 1fr`,
        gridAutoRows: `${rowHeight}px`,
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
