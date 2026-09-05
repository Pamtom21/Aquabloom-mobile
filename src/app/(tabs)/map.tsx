import { Screen } from '../../components/Screen';
import { AsyncState } from '../../components/AsyncState';
export default function MapScreen() {
  return (
    <Screen title="Mapa">
      <AsyncState
        kind="empty"
        message="MapLibre está instalado. AQU-29 a AQU-32 incorporarán el mapa, los polígonos y las estaciones en una compilación Android de desarrollo."
      />
    </Screen>
  );
}
