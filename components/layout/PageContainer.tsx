import { StyleSheet, View, type ViewProps } from 'react-native';

import { layout } from '@/constants/Theme';

export function PageContainer({ children, style, maxWidth = layout.maxWidthDashboard }: ViewProps & { maxWidth?: number }) {
  return <View style={[styles.container, { maxWidth }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});
