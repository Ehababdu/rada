import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import employmentStatuses from './employment-statuses'
import militaryRanks from './military-ranks'
import banks from './banks'
import employers from './employers'
import parentsStatuses from './parents-statuses'
import maritalStatuses from './marital-statuses'
import martyrs from './martyrs'
import jobGrades from './job-grades'
import permissions from './permissions'
/**
* @see \App\Http\Controllers\Api\SearchController::search
* @see app/Http/Controllers/Api/SearchController.php:14
* @route '/api/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SearchController::search
* @see app/Http/Controllers/Api/SearchController.php:14
* @route '/api/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SearchController::search
* @see app/Http/Controllers/Api/SearchController.php:14
* @route '/api/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SearchController::search
* @see app/Http/Controllers/Api/SearchController.php:14
* @route '/api/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

const api = {
    employmentStatuses: Object.assign(employmentStatuses, employmentStatuses),
    militaryRanks: Object.assign(militaryRanks, militaryRanks),
    banks: Object.assign(banks, banks),
    employers: Object.assign(employers, employers),
    parentsStatuses: Object.assign(parentsStatuses, parentsStatuses),
    maritalStatuses: Object.assign(maritalStatuses, maritalStatuses),
    martyrs: Object.assign(martyrs, martyrs),
    search: Object.assign(search, search),
    jobGrades: Object.assign(jobGrades, jobGrades),
    permissions: Object.assign(permissions, permissions),
}

export default api