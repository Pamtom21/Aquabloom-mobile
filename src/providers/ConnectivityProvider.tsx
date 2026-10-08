import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  resolveConnectivityStatus,
  type ConnectivityStatus,
} from '../features/connectivity/connectivity';

const ConnectivityContext = createContext<ConnectivityStatus>('unknown');

export function ConnectivityProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<ConnectivityStatus>('unknown');

  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        const nextStatus = resolveConnectivityStatus(state);
        setStatus(nextStatus);
        if (nextStatus !== 'unknown') {
          onlineManager.setOnline(nextStatus === 'online');
        }
      }),
    [],
  );

  return (
    <ConnectivityContext.Provider value={status}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  return useContext(ConnectivityContext);
}
