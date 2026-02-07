import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MaritalStatusesController::index
* @see app/Http/Controllers/Api/MaritalStatusesController.php:14
* @route '/api/marital-statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/marital-statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MaritalStatusesController::index
* @see app/Http/Controllers/Api/MaritalStatusesController.php:14
* @route '/api/marital-statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MaritalStatusesController::index
* @see app/Http/Controllers/Api/MaritalStatusesController.php:14
* @route '/api/marital-statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MaritalStatusesController::index
* @see app/Http/Controllers/Api/MaritalStatusesController.php:14
* @route '/api/marital-statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const maritalStatuses = {
    index: Object.assign(index, index),
}

export default maritalStatuses