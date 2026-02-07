import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PromotionController::latest
* @see app/Http/Controllers/PromotionController.php:471
* @route '/promotions/export/latest'
*/
export const latest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

latest.definition = {
    methods: ["get","head"],
    url: '/promotions/export/latest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::latest
* @see app/Http/Controllers/PromotionController.php:471
* @route '/promotions/export/latest'
*/
latest.url = (options?: RouteQueryOptions) => {
    return latest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::latest
* @see app/Http/Controllers/PromotionController.php:471
* @route '/promotions/export/latest'
*/
latest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::latest
* @see app/Http/Controllers/PromotionController.php:471
* @route '/promotions/export/latest'
*/
latest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: latest.url(options),
    method: 'head',
})

const exportMethod = {
    latest: Object.assign(latest, latest),
}

export default exportMethod