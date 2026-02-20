import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:17
* @route '/employment-statuses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employment-statuses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:17
* @route '/employment-statuses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:17
* @route '/employment-statuses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::index
* @see app/Http/Controllers/EmploymentStatusController.php:17
* @route '/employment-statuses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::create
* @see app/Http/Controllers/EmploymentStatusController.php:46
* @route '/employment-statuses/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employment-statuses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::create
* @see app/Http/Controllers/EmploymentStatusController.php:46
* @route '/employment-statuses/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::create
* @see app/Http/Controllers/EmploymentStatusController.php:46
* @route '/employment-statuses/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::create
* @see app/Http/Controllers/EmploymentStatusController.php:46
* @route '/employment-statuses/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::store
* @see app/Http/Controllers/EmploymentStatusController.php:54
* @route '/employment-statuses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employment-statuses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::store
* @see app/Http/Controllers/EmploymentStatusController.php:54
* @route '/employment-statuses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::store
* @see app/Http/Controllers/EmploymentStatusController.php:54
* @route '/employment-statuses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::show
* @see app/Http/Controllers/EmploymentStatusController.php:69
* @route '/employment-statuses/{employment_status}'
*/
export const show = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employment-statuses/{employment_status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::show
* @see app/Http/Controllers/EmploymentStatusController.php:69
* @route '/employment-statuses/{employment_status}'
*/
show.url = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employment_status: args }
    }

    if (Array.isArray(args)) {
        args = {
            employment_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employment_status: args.employment_status,
    }

    return show.definition.url
            .replace('{employment_status}', parsedArgs.employment_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::show
* @see app/Http/Controllers/EmploymentStatusController.php:69
* @route '/employment-statuses/{employment_status}'
*/
show.get = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::show
* @see app/Http/Controllers/EmploymentStatusController.php:69
* @route '/employment-statuses/{employment_status}'
*/
show.head = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::edit
* @see app/Http/Controllers/EmploymentStatusController.php:86
* @route '/employment-statuses/{employment_status}/edit'
*/
export const edit = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employment-statuses/{employment_status}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::edit
* @see app/Http/Controllers/EmploymentStatusController.php:86
* @route '/employment-statuses/{employment_status}/edit'
*/
edit.url = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employment_status: args }
    }

    if (Array.isArray(args)) {
        args = {
            employment_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employment_status: args.employment_status,
    }

    return edit.definition.url
            .replace('{employment_status}', parsedArgs.employment_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::edit
* @see app/Http/Controllers/EmploymentStatusController.php:86
* @route '/employment-statuses/{employment_status}/edit'
*/
edit.get = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::edit
* @see app/Http/Controllers/EmploymentStatusController.php:86
* @route '/employment-statuses/{employment_status}/edit'
*/
edit.head = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::update
* @see app/Http/Controllers/EmploymentStatusController.php:98
* @route '/employment-statuses/{employment_status}'
*/
export const update = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employment-statuses/{employment_status}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::update
* @see app/Http/Controllers/EmploymentStatusController.php:98
* @route '/employment-statuses/{employment_status}'
*/
update.url = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employment_status: args }
    }

    if (Array.isArray(args)) {
        args = {
            employment_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employment_status: args.employment_status,
    }

    return update.definition.url
            .replace('{employment_status}', parsedArgs.employment_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::update
* @see app/Http/Controllers/EmploymentStatusController.php:98
* @route '/employment-statuses/{employment_status}'
*/
update.put = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::update
* @see app/Http/Controllers/EmploymentStatusController.php:98
* @route '/employment-statuses/{employment_status}'
*/
update.patch = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmploymentStatusController::destroy
* @see app/Http/Controllers/EmploymentStatusController.php:115
* @route '/employment-statuses/{employment_status}'
*/
export const destroy = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employment-statuses/{employment_status}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmploymentStatusController::destroy
* @see app/Http/Controllers/EmploymentStatusController.php:115
* @route '/employment-statuses/{employment_status}'
*/
destroy.url = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employment_status: args }
    }

    if (Array.isArray(args)) {
        args = {
            employment_status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employment_status: args.employment_status,
    }

    return destroy.definition.url
            .replace('{employment_status}', parsedArgs.employment_status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmploymentStatusController::destroy
* @see app/Http/Controllers/EmploymentStatusController.php:115
* @route '/employment-statuses/{employment_status}'
*/
destroy.delete = (args: { employment_status: string | number } | [employment_status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const employmentStatuses = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default employmentStatuses