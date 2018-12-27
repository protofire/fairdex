import React from 'react';

import { shortenAddress, isAddress } from '../../contracts/utils';

interface AddressProps {
  address: Address;
  shorten: boolean;
  className?: string;
}

const Address = ({ className, address, shorten }: AddressProps) => (
  <span className={className}>{isAddress(address) && shorten ? shortenAddress(address) : address}</span>
);

Address.defaultProps = {
  shorten: true,
};

export default Address;
