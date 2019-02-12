import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Separator from '../../../components/Separator';
import { Content, StepTitle } from './utils';

const Step5 = () => (
  <>
    <StepTitle>
      <div>
        <h3>4. What is required?</h3>
        <Separator />
      </div>
    </StepTitle>
    <Content>
      <p>
        <b>No account needed.</b> Direct trades between peers through the Gnosis DutchX trading protocol smart
        contracts.
      </p>
      <ol>
        <li>Choose the tokens you would like to bid on.</li>
        <li>Specify the amount to buy.</li>
        <li>Submit the order via your wallet provider.</li>
        <li>Claim your tokens.</li>
      </ol>
      <p>
        For more information check out{' '}
        <a href='https:\/\/dutchx.readthedocs.io/en/latest' target='_blank' rel='noopener noreferrer'>
          {'https://dutchx.readthedocs.io/en/latest'}
        </a>
      </p>
    </Content>
    <GetStarted>GET STARTED</GetStarted>
  </>
);

const GetStarted = styled(Button)`
  width: 200px;
  margin: auto;
  margin-top: var(--spacing-wide);
`;

export default Step5;
