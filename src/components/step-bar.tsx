import { Stepper } from '@mantine/core'

type StepLabel = {
  label: string
  active?: number
}

export const StepBar = ({
  active = 1,
  stepLabels,
}: {
  active?: number
  stepLabels: StepLabel[]
}) => {
  return (
    <div className='container mx-auto mb-3 hidden max-w-3xl px-4 md:block'>
      <Stepper size='sm' active={active} color='orange'>
        {stepLabels.map((step, index) => (
          <Stepper.Step color='orange' key={index} label={step.label} />
        ))}
      </Stepper>
    </div>
  )
}
