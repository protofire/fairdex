import React from 'react';
import styled from 'styled-components';

import Separator from '../../../components/Separator';
import { Content, StepTitle } from './utils';

const Step3 = () => (
  <>
    <StepTitle>
      <div>
        <h3>2. The bidder</h3>
        <Separator />
      </div>
    </StepTitle>
    <Content>
      <p>
        Bidders need to be active at the moment of time that the price reflects their willingness to pay. In
        fact, this is <b>the best strategy for participation:</b> participation at a higher price, the bidder
        is at risk to overpay and participation below, the bidder is at risk of not be able to take part in
        the auction.
      </p>

      <p>
        <b>This is the ideal strategy</b> due to the fact that in the end - at auction closing - all bidders
        pay the same final (lowest) price! Rather than getting anything back, the bidder obtains more of the
        token that he/she purchased. This in turn means: upon participation, the bidder knows the minimum
        amount that he/she will receive.
      </p>
    </Content>
  </>
);

export default Step3;
