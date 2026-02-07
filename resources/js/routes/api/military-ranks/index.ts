import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/military-ranks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const militaryRanks = {
    index: Object.assign(index, index),
}

export default militaryRanks