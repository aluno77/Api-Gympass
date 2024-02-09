// LateCheckInValidationError = Erro de validação de check-in atrasado
// The check-in can only be validated until 20 minutes of its creation = O check-in só pode ser validado até 20 minutos de sua criação
export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only be validated until 20 minutes of its creation')
  }
}
