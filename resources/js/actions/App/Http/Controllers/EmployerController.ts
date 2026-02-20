import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerController::apiIndex
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/employers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::apiIndex
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::apiIndex
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::apiIndex
* @see app/Http/Controllers/EmployerController.php:135
* @route '/api/employers'
*/
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:18
* @route '/employers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:18
* @route '/employers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:18
* @route '/employers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::index
* @see app/Http/Controllers/EmployerController.php:18
* @route '/employers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::create
* @see app/Http/Controllers/EmployerController.php:54
* @route '/employers/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::create
* @see app/Http/Controllers/EmployerController.php:54
* @route '/employers/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::create
* @see app/Http/Controllers/EmployerController.php:54
* @route '/employers/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::create
* @see app/Http/Controllers/EmployerController.php:54
* @route '/employers/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::store
* @see app/Http/Controllers/EmployerController.php:63
* @route '/employers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployerController::store
* @see app/Http/Controllers/EmployerController.php:63
* @route '/employers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::store
* @see app/Http/Controllers/EmployerController.php:63
* @route '/employers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployerController::show
* @see app/Http/Controllers/EmployerController.php:79
* @route '/employers/{employer}'
*/
export const show = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::show
* @see app/Http/Controllers/EmployerController.php:79
* @route '/employers/{employer}'
*/
show.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::show
* @see app/Http/Controllers/EmployerController.php:79
* @route '/employers/{employer}'
*/
show.get = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::show
* @see app/Http/Controllers/EmployerController.php:79
* @route '/employers/{employer}'
*/
show.head = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::edit
* @see app/Http/Controllers/EmployerController.php:96
* @route '/employers/{employer}/edit'
*/
export const edit = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::edit
* @see app/Http/Controllers/EmployerController.php:96
* @route '/employers/{employer}/edit'
*/
edit.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::edit
* @see app/Http/Controllers/EmployerController.php:96
* @route '/employers/{employer}/edit'
*/
edit.get = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::edit
* @see app/Http/Controllers/EmployerController.php:96
* @route '/employers/{employer}/edit'
*/
edit.head = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::update
* @see app/Http/Controllers/EmployerController.php:111
* @route '/employers/{employer}'
*/
export const update = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employers/{employer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployerController::update
* @see app/Http/Controllers/EmployerController.php:111
* @route '/employers/{employer}'
*/
update.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::update
* @see app/Http/Controllers/EmployerController.php:111
* @route '/employers/{employer}'
*/
update.put = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmployerController::update
* @see app/Http/Controllers/EmployerController.php:111
* @route '/employers/{employer}'
*/
update.patch = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmployerController::destroy
* @see app/Http/Controllers/EmployerController.php:124
* @route '/employers/{employer}'
*/
export const destroy = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employers/{employer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployerController::destroy
* @see app/Http/Controllers/EmployerController.php:124
* @route '/employers/{employer}'
*/
destroy.url = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::destroy
* @see app/Http/Controllers/EmployerController.php:124
* @route '/employers/{employer}'
*/
destroy.delete = (args: { employer: number | { id: number } } | [employer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmployerController::editLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/edit-location'
*/
export const editLocation = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editLocation.url(args, options),
    method: 'get',
})

editLocation.definition = {
    methods: ["get","head"],
    url: '/employers/{employer}/edit-location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerController::editLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/edit-location'
*/
editLocation.url = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return editLocation.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::editLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/edit-location'
*/
editLocation.get = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editLocation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployerController::editLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/edit-location'
*/
editLocation.head = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editLocation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployerController::updateLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/update-location'
*/
export const updateLocation = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
})

updateLocation.definition = {
    methods: ["put"],
    url: '/employers/{employer}/update-location',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployerController::updateLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/update-location'
*/
updateLocation.url = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateLocation.definition.url
            .replace('{employer}', parsedArgs.employer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerController::updateLocation
* @see app/Http/Controllers/EmployerController.php:0
* @route '/employers/{employer}/update-location'
*/
updateLocation.put = (args: { employer: string | number } | [employer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
})

const EmployerController = { apiIndex, index, create, store, show, edit, update, destroy, editLocation, updateLocation }

export default EmployerController