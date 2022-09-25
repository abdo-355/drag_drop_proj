export interface Validatable {
  value: string | number;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

export const validate = (input: Validatable) => {
  let isValid = true;

  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minlength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minlength;
  }
  if (input.maxlength && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxlength;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
};
