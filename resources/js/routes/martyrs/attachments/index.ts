import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AttachmentController::index
* @see app/Http/Controllers/AttachmentController.php:27
* @route '/martyrs/{martyr}/attachments'
*/
export const index = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/attachments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentController::index
* @see app/Http/Controllers/AttachmentController.php:27
* @route '/martyrs/{martyr}/attachments'
*/
index.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::index
* @see app/Http/Controllers/AttachmentController.php:27
* @route '/martyrs/{martyr}/attachments'
*/
index.get = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentController::index
* @see app/Http/Controllers/AttachmentController.php:27
* @route '/martyrs/{martyr}/attachments'
*/
index.head = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentController::create
* @see app/Http/Controllers/AttachmentController.php:93
* @route '/martyrs/{martyr}/attachments/create'
*/
export const create = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/attachments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentController::create
* @see app/Http/Controllers/AttachmentController.php:93
* @route '/martyrs/{martyr}/attachments/create'
*/
create.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::create
* @see app/Http/Controllers/AttachmentController.php:93
* @route '/martyrs/{martyr}/attachments/create'
*/
create.get = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentController::create
* @see app/Http/Controllers/AttachmentController.php:93
* @route '/martyrs/{martyr}/attachments/create'
*/
create.head = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentController::store
* @see app/Http/Controllers/AttachmentController.php:104
* @route '/martyrs/{martyr}/attachments'
*/
export const store = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/martyrs/{martyr}/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttachmentController::store
* @see app/Http/Controllers/AttachmentController.php:104
* @route '/martyrs/{martyr}/attachments'
*/
store.url = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::store
* @see app/Http/Controllers/AttachmentController.php:104
* @route '/martyrs/{martyr}/attachments'
*/
store.post = (args: { martyr: number | { id: number } } | [martyr: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttachmentController::show
* @see app/Http/Controllers/AttachmentController.php:141
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
export const show = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentController::show
* @see app/Http/Controllers/AttachmentController.php:141
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
show.url = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
            attachment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
        attachment: typeof args.attachment === 'object'
        ? args.attachment.id
        : args.attachment,
    }

    return show.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::show
* @see app/Http/Controllers/AttachmentController.php:141
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
show.get = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentController::show
* @see app/Http/Controllers/AttachmentController.php:141
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
show.head = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentController::edit
* @see app/Http/Controllers/AttachmentController.php:158
* @route '/martyrs/{martyr}/attachments/{attachment}/edit'
*/
export const edit = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/martyrs/{martyr}/attachments/{attachment}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentController::edit
* @see app/Http/Controllers/AttachmentController.php:158
* @route '/martyrs/{martyr}/attachments/{attachment}/edit'
*/
edit.url = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
            attachment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
        attachment: typeof args.attachment === 'object'
        ? args.attachment.id
        : args.attachment,
    }

    return edit.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::edit
* @see app/Http/Controllers/AttachmentController.php:158
* @route '/martyrs/{martyr}/attachments/{attachment}/edit'
*/
edit.get = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentController::edit
* @see app/Http/Controllers/AttachmentController.php:158
* @route '/martyrs/{martyr}/attachments/{attachment}/edit'
*/
edit.head = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentController::update
* @see app/Http/Controllers/AttachmentController.php:175
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
export const update = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/martyrs/{martyr}/attachments/{attachment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AttachmentController::update
* @see app/Http/Controllers/AttachmentController.php:175
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
update.url = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
            attachment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
        attachment: typeof args.attachment === 'object'
        ? args.attachment.id
        : args.attachment,
    }

    return update.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::update
* @see app/Http/Controllers/AttachmentController.php:175
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
update.put = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AttachmentController::update
* @see app/Http/Controllers/AttachmentController.php:175
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
update.patch = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AttachmentController::destroy
* @see app/Http/Controllers/AttachmentController.php:206
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
export const destroy = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/martyrs/{martyr}/attachments/{attachment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttachmentController::destroy
* @see app/Http/Controllers/AttachmentController.php:206
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
destroy.url = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            martyr: args[0],
            attachment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        martyr: typeof args.martyr === 'object'
        ? args.martyr.id
        : args.martyr,
        attachment: typeof args.attachment === 'object'
        ? args.attachment.id
        : args.attachment,
    }

    return destroy.definition.url
            .replace('{martyr}', parsedArgs.martyr.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::destroy
* @see app/Http/Controllers/AttachmentController.php:206
* @route '/martyrs/{martyr}/attachments/{attachment}'
*/
destroy.delete = (args: { martyr: number | { id: number }, attachment: number | { id: number } } | [martyr: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const attachments = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default attachments