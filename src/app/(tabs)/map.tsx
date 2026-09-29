import { SafeAreaView } from 'react-native-safe-area-context';
import { LakeMap } from '../../features/map/LakeMap';
export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <LakeMap />
    </SafeAreaView>
  );
}
