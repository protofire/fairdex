import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { withPageview } from '../../../analytics';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Checkbox from '../../../components/Checkbox';
import { PrivacyPolicy } from '../../../files';
import * as images from '../../../images';
import { acceptTermsConditions } from '../../../store/terms-conditions/actions';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const Landing = () => {
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
          setStepComponent(<Step5 />);
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

  return (
    <Wrapper>
      <Header>
        <h1>
          Welcome to the <b>FairDEX</b> Trading Platform.{' '}
        </h1>
        <h3>A trading interface to interact with the Gnosis DutchX open protocol.</h3>
      </Header>
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
          {currentStep !== 5 && <Skip>Skip and get started!</Skip>}
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
      <Footer>
        <Protofire>
          <span>Built by </span>
          <img src={images.logo} />
        </Protofire>
        <Geco>
          <img src={images.geco} />
          <span>
            Grant by
            <br />
            the Gnosis Ecosystem Fund
          </span>
        </Geco>
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  align-items: center;
  text-align: left;

  p {
    font-size: 13px;
    line-height: 1.23;
    color: #adadad;
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
    font-size: 17px;
    color: #626262;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.12;
    letter-spacing: normal;
  }
`;

const Content = styled.section`
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const PrevNextStep = styled.img`
  width: 16.5px;
  height: 30px;
  margin: var(--spacing-normal);
  cursor: pointer;

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
  width: 636px;
  min-height: 480px;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: var(--spacing-narrow);
`;

const StepButton = styled.div`
  width: 32px;
  height: 5px;
  margin: 0 7px;
  background: var(--color-grey);
  cursor: pointer;

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
  font-size: 11px;
  line-height: 1.36;
  color: #dbb82c;
  text-decoration: underline;
  align-self: flex-end;
  cursor: pointer;
`;

const SuportedWallets = styled.section`
  display: flex;
  flex-flow: column;
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
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #333333;
`;

const Footer = styled.footer`
  padding: var(--spacing-normal) 0;
  display: flex;
  flex-flow: row;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: #303b3e;
`;

const Protofire = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 144px;
    height: 40px;
    margin: 0 10px;
  }
`;

const Geco = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 35px;
    height: 35px;
    margin: 0 10px;
  }
`;

export default withPageview('/', Landing);
