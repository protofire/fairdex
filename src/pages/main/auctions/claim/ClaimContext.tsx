import React, { FunctionComponent, useState } from 'react';

export const ClaimContext = React.createContext<any>({});

export const ClaimProvider: FunctionComponent = ({ children }) => {
  const [claiming, setClaiming] = useState(false);

  function doClaim(auction: RunningAuction | EndedAuction, currentAccount: Address) {
    setClaiming(true);

    return dx
      .postClaim(auction.sellTokenAddress, auction.buyTokenAddress, auction.auctionIndex, currentAccount)
      .send({
        from: currentAccount,
        // TODO: gasPrice
        // TODO: nonce
      })
      .once('confirmation', () => {
        setClaiming(false);
      })
      .once('error', () => {
        setClaiming(false);
      });
  }

  return <ClaimContext.Provider value={{ claiming, doClaim }}>{children}</ClaimContext.Provider>;
};
