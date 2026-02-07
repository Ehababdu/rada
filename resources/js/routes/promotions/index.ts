import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import exportMethod9280c6 from './export'
/**
* @see \App\Http\Controllers\PromotionController::index
* @see app/Http/Controllers/PromotionController.php:21
* @route '/promotions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/promotions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::index
* @see app/Http/Controllers/PromotionController.php:21
* @route '/promotions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::index
* @see app/Http/Controllers/PromotionController.php:21
* @route '/promotions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::index
* @see app/Http/Controllers/PromotionController.php:21
* @route '/promotions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PromotionController::create
* @see app/Http/Controllers/PromotionController.php:94
* @route '/promotions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/promotions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::create
* @see app/Http/Controllers/PromotionController.php:94
* @route '/promotions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::create
* @see app/Http/Controllers/PromotionController.php:94
* @route '/promotions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::create
* @see app/Http/Controllers/PromotionController.php:94
* @route '/promotions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PromotionController::store
* @see app/Http/Controllers/PromotionController.php:172
* @route '/promotions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/promotions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PromotionController::store
* @see app/Http/Controllers/PromotionController.php:172
* @route '/promotions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::store
* @see app/Http/Controllers/PromotionController.php:172
* @route '/promotions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PromotionController::show
* @see app/Http/Controllers/PromotionController.php:210
* @route '/promotions/{promotion}'
*/
export const show = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/promotions/{promotion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::show
* @see app/Http/Controllers/PromotionController.php:210
* @route '/promotions/{promotion}'
*/
show.url = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { promotion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            promotion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion: typeof args.promotion === 'object'
        ? args.promotion.id
        : args.promotion,
    }

    return show.definition.url
            .replace('{promotion}', parsedArgs.promotion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::show
* @see app/Http/Controllers/PromotionController.php:210
* @route '/promotions/{promotion}'
*/
show.get = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::show
* @see app/Http/Controllers/PromotionController.php:210
* @route '/promotions/{promotion}'
*/
show.head = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PromotionController::edit
* @see app/Http/Controllers/PromotionController.php:235
* @route '/promotions/{promotion}/edit'
*/
export const edit = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/promotions/{promotion}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::edit
* @see app/Http/Controllers/PromotionController.php:235
* @route '/promotions/{promotion}/edit'
*/
edit.url = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { promotion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            promotion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion: typeof args.promotion === 'object'
        ? args.promotion.id
        : args.promotion,
    }

    return edit.definition.url
            .replace('{promotion}', parsedArgs.promotion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::edit
* @see app/Http/Controllers/PromotionController.php:235
* @route '/promotions/{promotion}/edit'
*/
edit.get = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::edit
* @see app/Http/Controllers/PromotionController.php:235
* @route '/promotions/{promotion}/edit'
*/
edit.head = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PromotionController::update
* @see app/Http/Controllers/PromotionController.php:318
* @route '/promotions/{promotion}'
*/
export const update = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/promotions/{promotion}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PromotionController::update
* @see app/Http/Controllers/PromotionController.php:318
* @route '/promotions/{promotion}'
*/
update.url = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { promotion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            promotion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion: typeof args.promotion === 'object'
        ? args.promotion.id
        : args.promotion,
    }

    return update.definition.url
            .replace('{promotion}', parsedArgs.promotion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::update
* @see app/Http/Controllers/PromotionController.php:318
* @route '/promotions/{promotion}'
*/
update.put = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PromotionController::update
* @see app/Http/Controllers/PromotionController.php:318
* @route '/promotions/{promotion}'
*/
update.patch = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PromotionController::destroy
* @see app/Http/Controllers/PromotionController.php:426
* @route '/promotions/{promotion}'
*/
export const destroy = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/promotions/{promotion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PromotionController::destroy
* @see app/Http/Controllers/PromotionController.php:426
* @route '/promotions/{promotion}'
*/
destroy.url = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { promotion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            promotion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion: typeof args.promotion === 'object'
        ? args.promotion.id
        : args.promotion,
    }

    return destroy.definition.url
            .replace('{promotion}', parsedArgs.promotion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::destroy
* @see app/Http/Controllers/PromotionController.php:426
* @route '/promotions/{promotion}'
*/
destroy.delete = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PromotionController::confirm
* @see app/Http/Controllers/PromotionController.php:379
* @route '/promotions/{promotion}/confirm'
*/
export const confirm = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/promotions/{promotion}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PromotionController::confirm
* @see app/Http/Controllers/PromotionController.php:379
* @route '/promotions/{promotion}/confirm'
*/
confirm.url = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { promotion: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            promotion: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion: typeof args.promotion === 'object'
        ? args.promotion.id
        : args.promotion,
    }

    return confirm.definition.url
            .replace('{promotion}', parsedArgs.promotion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::confirm
* @see app/Http/Controllers/PromotionController.php:379
* @route '/promotions/{promotion}/confirm'
*/
confirm.post = (args: { promotion: number | { id: number } } | [promotion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PromotionController::exportMethod
* @see app/Http/Controllers/PromotionController.php:449
* @route '/promotions/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/promotions/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromotionController::exportMethod
* @see app/Http/Controllers/PromotionController.php:449
* @route '/promotions/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromotionController::exportMethod
* @see app/Http/Controllers/PromotionController.php:449
* @route '/promotions/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PromotionController::exportMethod
* @see app/Http/Controllers/PromotionController.php:449
* @route '/promotions/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

const promotions = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    confirm: Object.assign(confirm, confirm),
    export: Object.assign(exportMethod, exportMethod9280c6),
}

export default promotions