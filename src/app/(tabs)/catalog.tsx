import { Screen } from '../../components/Screen';
import { AsyncState } from '../../components/AsyncState';
export default function Catalog() {
  return (
    <Screen title="Catálogo de lagos">
      <AsyncState
        kind="empty"
        message="Base preparada. El catálogo se conectará a la API en AQU-33 a AQU-36."
      />
    </Screen>
  );
}
