import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  createNumericInputChangeHandler,
  createNumericInputKeyDownHandler,
} from './numeric-input.utils';

/** Hides browser spin buttons on `type="number"` inputs. */
export const hideNumberStepperClass =
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

type InputProps = React.ComponentProps<'input'> & {
  hideNumberStepper?: boolean;
  preventNegative?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      step,
      hideNumberStepper,
      preventNegative = false,
      onKeyDown,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isNumeric = type === 'number';

    return (
      <input
        type={type}
        step={step ?? (isNumeric ? 'any' : undefined)}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm text-foreground shadow-surface-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-background dark:focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          hideNumberStepper && hideNumberStepperClass,
          className,
        )}
        ref={ref}
        {...props}
        onKeyDown={(e) => {
          if (isNumeric) {
            createNumericInputKeyDownHandler(preventNegative)(e);
          }
          onKeyDown?.(e);
        }}
        onChange={(e) => {
          if (isNumeric) {
            createNumericInputChangeHandler(preventNegative, (value) => {
              if (value !== e.target.value) {
                e.target.value = value;
              }
              onChange?.(e);
            })(e);
            return;
          }
          onChange?.(e);
        }}
        onWheel={(e) => {
          e.currentTarget.blur();
        }}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
