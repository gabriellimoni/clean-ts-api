import { Controller } from '../../../../../presentation/protocols'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-survey-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
