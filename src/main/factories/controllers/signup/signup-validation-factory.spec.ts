import { CompareFieldsValidations, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}
const emailValidatorStub = new EmailValidatorStub()

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidations('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', emailValidatorStub))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
