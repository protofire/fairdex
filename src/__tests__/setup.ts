import DutchExchange from '../contracts/DutchExchange';

jest.mock('../contracts/DutchExchange');
jest.mock('../contracts/Erc20Token');
jest.mock('../contracts/Weth');

window.dx = new DutchExchange(4);
