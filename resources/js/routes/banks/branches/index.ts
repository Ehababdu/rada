import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:17
* @route '/banks/{bank}/branches'
*/
export const index = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:17
* @route '/banks/{bank}/branches'
*/
index.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bank: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bank: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            bank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
    }

    return index.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:17
* @route '/banks/{bank}/branches'
*/
index.get = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:17
* @route '/banks/{bank}/branches'
*/
index.head = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BranchController::create
* @see app/Http/Controllers/BranchController.php:51
* @route '/banks/{bank}/branches/create'
*/
export const create = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}/branches/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BranchController::create
* @see app/Http/Controllers/BranchController.php:51
* @route '/banks/{bank}/branches/create'
*/
create.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bank: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bank: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            bank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
    }

    return create.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::create
* @see app/Http/Controllers/BranchController.php:51
* @route '/banks/{bank}/branches/create'
*/
create.get = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BranchController::create
* @see app/Http/Controllers/BranchController.php:51
* @route '/banks/{bank}/branches/create'
*/
create.head = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BranchController::store
* @see app/Http/Controllers/BranchController.php:64
* @route '/banks/{bank}/branches'
*/
export const store = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/banks/{bank}/branches',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BranchController::store
* @see app/Http/Controllers/BranchController.php:64
* @route '/banks/{bank}/branches'
*/
store.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bank: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bank: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            bank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
    }

    return store.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::store
* @see app/Http/Controllers/BranchController.php:64
* @route '/banks/{bank}/branches'
*/
store.post = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BranchController::show
* @see app/Http/Controllers/BranchController.php:81
* @route '/banks/{bank}/branches/{branch}'
*/
export const show = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}/branches/{branch}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BranchController::show
* @see app/Http/Controllers/BranchController.php:81
* @route '/banks/{bank}/branches/{branch}'
*/
show.url = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            bank: args[0],
            branch: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return show.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::show
* @see app/Http/Controllers/BranchController.php:81
* @route '/banks/{bank}/branches/{branch}'
*/
show.get = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BranchController::show
* @see app/Http/Controllers/BranchController.php:81
* @route '/banks/{bank}/branches/{branch}'
*/
show.head = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BranchController::edit
* @see app/Http/Controllers/BranchController.php:100
* @route '/banks/{bank}/branches/{branch}/edit'
*/
export const edit = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}/branches/{branch}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BranchController::edit
* @see app/Http/Controllers/BranchController.php:100
* @route '/banks/{bank}/branches/{branch}/edit'
*/
edit.url = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            bank: args[0],
            branch: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return edit.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::edit
* @see app/Http/Controllers/BranchController.php:100
* @route '/banks/{bank}/branches/{branch}/edit'
*/
edit.get = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BranchController::edit
* @see app/Http/Controllers/BranchController.php:100
* @route '/banks/{bank}/branches/{branch}/edit'
*/
edit.head = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BranchController::update
* @see app/Http/Controllers/BranchController.php:117
* @route '/banks/{bank}/branches/{branch}'
*/
export const update = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/banks/{bank}/branches/{branch}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BranchController::update
* @see app/Http/Controllers/BranchController.php:117
* @route '/banks/{bank}/branches/{branch}'
*/
update.url = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            bank: args[0],
            branch: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return update.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::update
* @see app/Http/Controllers/BranchController.php:117
* @route '/banks/{bank}/branches/{branch}'
*/
update.put = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BranchController::update
* @see app/Http/Controllers/BranchController.php:117
* @route '/banks/{bank}/branches/{branch}'
*/
update.patch = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\BranchController::destroy
* @see app/Http/Controllers/BranchController.php:134
* @route '/banks/{bank}/branches/{branch}'
*/
export const destroy = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/banks/{bank}/branches/{branch}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BranchController::destroy
* @see app/Http/Controllers/BranchController.php:134
* @route '/banks/{bank}/branches/{branch}'
*/
destroy.url = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            bank: args[0],
            branch: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        bank: typeof args.bank === 'object'
        ? args.bank.id
        : args.bank,
        branch: typeof args.branch === 'object'
        ? args.branch.id
        : args.branch,
    }

    return destroy.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BranchController::destroy
* @see app/Http/Controllers/BranchController.php:134
* @route '/banks/{bank}/branches/{branch}'
*/
destroy.delete = (args: { bank: number | { id: number }, branch: number | { id: number } } | [bank: number | { id: number }, branch: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const branches = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default branches