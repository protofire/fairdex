import React, { FunctionComponent, useState } from 'react';
import { getTokenContract } from '../../../contracts';

export const TokenContext = React.createContext<any>({});

export const TokenContextProvider: FunctionComponent = ({ children }) => {
  const [appoving, setApproving] = useState(false);

  function doApprove(token: Token, currentAccount: Address) {
    setApproving(true);

    const tokenContract = getTokenContract(token);
    const approveValue = token.allowance && token.allowance.gt(0) ? 0 : -1; // -1 will set the max uint in the contract

    return tokenContract
      .approve(window.dx.address, approveValue)
      .send({
        from: currentAccount,
        // TODO: gasPrice
        // TODO: nonce
      })
      .once('confirmation', () => {
        setApproving(false);
      })
      .once('error', () => {
        setApproving(false);
      });
  }

  return <TokenContext.Provider value={{ appoving, doApprove }}>{children}</TokenContext.Provider>;
};
