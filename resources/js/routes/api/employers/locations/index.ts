import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:178
* @route '/api/employers/{employer}/locations'
*/
export const index = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/employers/{employer}/locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:178
* @route '/api/employers/{employer}/locations'
*/
index.url = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employer: args }
    }

    if (Array.isArray(args)) {
        args = {
            employer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: args.employer,
    }

    return index.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:178
* @route '/api/employers/{employer}/locations'
*/
index.get = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:178
* @route '/api/employers/{employer}/locations'
*/
index.head = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

const locations = {
    index: Object.assign(index, index),
}

export default locations