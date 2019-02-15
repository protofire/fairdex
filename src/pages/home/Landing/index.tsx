import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import Card from '../../../components/Card';
import Logos from '../../../components/Logos';
import * as images from '../../../images';
import { getNetworkType } from '../../../store/blockchain';
import { isTermsConditionsAccepted } from '../../../store/terms-conditions';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

interface LandingStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

type Props = LandingStateProps & RouteComponentProps;

const AVAILABLE_NETWORKS = ['main', 'rinkeby'];

const Landing: FunctionComponent<Props> = ({ network, wallet, termsConditionsAccepted, history }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hidePrev, setHidePrev] = useState(true);
  const [hideNext, setHideNext] = useState(false);
  const [stepComponent, setStepComponent] = useState(<Step1 />);

  const handleNexStep = useCallback(
    () => {
      setCurrentStep(prevStep => {
        let nextStep = prevStep + 1;

        setHidePrev(false);

        if (nextStep === 6) {
          nextStep = 5;
        }

        return nextStep === 6 ? 5 : nextStep;
      });
    },
    [currentStep, hideNext, hidePrev],
  );

  const handlePrevStep = useCallback(
    () => {
      setCurrentStep(prevStep => {
        const nextStep = prevStep - 1;

        setHideNext(false);

        return nextStep === 0 ? 1 : nextStep;
      });
    },
    [currentStep, hideNext, hidePrev],
  );

  useEffect(
    () => {
      switch (currentStep) {
        case 1:
          setHidePrev(true);
          setHideNext(false);
          setStepComponent(<Step1 />);
          break;

        case 2:
          setHidePrev(false);
          setHideNext(false);
          setStepComponent(<Step2 />);
          break;

        case 3:
          setHidePrev(false);
          setHideNext(false);
          setStepComponent(<Step3 />);
          break;

        case 4:
          setHidePrev(false);
          setHideNext(false);
          setStepComponent(<Step4 />);
          break;

        case 5:
          setHidePrev(false);
          setHideNext(true);
          setStepComponent(<Step5 onGetStarted={handleGetStarted} />);
          break;

        default:
          setHidePrev(true);
          setHideNext(false);
          setStepComponent(<Step1 />);
          break;
      }
    },
    [currentStep, stepComponent, hideNext, hidePrev],
  );

  const handleStepButtonClick = (step: number) => () => setCurrentStep(step);

  const handleGetStarted = useCallback(
    () => {
      if (!termsConditionsAccepted) {
        history.push('/terms-conditions');
      } else if (!wallet || !network) {
        history.push('/select-wallet');
      } else if (network && !AVAILABLE_NETWORKS.includes(network)) {
        history.push('/network-not-available');
      } else {
        history.push('/auctions');
      }
    },
    [termsConditionsAccepted, network, wallet, history],
  );

  return (
    <Wrapper>
      <Header>
        <h1>
          Welcome to the <b>FairDEX</b> Trading Platform.{' '}
        </h1>
        <h3>A trading interface to interact with the Gnosis DutchX open protocol.</h3>
      </Header>
      <Main>
        <Content>
          <PrevNextStep src={images.landing.ChevronLeft} onClick={handlePrevStep} hide={hidePrev} />
          <StepWrapper>
            <StepContent>{stepComponent}</StepContent>
            <StepSwitcher>
              <StepButton active={currentStep === 1} onClick={handleStepButtonClick(1)} />
              <StepButton active={currentStep === 2} onClick={handleStepButtonClick(2)} />
              <StepButton active={currentStep === 3} onClick={handleStepButtonClick(3)} />
              <StepButton active={currentStep === 4} onClick={handleStepButtonClick(4)} />
              <StepButton active={currentStep === 5} onClick={handleStepButtonClick(5)} />
            </StepSwitcher>
            {currentStep !== 5 && <Skip onClick={handleGetStarted}>Skip and get started!</Skip>}
          </StepWrapper>
          <PrevNextStep src={images.landing.ChevronRight} onClick={handleNexStep} hide={hideNext} />
        </Content>
        <SuportedWallets>
          <WalletLogos>
            <img src={images.landing.MetaMask} />
            <img src={images.landing.Safe} />
          </WalletLogos>
          <WalletDescription>
            Connect one of the supported wallets to automatically connect to the <b>Fairdex Portal.</b>
          </WalletDescription>
        </SuportedWallets>
      </Main>
      <Logos />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: left;

  p {
    color: #adadad;
    font-size: 13px;
    line-height: 1.4;
    margin: 25px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Header = styled.div`
  height: var(--header-heigh);
  padding-top: var(--spacing-normal);
  text-align: center;

  h1 {
    font-size: 22px;
    color: #303b3e;
    line-height: 1.36;
    margin-bottom: 0.5em;
    font-weight: lighter;

    b {
      font-weight: bold;
    }
  }

  h3 {
    color: #626262;
    font-size: 17px;
    font-stretch: normal;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    line-height: 1.12;
  }
`;

const Main = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--spacing-wide) 0;
`;

const Content = styled.section`
  align-items: center;
  display: flex;
  justify-content: space-around;
`;

const PrevNextStep = styled.img`
  cursor: pointer;
  height: 20px;
  margin: 10px;

  @media (min-width: 768px) {
    height: 30px;
    margin: var(--spacing-normal);
    width: 16.5px;
  }

  ${({ hide }) => {
    if (hide) {
      return css`
        visibility: hidden;
      `;
    }
  }}
`;

const StepWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  max-width: 636px;
  min-height: 480px;
  padding: 15px;
  position: relative;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 30px 0 40px;

  @media (min-width: 768px) {
    padding: 30px 0 20px;
  }
`;

const StepButton = styled.div`
  background: var(--color-grey);
  cursor: pointer;
  height: 5px;
  margin: 0 7px;
  transition: all 0.3s ease-out;
  width: 32px;

  ${({ active }) => {
    if (active) {
      return css`
        background: var(--color-accent);
        box-shadow: 0 1px 8px 0 var(--color-accent-shadow);
        cursor: none;
      `;
    }
  }}
`;

const Skip = styled.span`
  bottom: 15px;
  color: #dbb82c;
  cursor: pointer;
  font-size: 11px;
  line-height: 1.2;
  position: absolute;
  right: 15px;
  text-decoration: underline;
`;

const SuportedWallets = styled.section`
  display: flex;
  flex-flow: column;
  padding: var(--spacing-normal) 15px 0;
  text-align: center;
`;

const WalletLogos = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;

  img {
    margin: 5px 10px;
  }
`;

const WalletDescription = styled.div`
  color: #333333;
  font-size: 12px;
  font-stretch: normal;
  font-style: normal;
  font-weight: normal;
  letter-spacing: normal;
  line-height: 1.33;
`;

function mapStateToProps(state: AppState): LandingStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

export default withRouter(connect(mapStateToProps)(Landing));
