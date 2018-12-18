import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

type Dispatch = ThunkDispatch<AppState, void, AnyAction>;
type AsyncAction = (dispatch: Dispatch, getState: () => AppState) => Promise<void> | void;

const DEFAULT_INTERVAL = 10_000; // 10 seconds

export function periodicAction(task: AsyncAction, interval = DEFAULT_INTERVAL) {
  let subscription: NodeJS.Timeout;

  return async (dispatch: Dispatch, getState: () => AppState) => {
    await checkForUpdates();

    async function checkForUpdates() {
      try {
        await task(dispatch, getState);
      } catch {
        // TODO: log error
      }

      clearTimeout(subscription);
      subscription = setTimeout(checkForUpdates, interval);
    }
  };
}
