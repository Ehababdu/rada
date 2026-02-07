import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:127
* @route '/api/employment-statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/employment-statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:127
* @route '/api/employment-statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:127
* @route '/api/employment-statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:127
* @route '/api/employment-statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const employmentStatuses = {
    index: Object.assign(index, index),
}

export default employmentStatuses