export interface FieldError {
  message?: string
}

export interface PassengerErrors {
  birthDate?: FieldError
  [key: string]: FieldError | undefined
}

export interface PassengersErrors {
  passengers?: PassengerErrors[]
  root?: FieldError
  message?: string
}

export interface FormErrors {
  passengers?: PassengersErrors
  message?: string
}
