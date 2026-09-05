import { Screen } from '../components/Screen';
import { AsyncState } from '../components/AsyncState';
export default function Login() {
  return (
    <Screen title="Iniciar sesión">
      <AsyncState
        kind="empty"
        message="Ruta preparada para el formulario y la autenticación de AQU-17 a AQU-24."
      />
    </Screen>
  );
}
