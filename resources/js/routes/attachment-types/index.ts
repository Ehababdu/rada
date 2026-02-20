import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AttachmentTypeController::index
* @see app/Http/Controllers/AttachmentTypeController.php:14
* @route '/attachment-types'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attachment-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::index
* @see app/Http/Controllers/AttachmentTypeController.php:14
* @route '/attachment-types'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::index
* @see app/Http/Controllers/AttachmentTypeController.php:14
* @route '/attachment-types'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::index
* @see app/Http/Controllers/AttachmentTypeController.php:14
* @route '/attachment-types'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::create
* @see app/Http/Controllers/AttachmentTypeController.php:30
* @route '/attachment-types/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/attachment-types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::create
* @see app/Http/Controllers/AttachmentTypeController.php:30
* @route '/attachment-types/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::create
* @see app/Http/Controllers/AttachmentTypeController.php:30
* @route '/attachment-types/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::create
* @see app/Http/Controllers/AttachmentTypeController.php:30
* @route '/attachment-types/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::store
* @see app/Http/Controllers/AttachmentTypeController.php:42
* @route '/attachment-types'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attachment-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::store
* @see app/Http/Controllers/AttachmentTypeController.php:42
* @route '/attachment-types'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::store
* @see app/Http/Controllers/AttachmentTypeController.php:42
* @route '/attachment-types'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::show
* @see app/Http/Controllers/AttachmentTypeController.php:61
* @route '/attachment-types/{attachment_type}'
*/
export const show = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/attachment-types/{attachment_type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::show
* @see app/Http/Controllers/AttachmentTypeController.php:61
* @route '/attachment-types/{attachment_type}'
*/
show.url = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment_type: args }
    }

    if (Array.isArray(args)) {
        args = {
            attachment_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attachment_type: args.attachment_type,
    }

    return show.definition.url
            .replace('{attachment_type}', parsedArgs.attachment_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::show
* @see app/Http/Controllers/AttachmentTypeController.php:61
* @route '/attachment-types/{attachment_type}'
*/
show.get = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::show
* @see app/Http/Controllers/AttachmentTypeController.php:61
* @route '/attachment-types/{attachment_type}'
*/
show.head = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::edit
* @see app/Http/Controllers/AttachmentTypeController.php:75
* @route '/attachment-types/{attachment_type}/edit'
*/
export const edit = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/attachment-types/{attachment_type}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::edit
* @see app/Http/Controllers/AttachmentTypeController.php:75
* @route '/attachment-types/{attachment_type}/edit'
*/
edit.url = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment_type: args }
    }

    if (Array.isArray(args)) {
        args = {
            attachment_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attachment_type: args.attachment_type,
    }

    return edit.definition.url
            .replace('{attachment_type}', parsedArgs.attachment_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::edit
* @see app/Http/Controllers/AttachmentTypeController.php:75
* @route '/attachment-types/{attachment_type}/edit'
*/
edit.get = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::edit
* @see app/Http/Controllers/AttachmentTypeController.php:75
* @route '/attachment-types/{attachment_type}/edit'
*/
edit.head = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::update
* @see app/Http/Controllers/AttachmentTypeController.php:89
* @route '/attachment-types/{attachment_type}'
*/
export const update = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/attachment-types/{attachment_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::update
* @see app/Http/Controllers/AttachmentTypeController.php:89
* @route '/attachment-types/{attachment_type}'
*/
update.url = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment_type: args }
    }

    if (Array.isArray(args)) {
        args = {
            attachment_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attachment_type: args.attachment_type,
    }

    return update.definition.url
            .replace('{attachment_type}', parsedArgs.attachment_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::update
* @see app/Http/Controllers/AttachmentTypeController.php:89
* @route '/attachment-types/{attachment_type}'
*/
update.put = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::update
* @see app/Http/Controllers/AttachmentTypeController.php:89
* @route '/attachment-types/{attachment_type}'
*/
update.patch = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AttachmentTypeController::destroy
* @see app/Http/Controllers/AttachmentTypeController.php:108
* @route '/attachment-types/{attachment_type}'
*/
export const destroy = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attachment-types/{attachment_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttachmentTypeController::destroy
* @see app/Http/Controllers/AttachmentTypeController.php:108
* @route '/attachment-types/{attachment_type}'
*/
destroy.url = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment_type: args }
    }

    if (Array.isArray(args)) {
        args = {
            attachment_type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attachment_type: args.attachment_type,
    }

    return destroy.definition.url
            .replace('{attachment_type}', parsedArgs.attachment_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentTypeController::destroy
* @see app/Http/Controllers/AttachmentTypeController.php:108
* @route '/attachment-types/{attachment_type}'
*/
destroy.delete = (args: { attachment_type: string | number } | [attachment_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const attachmentTypes = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default attachmentTypes