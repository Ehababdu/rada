import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import locations from './locations'
/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/employers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const employers = {
    index: Object.assign(index, index),
    locations: Object.assign(locations, locations),
}

export default employers