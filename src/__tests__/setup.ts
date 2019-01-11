import DutchExchange from '../contracts/DutchExchange';

jest.mock('../contracts/DutchExchange');

window.dx = new DutchExchange(4);
