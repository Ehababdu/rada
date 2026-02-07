import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import exportMethod9280c6 from './export'
import attachments from './attachments'
/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:21
* @route '/martyrs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/martyrs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:21
* @route '/martyrs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:21
* @route '/martyrs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::index
* @see app/Http/Controllers/MartyrController.php:21
* @route '/martyrs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::create
* @see app/Http/Controllers/MartyrController.php:43
* @route '/martyrs/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/martyrs/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::create
* @see app/Http/Controllers/MartyrController.php:43
* @route '/martyrs/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::create
* @see app/Http/Controllers/MartyrController.php:43
* @route '/martyrs/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::create
* @see app/Http/Controllers/MartyrController.php:43
* @route '/martyrs/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::store
* @see app/Http/Controllers/MartyrController.php:61
* @route '/martyrs'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/martyrs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MartyrController::store
* @see app/Http/Controllers/MartyrController.php:61
* @route '/martyrs'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::store
* @see app/Http/Controllers/MartyrController.php:61
* @route '/martyrs'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MartyrController::show
* @see app/Http/Controllers/MartyrController.php:75
* @route '/martyrs/{martyr}'
*/
export const show = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::show
* @see app/Http/Controllers/MartyrController.php:75
* @route '/martyrs/{martyr}'
*/
show.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return show.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::show
* @see app/Http/Controllers/MartyrController.php:75
* @route '/martyrs/{martyr}'
*/
show.get = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::show
* @see app/Http/Controllers/MartyrController.php:75
* @route '/martyrs/{martyr}'
*/
show.head = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::edit
* @see app/Http/Controllers/MartyrController.php:101
* @route '/martyrs/{martyr}/edit'
*/
export const edit = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::edit
* @see app/Http/Controllers/MartyrController.php:101
* @route '/martyrs/{martyr}/edit'
*/
edit.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return edit.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::edit
* @see app/Http/Controllers/MartyrController.php:101
* @route '/martyrs/{martyr}/edit'
*/
edit.get = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::edit
* @see app/Http/Controllers/MartyrController.php:101
* @route '/martyrs/{martyr}/edit'
*/
edit.head = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::update
* @see app/Http/Controllers/MartyrController.php:121
* @route '/martyrs/{martyr}'
*/
export const update = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/martyrs/{martyr}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MartyrController::update
* @see app/Http/Controllers/MartyrController.php:121
* @route '/martyrs/{martyr}'
*/
update.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return update.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::update
* @see app/Http/Controllers/MartyrController.php:121
* @route '/martyrs/{martyr}'
*/
update.put = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MartyrController::update
* @see app/Http/Controllers/MartyrController.php:121
* @route '/martyrs/{martyr}'
*/
update.patch = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MartyrController::destroy
* @see app/Http/Controllers/MartyrController.php:148
* @route '/martyrs/{martyr}'
*/
export const destroy = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/martyrs/{martyr}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MartyrController::destroy
* @see app/Http/Controllers/MartyrController.php:148
* @route '/martyrs/{martyr}'
*/
destroy.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return destroy.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::destroy
* @see app/Http/Controllers/MartyrController.php:148
* @route '/martyrs/{martyr}'
*/
destroy.delete = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MartyrController::print
* @see app/Http/Controllers/MartyrController.php:88
* @route '/martyrs/{martyr}/print'
*/
export const print = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MartyrController::print
* @see app/Http/Controllers/MartyrController.php:88
* @route '/martyrs/{martyr}/print'
*/
print.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return print.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::print
* @see app/Http/Controllers/MartyrController.php:88
* @route '/martyrs/{martyr}/print'
*/
print.get = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MartyrController::print
* @see app/Http/Controllers/MartyrController.php:88
* @route '/martyrs/{martyr}/print'
*/
print.head = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MartyrController::exportMethod
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/martyrs/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MartyrController::exportMethod
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::exportMethod
* @see app/Http/Controllers/MartyrController.php:161
* @route '/martyrs/export'
*/
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MartyrController::updateStatus
* @see app/Http/Controllers/MartyrController.php:137
* @route '/martyrs/{martyr}/status'
*/
export const updateStatus = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/martyrs/{martyr}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MartyrController::updateStatus
* @see app/Http/Controllers/MartyrController.php:137
* @route '/martyrs/{martyr}/status'
*/
updateStatus.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { martyr: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { martyr: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
    }

    return updateStatus.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MartyrController::updateStatus
* @see app/Http/Controllers/MartyrController.php:137
* @route '/martyrs/{martyr}/status'
*/
updateStatus.patch = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

const martyrs = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    print: Object.assign(print, print),
    export: Object.assign(exportMethod, exportMethod9280c6),
    updateStatus: Object.assign(updateStatus, updateStatus),
    attachments: Object.assign(attachments, attachments),
}

export default martyrs