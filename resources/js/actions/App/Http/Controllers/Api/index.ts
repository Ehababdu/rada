import ParentsStatusesController from './ParentsStatusesController'
import MaritalStatusesController from './MaritalStatusesController'
import SearchController from './SearchController'

const Api = {
    ParentsStatusesController: Object.assign(ParentsStatusesController, ParentsStatusesController),
    MaritalStatusesController: Object.assign(MaritalStatusesController, MaritalStatusesController),
    SearchController: Object.assign(SearchController, SearchController),
}

export default Api