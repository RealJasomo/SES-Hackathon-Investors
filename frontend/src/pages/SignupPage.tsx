import React, { useState } from 'react';
import LoginForm from '@components/LoginForm';
import SignupInformation from '@components/SignupInformation';
import { Step, StepLabel, Stepper } from '@material-ui/core';
 
import { ReactComponent as Logo } from '@res/launchpad.svg';
import styles from './SignupPage.module.scss';

interface IStep {
    number: number,
    label: string,
    description: string,
}

const steps: IStep[] = [{
    number: 1,
    label: 'Sign Up',
    description: 'Enter an email and password or sign up with google'
}, {
    number: 2,
    label: 'Personal Information',
    description: 'Enter your information'
}]

export default function SignupPage(){
    const [step, setStep] = useState<IStep>(steps[0]);
    
    return (
        <div className={styles.signupPage}>
            <div className={styles.signupCard}>
                <div className={styles.signupProgress}>
                    <div className={styles.brand}>
                        <Logo className={styles.logo}/>
                    </div>
                    <div className={styles.steps}>
                        <h1>Step {step.number}</h1>
                        <p>{step.description}</p>
                        <Stepper 
                            className={styles.stepper}
                            activeStep={step.number-1} 
                            orientation="vertical">
                            {steps.map(step => (
                                <Step key={step.number}>
                                   <StepLabel>{step.label}</StepLabel> 
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </div>
                <div className={styles.signupArea}>
                    {step.number===1&&<LoginForm signup onSignUp={() => setStep(steps[step.number])}/>}
                    {step.number===2&&<SignupInformation />}
                </div>
            </div>
        </div>);
}
