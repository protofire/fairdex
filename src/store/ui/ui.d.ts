interface UiState {
  sidebarVisible: boolean;
  filtersVisible: boolean;
  infoMessage?: InfoMessage;
  auctionDetail?: AuctionDetail;
}

type InfoMessageType = 'error' | 'success' | 'info';

interface InfoMessage {
  type: InfoMessageType;
  title: string;
  content: React.ReactNode;
}

interface UiAction {
  type: string;
  payload?: Partial<UiState>;
}

interface AuctionDetail {
  buyToken: Address;
  sellToken: Address;
  auctionIndex: string;
}
