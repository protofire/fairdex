import copyToClipboard from 'clipboard-copy';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { isAddress, shortenAddress } from '../../contracts/utils';
import Panel from '../Panel';
import Tooltip from '../Tooltip';

interface AddressProps {
  address: Address;
  shorten?: boolean;
  className?: string;
}

const Address = ({ className, address, shorten = true }: AddressProps) => {
  const [message, setMessage] = useState('');
  const [closeTimer, setCloseTimer] = useState(null);

  const copyAddress = useCallback(
    () => {
      copyToClipboard(address);

      setMessage('Copied!');

      if (closeTimer) {
        clearTimeout(closeTimer);
      }

      setCloseTimer(setTimeout(() => setMessage(''), 1_750));
    },
    [address, closeTimer],
  );

  const handleClose = useCallback(() => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    setMessage('');
  }, []);

  return (
    <Wrapper
      className={className}
      title={address}
      onClick={copyAddress}
      onClickOutside={handleClose}
      onEscPress={handleClose}
    >
      <Tooltip content={message}>{isAddress(address) && shorten ? shortenAddress(address) : address}</Tooltip>
    </Wrapper>
  );
};

const Wrapper = styled(Panel)`
  cursor: pointer;
  user-select: none;
`;

export default Address;
