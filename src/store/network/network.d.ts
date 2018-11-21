interface AppState {
  network: NetworkInfo;
}

interface NetworkInfo {
  type: 'main' | 'rinkeby' | 'other' | null;
}
