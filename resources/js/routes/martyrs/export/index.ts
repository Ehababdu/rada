import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MartyrController::get
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export/download'
*/
export const get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/martyrs/export/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::get
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export/download'
*/
get.url = (options?: RouteQueryOptions) => {
    return get.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::get
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export/download'
*/
get.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::get
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export/download'
*/
get.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::latest
* @see app/Http/Controllers/MartyrController.php:192
* @route '/martyrs/export/latest'
*/
export const latest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

latest.definition = {
    methods: ["get","head"],
    url: '/martyrs/export/latest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::latest
* @see app/Http/Controllers/MartyrController.php:192
* @route '/martyrs/export/latest'
*/
latest.url = (options?: RouteQueryOptions) => {
    return latest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::latest
* @see app/Http/Controllers/MartyrController.php:192
* @route '/martyrs/export/latest'
*/
latest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::latest
* @see app/Http/Controllers/MartyrController.php:192
* @route '/martyrs/export/latest'
*/
latest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: latest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::status
* @see app/Http/Controllers/MartyrController.php:222
* @route '/martyrs/export/status'
*/
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/martyrs/export/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::status
* @see app/Http/Controllers/MartyrController.php:222
* @route '/martyrs/export/status'
*/
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::status
* @see app/Http/Controllers/MartyrController.php:222
* @route '/martyrs/export/status'
*/
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::status
* @see app/Http/Controllers/MartyrController.php:222
* @route '/martyrs/export/status'
*/
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

const exportMethod = {
    get: Object.assign(get, get),
    latest: Object.assign(latest, latest),
    status: Object.assign(status, status),
}

export default exportMethod