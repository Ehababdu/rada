import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ActivityLogController::index
* @see app/Http/Controllers/ActivityLogController.php:14
* @route '/activity-log'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/activity-log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ActivityLogController::index
* @see app/Http/Controllers/ActivityLogController.php:14
* @route '/activity-log'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActivityLogController::index
* @see app/Http/Controllers/ActivityLogController.php:14
* @route '/activity-log'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ActivityLogController::index
* @see app/Http/Controllers/ActivityLogController.php:14
* @route '/activity-log'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ActivityLogController::show
* @see app/Http/Controllers/ActivityLogController.php:76
* @route '/activity-log/{activity_log}'
*/
export const show = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/activity-log/{activity_log}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ActivityLogController::show
* @see app/Http/Controllers/ActivityLogController.php:76
* @route '/activity-log/{activity_log}'
*/
show.url = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { activity_log: args }
    }

    if (Array.isArray(args)) {
        args = {
            activity_log: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        activity_log: args.activity_log,
    }

    return show.definition.url
            .replace('{activity_log}', parsedArgs.activity_log.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActivityLogController::show
* @see app/Http/Controllers/ActivityLogController.php:76
* @route '/activity-log/{activity_log}'
*/
show.get = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ActivityLogController::show
* @see app/Http/Controllers/ActivityLogController.php:76
* @route '/activity-log/{activity_log}'
*/
show.head = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ActivityLogController::destroy
* @see app/Http/Controllers/ActivityLogController.php:108
* @route '/activity-log/{activity_log}'
*/
export const destroy = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/activity-log/{activity_log}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ActivityLogController::destroy
* @see app/Http/Controllers/ActivityLogController.php:108
* @route '/activity-log/{activity_log}'
*/
destroy.url = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { activity_log: args }
    }

    if (Array.isArray(args)) {
        args = {
            activity_log: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        activity_log: args.activity_log,
    }

    return destroy.definition.url
            .replace('{activity_log}', parsedArgs.activity_log.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActivityLogController::destroy
* @see app/Http/Controllers/ActivityLogController.php:108
* @route '/activity-log/{activity_log}'
*/
destroy.delete = (args: { activity_log: string | number } | [activity_log: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ActivityLogController = { index, show, destroy }

export default ActivityLogController