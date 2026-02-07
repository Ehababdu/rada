import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:17
* @route '/employers/{employer}/locations'
*/
export const index = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:17
* @route '/employers/{employer}/locations'
*/
index.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
    }

    return index.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:17
* @route '/employers/{employer}/locations'
*/
index.get = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::index
* @see app/Http/Controllers/EmployerLocationController.php:17
* @route '/employers/{employer}/locations'
*/
index.head = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::create
* @see app/Http/Controllers/EmployerLocationController.php:54
* @route '/employers/{employer}/locations/create'
*/
export const create = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/locations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::create
* @see app/Http/Controllers/EmployerLocationController.php:54
* @route '/employers/{employer}/locations/create'
*/
create.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
    }

    return create.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::create
* @see app/Http/Controllers/EmployerLocationController.php:54
* @route '/employers/{employer}/locations/create'
*/
create.get = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::create
* @see app/Http/Controllers/EmployerLocationController.php:54
* @route '/employers/{employer}/locations/create'
*/
create.head = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::store
* @see app/Http/Controllers/EmployerLocationController.php:68
* @route '/employers/{employer}/locations'
*/
export const store = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employers/{employer}/locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::store
* @see app/Http/Controllers/EmployerLocationController.php:68
* @route '/employers/{employer}/locations'
*/
store.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { employer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            employer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
    }

    return store.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::store
* @see app/Http/Controllers/EmployerLocationController.php:68
* @route '/employers/{employer}/locations'
*/
store.post = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::show
* @see app/Http/Controllers/EmployerLocationController.php:89
* @route '/employers/{employer}/locations/{location}'
*/
export const show = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/locations/{location}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::show
* @see app/Http/Controllers/EmployerLocationController.php:89
* @route '/employers/{employer}/locations/{location}'
*/
show.url = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
        location: args.location,
    }

    return show.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::show
* @see app/Http/Controllers/EmployerLocationController.php:89
* @route '/employers/{employer}/locations/{location}'
*/
show.get = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::show
* @see app/Http/Controllers/EmployerLocationController.php:89
* @route '/employers/{employer}/locations/{location}'
*/
show.head = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::edit
* @see app/Http/Controllers/EmployerLocationController.php:111
* @route '/employers/{employer}/locations/{location}/edit'
*/
export const edit = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/locations/{location}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::edit
* @see app/Http/Controllers/EmployerLocationController.php:111
* @route '/employers/{employer}/locations/{location}/edit'
*/
edit.url = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
        location: args.location,
    }

    return edit.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::edit
* @see app/Http/Controllers/EmployerLocationController.php:111
* @route '/employers/{employer}/locations/{location}/edit'
*/
edit.get = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::edit
* @see app/Http/Controllers/EmployerLocationController.php:111
* @route '/employers/{employer}/locations/{location}/edit'
*/
edit.head = (args: { employer: number | { id: number }, location: string | number } | [employer: number | { id: number }, location: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::update
* @see app/Http/Controllers/EmployerLocationController.php:131
* @route '/employers/{employer}/locations/{location}'
*/
export const update = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employers/{employer}/locations/{location}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::update
* @see app/Http/Controllers/EmployerLocationController.php:131
* @route '/employers/{employer}/locations/{location}'
*/
update.url = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
        location: typeof args.location === 'object'
        ? args.location.id
        : args.location,
    }

    return update.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::update
* @see app/Http/Controllers/EmployerLocationController.php:131
* @route '/employers/{employer}/locations/{location}'
*/
update.put = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::update
* @see app/Http/Controllers/EmployerLocationController.php:131
* @route '/employers/{employer}/locations/{location}'
*/
update.patch = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmployerLocationController::destroy
* @see app/Http/Controllers/EmployerLocationController.php:167
* @route '/employers/{employer}/locations/{location}'
*/
export const destroy = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employers/{employer}/locations/{location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployerLocationController::destroy
* @see app/Http/Controllers/EmployerLocationController.php:167
* @route '/employers/{employer}/locations/{location}'
*/
destroy.url = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employer: typeof args.employer === 'object'
        ? args.employer.id
        : args.employer,
        location: typeof args.location === 'object'
        ? args.location.id
        : args.location,
    }

    return destroy.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerLocationController::destroy
* @see app/Http/Controllers/EmployerLocationController.php:167
* @route '/employers/{employer}/locations/{location}'
*/
destroy.delete = (args: { employer: number | { id: number }, location: number | { id: number } } | [employer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const locations = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default locations