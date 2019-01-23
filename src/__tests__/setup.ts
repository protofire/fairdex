import DutchExchange from '../contracts/DutchExchange';

jest.mock('../contracts/DutchExchange');
jest.mock('../contracts/Erc20Token');

window.dx = new DutchExchange(4);
