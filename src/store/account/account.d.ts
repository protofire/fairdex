interface AppState {
  account: AccountInfo;
}

interface AccountInfo {
  address: Address | null;
  granted?: boolean;
}
