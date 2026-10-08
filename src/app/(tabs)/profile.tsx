import { ProfileScreen } from '../../features/auth/ProfileScreen';
import { RequireSession } from '../../features/auth/RequireSession';

export default function Profile() {
  return (
    <RequireSession>
      <ProfileScreen />
    </RequireSession>
  );
}
