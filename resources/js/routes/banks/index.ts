import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import branches from './branches'
/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:17
* @route '/banks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/banks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:17
* @route '/banks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:17
* @route '/banks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:17
* @route '/banks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BankController::create
* @see app/Http/Controllers/BankController.php:51
* @route '/banks/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/banks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::create
* @see app/Http/Controllers/BankController.php:51
* @route '/banks/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::create
* @see app/Http/Controllers/BankController.php:51
* @route '/banks/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::create
* @see app/Http/Controllers/BankController.php:51
* @route '/banks/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BankController::store
* @see app/Http/Controllers/BankController.php:59
* @route '/banks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/banks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BankController::store
* @see app/Http/Controllers/BankController.php:59
* @route '/banks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::store
* @see app/Http/Controllers/BankController.php:59
* @route '/banks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BankController::show
* @see app/Http/Controllers/BankController.php:73
* @route '/banks/{bank}'
*/
export const show = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::show
* @see app/Http/Controllers/BankController.php:73
* @route '/banks/{bank}'
*/
show.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::show
* @see app/Http/Controllers/BankController.php:73
* @route '/banks/{bank}'
*/
show.get = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::show
* @see app/Http/Controllers/BankController.php:73
* @route '/banks/{bank}'
*/
show.head = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BankController::edit
* @see app/Http/Controllers/BankController.php:88
* @route '/banks/{bank}/edit'
*/
export const edit = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/banks/{bank}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::edit
* @see app/Http/Controllers/BankController.php:88
* @route '/banks/{bank}/edit'
*/
edit.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::edit
* @see app/Http/Controllers/BankController.php:88
* @route '/banks/{bank}/edit'
*/
edit.get = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::edit
* @see app/Http/Controllers/BankController.php:88
* @route '/banks/{bank}/edit'
*/
edit.head = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BankController::update
* @see app/Http/Controllers/BankController.php:101
* @route '/banks/{bank}'
*/
export const update = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/banks/{bank}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BankController::update
* @see app/Http/Controllers/BankController.php:101
* @route '/banks/{bank}'
*/
update.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::update
* @see app/Http/Controllers/BankController.php:101
* @route '/banks/{bank}'
*/
update.put = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BankController::update
* @see app/Http/Controllers/BankController.php:101
* @route '/banks/{bank}'
*/
update.patch = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\BankController::destroy
* @see app/Http/Controllers/BankController.php:114
* @route '/banks/{bank}'
*/
export const destroy = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/banks/{bank}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BankController::destroy
* @see app/Http/Controllers/BankController.php:114
* @route '/banks/{bank}'
*/
destroy.url = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{bank}', parsedArgs.bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::destroy
* @see app/Http/Controllers/BankController.php:114
* @route '/banks/{bank}'
*/
destroy.delete = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const banks = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    branches: Object.assign(branches, branches),
}

export default banks