import { router } from 'expo-router';
import { Screen } from '../components/Screen';
import { LoginForm } from '../features/auth/LoginForm';
import { signInWithPassword } from '../features/auth/signIn';

export default function Login() {
  return (
    <Screen title="Iniciar sesión">
      <LoginForm
        onAuthenticated={() => router.replace('/')}
        onSubmit={signInWithPassword}
      />
    </Screen>
  );
}
