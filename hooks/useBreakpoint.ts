import { useWindowDimensions } from 'react-native';

import { layout } from '@/constants/Theme';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;
  return { width, isWide, isMobile: !isWide };
}
