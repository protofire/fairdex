import React from 'react';
import styled from 'styled-components';

import Separator from '../../../components/Separator';
import { Content, StepTitle } from './utils';

const Step2 = () => (
  <>
    <StepTitle>
      <div>
        <h3>1. What is Fairdex?</h3>
        <Separator />
      </div>
    </StepTitle>
    <Content>
      <p>
        <b>Fairdex</b> is a trading interface that allows you to interact with the DutchX decentralized
        trading protocol for ERC20 tokens, determining a fair value for tokens based on the Dutch auction
        principle.
      </p>

      <p>A dutch auction has two parties: sellers and bidders.</p>

      <p>As a bidder you will be able to browse through all the running, scheduled and ended auctions.</p>

      <p>
        <b>This interface focuses on the bidders.</b>
      </p>
    </Content>
  </>
);

export default Step2;
