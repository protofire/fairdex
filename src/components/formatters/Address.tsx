import copyToClipboard from 'clipboard-copy';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { isAddress, shortenAddress } from '../../contracts/utils';
import Tooltip from '../Tooltip';

interface AddressProps {
  address: Address;
  shorten?: boolean;
  className?: string;
}

const Address = ({ className, address, shorten = true }: AddressProps) => {
  const [message, setMessage] = useState('');

  const copyAddress = useCallback(
    () => {
      copyToClipboard(address);

      setMessage('Copied!');
      setTimeout(() => setMessage(''), 1_750);
    },
    [address],
  );

  return (
    <Wrapper className={className} title={address} onClick={copyAddress}>
      <Tooltip content={message}>{isAddress(address) && shorten ? shortenAddress(address) : address}</Tooltip>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  cursor: pointer;
`;

export default Address;
