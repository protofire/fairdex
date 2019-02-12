import React from 'react';
import styled from 'styled-components';

import Separator from '../../../components/Separator';
import { Content, StepTitle } from './utils';

const Step4 = () => (
  <>
    <StepTitle>
      <div>
        <h3>3. The auction</h3>
        <Separator />
      </div>
    </StepTitle>
    <Content>
      <p>
        After bidding on a token pair, the bidder can already claim the amount you bought (and then any
        additional amounts and the remainder also upon closing of the auction).
      </p>
      <p>
        <b>Hence, a bidder has instant liquidity, where this is important.</b>
      </p>
      <p>In summary: the bidders need to have a defined willingness to pay!</p>
    </Content>
  </>
);

export default Step4;
