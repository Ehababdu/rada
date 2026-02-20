import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:15
* @route '/alerts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/alerts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:15
* @route '/alerts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:15
* @route '/alerts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:15
* @route '/alerts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlertController::show
* @see app/Http/Controllers/AlertController.php:59
* @route '/alerts/{alert}'
*/
export const show = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/alerts/{alert}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlertController::show
* @see app/Http/Controllers/AlertController.php:59
* @route '/alerts/{alert}'
*/
show.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { alert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            alert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alert: typeof args.alert === 'object'
        ? args.alert.id
        : args.alert,
    }

    return show.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::show
* @see app/Http/Controllers/AlertController.php:59
* @route '/alerts/{alert}'
*/
show.get = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::show
* @see app/Http/Controllers/AlertController.php:59
* @route '/alerts/{alert}'
*/
show.head = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlertController::destroy
* @see app/Http/Controllers/AlertController.php:131
* @route '/alerts/{alert}'
*/
export const destroy = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/alerts/{alert}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AlertController::destroy
* @see app/Http/Controllers/AlertController.php:131
* @route '/alerts/{alert}'
*/
destroy.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { alert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            alert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alert: typeof args.alert === 'object'
        ? args.alert.id
        : args.alert,
    }

    return destroy.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::destroy
* @see app/Http/Controllers/AlertController.php:131
* @route '/alerts/{alert}'
*/
destroy.delete = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AlertController::markAsRead
* @see app/Http/Controllers/AlertController.php:88
* @route '/alerts/{alert}/mark-as-read'
*/
export const markAsRead = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/mark-as-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::markAsRead
* @see app/Http/Controllers/AlertController.php:88
* @route '/alerts/{alert}/mark-as-read'
*/
markAsRead.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { alert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            alert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alert: typeof args.alert === 'object'
        ? args.alert.id
        : args.alert,
    }

    return markAsRead.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::markAsRead
* @see app/Http/Controllers/AlertController.php:88
* @route '/alerts/{alert}/mark-as-read'
*/
markAsRead.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::markAsUnread
* @see app/Http/Controllers/AlertController.php:103
* @route '/alerts/{alert}/mark-as-unread'
*/
export const markAsUnread = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

markAsUnread.definition = {
    methods: ["post"],
    url: '/alerts/{alert}/mark-as-unread',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::markAsUnread
* @see app/Http/Controllers/AlertController.php:103
* @route '/alerts/{alert}/mark-as-unread'
*/
markAsUnread.url = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { alert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            alert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alert: typeof args.alert === 'object'
        ? args.alert.id
        : args.alert,
    }

    return markAsUnread.definition.url
            .replace('{alert}', parsedArgs.alert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::markAsUnread
* @see app/Http/Controllers/AlertController.php:103
* @route '/alerts/{alert}/mark-as-unread'
*/
markAsUnread.post = (args: { alert: number | { id: number } } | [alert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::markAllAsRead
* @see app/Http/Controllers/AlertController.php:118
* @route '/alerts/mark-all-as-read'
*/
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/alerts/mark-all-as-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::markAllAsRead
* @see app/Http/Controllers/AlertController.php:118
* @route '/alerts/mark-all-as-read'
*/
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::markAllAsRead
* @see app/Http/Controllers/AlertController.php:118
* @route '/alerts/mark-all-as-read'
*/
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

const AlertController = { index, show, destroy, markAsRead, markAsUnread, markAllAsRead }

export default AlertController