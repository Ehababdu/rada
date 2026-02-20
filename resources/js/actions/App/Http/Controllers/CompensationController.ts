import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompensationController::index
* @see app/Http/Controllers/CompensationController.php:16
* @route '/compensations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compensations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompensationController::index
* @see app/Http/Controllers/CompensationController.php:16
* @route '/compensations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::index
* @see app/Http/Controllers/CompensationController.php:16
* @route '/compensations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompensationController::index
* @see app/Http/Controllers/CompensationController.php:16
* @route '/compensations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompensationController::create
* @see app/Http/Controllers/CompensationController.php:101
* @route '/compensations/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/compensations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompensationController::create
* @see app/Http/Controllers/CompensationController.php:101
* @route '/compensations/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::create
* @see app/Http/Controllers/CompensationController.php:101
* @route '/compensations/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompensationController::create
* @see app/Http/Controllers/CompensationController.php:101
* @route '/compensations/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompensationController::store
* @see app/Http/Controllers/CompensationController.php:136
* @route '/compensations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/compensations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompensationController::store
* @see app/Http/Controllers/CompensationController.php:136
* @route '/compensations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::store
* @see app/Http/Controllers/CompensationController.php:136
* @route '/compensations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompensationController::show
* @see app/Http/Controllers/CompensationController.php:183
* @route '/compensations/{compensation}'
*/
export const show = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compensations/{compensation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompensationController::show
* @see app/Http/Controllers/CompensationController.php:183
* @route '/compensations/{compensation}'
*/
show.url = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compensation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compensation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compensation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compensation: typeof args.compensation === 'object'
        ? args.compensation.id
        : args.compensation,
    }

    return show.definition.url
            .replace('{compensation}', parsedArgs.compensation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::show
* @see app/Http/Controllers/CompensationController.php:183
* @route '/compensations/{compensation}'
*/
show.get = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompensationController::show
* @see app/Http/Controllers/CompensationController.php:183
* @route '/compensations/{compensation}'
*/
show.head = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompensationController::edit
* @see app/Http/Controllers/CompensationController.php:207
* @route '/compensations/{compensation}/edit'
*/
export const edit = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/compensations/{compensation}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompensationController::edit
* @see app/Http/Controllers/CompensationController.php:207
* @route '/compensations/{compensation}/edit'
*/
edit.url = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compensation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compensation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compensation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compensation: typeof args.compensation === 'object'
        ? args.compensation.id
        : args.compensation,
    }

    return edit.definition.url
            .replace('{compensation}', parsedArgs.compensation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::edit
* @see app/Http/Controllers/CompensationController.php:207
* @route '/compensations/{compensation}/edit'
*/
edit.get = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompensationController::edit
* @see app/Http/Controllers/CompensationController.php:207
* @route '/compensations/{compensation}/edit'
*/
edit.head = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompensationController::update
* @see app/Http/Controllers/CompensationController.php:249
* @route '/compensations/{compensation}'
*/
export const update = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/compensations/{compensation}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompensationController::update
* @see app/Http/Controllers/CompensationController.php:249
* @route '/compensations/{compensation}'
*/
update.url = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compensation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compensation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compensation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compensation: typeof args.compensation === 'object'
        ? args.compensation.id
        : args.compensation,
    }

    return update.definition.url
            .replace('{compensation}', parsedArgs.compensation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::update
* @see app/Http/Controllers/CompensationController.php:249
* @route '/compensations/{compensation}'
*/
update.put = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CompensationController::update
* @see app/Http/Controllers/CompensationController.php:249
* @route '/compensations/{compensation}'
*/
update.patch = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CompensationController::destroy
* @see app/Http/Controllers/CompensationController.php:283
* @route '/compensations/{compensation}'
*/
export const destroy = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/compensations/{compensation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompensationController::destroy
* @see app/Http/Controllers/CompensationController.php:283
* @route '/compensations/{compensation}'
*/
destroy.url = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compensation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compensation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compensation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compensation: typeof args.compensation === 'object'
        ? args.compensation.id
        : args.compensation,
    }

    return destroy.definition.url
            .replace('{compensation}', parsedArgs.compensation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::destroy
* @see app/Http/Controllers/CompensationController.php:283
* @route '/compensations/{compensation}'
*/
destroy.delete = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CompensationController::pdf
* @see app/Http/Controllers/CompensationController.php:309
* @route '/compensations/{compensation}/pdf'
*/
export const pdf = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/compensations/{compensation}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompensationController::pdf
* @see app/Http/Controllers/CompensationController.php:309
* @route '/compensations/{compensation}/pdf'
*/
pdf.url = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compensation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compensation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compensation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compensation: typeof args.compensation === 'object'
        ? args.compensation.id
        : args.compensation,
    }

    return pdf.definition.url
            .replace('{compensation}', parsedArgs.compensation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompensationController::pdf
* @see app/Http/Controllers/CompensationController.php:309
* @route '/compensations/{compensation}/pdf'
*/
pdf.get = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompensationController::pdf
* @see app/Http/Controllers/CompensationController.php:309
* @route '/compensations/{compensation}/pdf'
*/
pdf.head = (args: { compensation: number | { id: number } } | [compensation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

const CompensationController = { index, create, store, show, edit, update, destroy, pdf }

export default CompensationController