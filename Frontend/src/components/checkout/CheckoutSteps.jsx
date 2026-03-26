import { HiCheck } from 'react-icons/hi';

const steps = ['Address', 'Review', 'Payment'];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div>
      {steps.map((step, index) => (
        <div key={step} data-active={index === currentStep} data-completed={index < currentStep}>
          <div>{index < currentStep ? <HiCheck /> : index + 1}</div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}