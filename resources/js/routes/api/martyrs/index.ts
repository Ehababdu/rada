import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MartyrController::search
* @see app/Http/Controllers/MartyrController.php:248
* @route '/api/martyrs/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/martyrs/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::search
* @see app/Http/Controllers/MartyrController.php:248
* @route '/api/martyrs/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::search
* @see app/Http/Controllers/MartyrController.php:248
* @route '/api/martyrs/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::search
* @see app/Http/Controllers/MartyrController.php:248
* @route '/api/martyrs/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:270
* @route '/api/martyrs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/martyrs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:270
* @route '/api/martyrs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:270
* @route '/api/martyrs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:270
* @route '/api/martyrs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const martyrs = {
    search: Object.assign(search, search),
    index: Object.assign(index, index),
}

export default martyrs