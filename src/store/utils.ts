import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

type Dispatch = ThunkDispatch<AppState, void, AnyAction>;
type AsyncAction = (dispatch: Dispatch, getState: () => AppState) => Promise<void> | void;

interface PeriodicActionOptions {
  name: string;
  task: AsyncAction;
  interval?: number;
}

const DEFAULT_INTERVAL = 10_000; // 10 seconds

const subscriptions = new Map<string, NodeJS.Timeout>();

export function periodicAction({ name, task, interval = DEFAULT_INTERVAL }: PeriodicActionOptions) {
  const subscription = subscriptions.get(name);

  return async (dispatch: Dispatch, getState: () => AppState) => {
    await checkForUpdates();

    async function checkForUpdates() {
      try {
        await task(dispatch, getState);
      } catch {
        // TODO: log error
      }

      if (subscription) {
        clearTimeout(subscription);
      }

      subscriptions.set(name, setTimeout(checkForUpdates, interval));
    }
  };
}
