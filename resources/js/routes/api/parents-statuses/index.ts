import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ParentsStatusesController::index
* @see app/Http/Controllers/Api/ParentsStatusesController.php:14
* @route '/api/parents-statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/parents-statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ParentsStatusesController::index
* @see app/Http/Controllers/Api/ParentsStatusesController.php:14
* @route '/api/parents-statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ParentsStatusesController::index
* @see app/Http/Controllers/Api/ParentsStatusesController.php:14
* @route '/api/parents-statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ParentsStatusesController::index
* @see app/Http/Controllers/Api/ParentsStatusesController.php:14
* @route '/api/parents-statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const parentsStatuses = {
    index: Object.assign(index, index),
}

export default parentsStatuses