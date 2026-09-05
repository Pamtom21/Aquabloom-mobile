import { render, screen, fireEvent } from '@testing-library/react-native';
import { AsyncState } from '../AsyncState';

it('offers a retry after an error and invokes the provided action', async () => {
  const retry = jest.fn();
  await render(
    <AsyncState kind="error" message="Sin respuesta" onRetry={retry} />,
  );
  expect(screen.getByText('Sin respuesta')).toBeTruthy();
  await fireEvent.press(screen.getByText('Reintentar'));
  expect(retry).toHaveBeenCalledTimes(1);
});
it('announces loading without offering a retry', async () => {
  await render(<AsyncState kind="loading" message="Consultando" />);
  expect(screen.getByLabelText('Cargando')).toBeTruthy();
  expect(screen.queryByText('Reintentar')).toBeNull();
});
