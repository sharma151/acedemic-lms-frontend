import React from 'react';

export const createNumericInputKeyDownHandler = (preventNegative: boolean) => {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ['e', 'E', '+'];
    if (preventNegative) {
      invalidChars.push('-');
    }
    
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
};

export const createNumericInputChangeHandler = (
  preventNegative: boolean,
  callback: (value: string) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (preventNegative) {
      value = value.replace('-', '');
    }
    
    callback(value);
  };
};
