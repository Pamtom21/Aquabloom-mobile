import { Link } from 'expo-router';
import { Screen } from '../../components/Screen';
import { AsyncState } from '../../components/AsyncState';
export default function Profile() {
  return (
    <Screen title="Perfil">
      <AsyncState
        kind="empty"
        message="El perfil autenticado se implementará en AQU-25 a AQU-28."
      />
      <Link href="/login">Iniciar sesión</Link>
    </Screen>
  );
}
