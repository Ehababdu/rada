import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import branches from './branches'
/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:125
* @route '/api/banks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/banks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:125
* @route '/api/banks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:125
* @route '/api/banks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:125
* @route '/api/banks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const banks = {
    index: Object.assign(index, index),
    branches: Object.assign(branches, branches),
}

export default banks