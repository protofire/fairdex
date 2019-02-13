import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { PrivacyPolicy } from '../../files';
import { getNetworkType } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import { acceptTermsConditions } from '../../store/terms-conditions/actions';

interface TermsAndConditionsStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

interface DispatchProps {
  onAcceptTermsConditions: () => void;
}

type Props = TermsAndConditionsStateProps & DispatchProps;

const TermsAndConditions: FunctionComponent<Props> = ({
  network,
  wallet,
  termsConditionsAccepted,
  onAcceptTermsConditions,
}) => {
  const [readAndUnderstood, setReadAndUnderstood] = useState(false);
  const [disclaimer1, setDisclaimer1] = useState(false);
  const [disclaimer2, setDisclaimer2] = useState(false);
  const [disclaimer3, setDisclaimer3] = useState(false);

  const handleDisclaimer1Toggle = useCallback(
    () => {
      setDisclaimer1(prevState => !prevState);
    },
    [disclaimer1],
  );

  const handleDisclaimer2Toggle = useCallback(
    () => {
      setDisclaimer2(prevState => !prevState);
    },
    [disclaimer2],
  );

  const handleDisclaimer3Toggle = useCallback(
    () => {
      setDisclaimer3(prevState => !prevState);
    },
    [disclaimer3],
  );

  const handleReadAndUnderstoodToggle = useCallback(
    () => {
      setReadAndUnderstood(prevState => !prevState);
    },
    [readAndUnderstood],
  );

  const isAcceptDisabled = useMemo(() => !disclaimer1 || !disclaimer2 || !disclaimer3 || !readAndUnderstood, [
    disclaimer1,
    disclaimer2,
    disclaimer3,
    readAndUnderstood,
  ]);

  if (termsConditionsAccepted && !wallet) {
    return <Redirect to='/select-wallet' />;
  } else if (termsConditionsAccepted && network && network !== 'rinkeby') {
    return <Redire ct to='/network-not-available' />;
  } else if (termsConditionsAccepted && wallet && network === 'rinkeby') {
    return <Redirect to='/auctions' />;
  } else {
    return (
      <Wrapper>
        <Content>
          <Header>
            <h1>Verification and Terms</h1>
            <h3>Please read and truly confirm all sections before you continue</h3>
          </Header>
          <Label>
            <Checkbox name='disclaimer1' checked={disclaimer1} onToggle={handleDisclaimer1Toggle} />I am
            NEITHER a citizen or resident of, NOR currently located in any of the following states or
            territories, NOR an entity formed under the laws of: Afghanistan, Cuba, Democratic People's
            Republic of Korea, Iran, Iraq, People’s Republic of China, Russian Federation, Somalia, Sudan,
            Syria, United Arab Emirates, United States of America, Venezuela, Yemen.
          </Label>
          <br />
          <br />
          <Label>
            <Checkbox name='disclaimer3' checked={disclaimer2} onToggle={handleDisclaimer2Toggle} />I certify
            that I am NEITHER on any of the U.S. Treasury Department’s Office of Foreign Asset Control’s
            sanctions lists, the U.S. Commerce Department's Consolidated Screening List, the EU consolidated
            list of persons, groups or entities subject to EU financial sanctions, NOR do I act on behalf of a
            person sanctioned thereunder or a U.S.-, EU- or UN-sanctioned state.
          </Label>
          <br />
          <br />
          <Label>
            <Checkbox name='disclaimer3' checked={disclaimer3} onToggle={handleDisclaimer3Toggle} />I have
            read, understood, and agree to the full Terms and Conditions:
          </Label>
          <Terms>
            <h3>General terms of Services (hereinafter - “Terms”)</h3>
            <p>
              Please read these Terms carefully before participating on our trading platform. These Terms tell
              you who we are, what we offer, and what to do if there is a problem and other important
              information.
            </p>

            <h3>1. Who we are and how to contact us</h3>
            <p>
              1.1. Slow.trade is operated by d.ex OÜ (”We”). We are a private limited company registered in
              Estonia under registry No. 14553524 at Ahtri 12, Kesklinna District, 10151 Tallinn, Harju
              County, Estonia. To contact us, please email us at info@slow.trade.
            </p>

            <h3>2. Our Services</h3>
            <p>
              2.1. We provide a graphical user interface on the site https://slow.trade (the “Platform”) to
              facilitate you interacting via a digital wallet, vault or storage mechanism (a “Wallet”) with
              the DutchX decentralized trading protocol for ERC 20 tokens (the “Protocol”).
              <br />
              <br />
              2.2. The Protocol was developed by Gnosis Limited and is governed by a series of smart contracts
              that allow peer-to-peer trades between users applying a Dutch auction mechanism and without the
              need for intermediaries on the Ethereum Blockchain. We did not develop and do not operate or
              maintain or have any control whatsoever over the Protocol. We are not a custodian or a
              counterparty to any transactions executed by you on the Protocol. We do not support any other
              service, particularly we do not provide any order matching, guaranteed prices, order
              cancellation or similar exchange or trading platform services.
              <br />
              <br />
              2.3. On our Platform, we assist you in (1) depositing ERC20 tokens listed on our Platform (the
              “Supported Tokens”) for trading against other Supported Tokens via your Wallet into the auction
              conducted by the Protocol and (2) claiming the Supported Tokens you receive for your trade back
              to that same Wallet.
              <br />
              <br />
              2.4. If you wish to use ETH to trade on the Platform, we offer you an interface to interact with
              a smart contract developed by Gnosis Limited that wraps your ETH making it ERC20 compliant,
              which you will be prompted to before the trade.The Platform does not support the un-wrapping of
              wrapped ETH.
              <br />
              <br />
              2.5. We do not guarantee that our Platform will be secure or free from bugs or viruses.
              <br />
              <br />
              2.6. You are responsible for configuring your information technology and computer programmes to
              access our Platform. You should use your own virus protection software.
              <br />
              <br />
              2.7. You must not misuse our Platform by knowingly introducing material that is malicious or
              technologically harmful. You must not attempt to gain unauthorised access to our Platform, the
              server on which our interface is stored or any server, computer or database connected to our
              interface. You must not attack our Platform via a denial-of-service attack or a distributed
              denial-of service attack. By breaching this provision, you would commit a criminal offence. We
              will report any such breach to the relevant law enforcement authorities and we will cooperate
              with those authorities, including, where possible, by disclosing your identity to them. In the
              event of such a breach, your right to use our Platform will cease immediately.
            </p>
          </Terms>
          <br />
          <br />
          <Label>
            <Checkbox
              name='readAndUnderstood'
              checked={readAndUnderstood}
              onToggle={handleReadAndUnderstoodToggle}
            />
            I have read and understood the{' '}
            <Link href={PrivacyPolicy} target='_blank' rel='noopener noreferrer'>
              Privacy Policy
            </Link>
          </Label>
          <Footer>
            <Button disabled={isAcceptDisabled} onClick={onAcceptTermsConditions}>
              Accept
            </Button>
          </Footer>
        </Content>
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;

  align-items: center;

  text-align: left;

  h1 {
    font-size: 2em;
    font-weight: bold;
  }

  h3 {
    font-size: 1em;
    line-height: 24px;
  }

  p {
    color: #969da3;
    font-size: 1em;
    margin-left: 1em;
  }
`;

const Header = styled.div`
  height: var(--header-heigh);
  padding-bottom: var(--spacing-normal);
  text-align: left;
  h1 {
    margin-bottom: 1em;
  }

  h3 {
    color: var(--color-light-grey-blue);
  }
`;

const Content = styled.section`
  max-width: 850px;
  padding: var(--spacing-normal);
  margin-top: var(--spacing-normal);
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
  background: var(--color-main-bg);
`;

const Terms = styled.div`
  max-height: 200px;
  margin-top: 1em;
  overflow: auto;
  background: var(--color-content-bg);
  padding: var(--spacing-narrow);
`;

const Footer = styled.footer`
  padding-top: var(--spacing-normal);
  border-top: 1px solid var(--color-content-bg);
  margin-top: 1em;
`;

const Label = styled.label`
  flex: 1 1 auto;
  cursor: pointer;
`;

const Link = styled.a`
  color: var(--color-light-grey-blue);
  text-decoration: underline;

  &:link,
  &:visited {
    color: var(--color-light-grey-blue);
  }
`;

function mapStateToProps(state: AppState): TermsAndConditionsStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    onAcceptTermsConditions: () => dispatch(acceptTermsConditions()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsAndConditions);
