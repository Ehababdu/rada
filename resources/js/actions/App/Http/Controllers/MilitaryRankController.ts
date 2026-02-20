import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MilitaryRankController::apiIndex
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/military-ranks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::apiIndex
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::apiIndex
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::apiIndex
* @see app/Http/Controllers/MilitaryRankController.php:128
* @route '/api/military-ranks'
*/
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:16
* @route '/military-ranks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/military-ranks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:16
* @route '/military-ranks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:16
* @route '/military-ranks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::index
* @see app/Http/Controllers/MilitaryRankController.php:16
* @route '/military-ranks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::create
* @see app/Http/Controllers/MilitaryRankController.php:47
* @route '/military-ranks/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/military-ranks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::create
* @see app/Http/Controllers/MilitaryRankController.php:47
* @route '/military-ranks/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::create
* @see app/Http/Controllers/MilitaryRankController.php:47
* @route '/military-ranks/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::create
* @see app/Http/Controllers/MilitaryRankController.php:47
* @route '/military-ranks/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::store
* @see app/Http/Controllers/MilitaryRankController.php:55
* @route '/military-ranks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/military-ranks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::store
* @see app/Http/Controllers/MilitaryRankController.php:55
* @route '/military-ranks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::store
* @see app/Http/Controllers/MilitaryRankController.php:55
* @route '/military-ranks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::show
* @see app/Http/Controllers/MilitaryRankController.php:73
* @route '/military-ranks/{military_rank}'
*/
export const show = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/military-ranks/{military_rank}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::show
* @see app/Http/Controllers/MilitaryRankController.php:73
* @route '/military-ranks/{military_rank}'
*/
show.url = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { military_rank: args }
    }

    if (Array.isArray(args)) {
        args = {
            military_rank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        military_rank: args.military_rank,
    }

    return show.definition.url
            .replace('{military_rank}', parsedArgs.military_rank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::show
* @see app/Http/Controllers/MilitaryRankController.php:73
* @route '/military-ranks/{military_rank}'
*/
show.get = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::show
* @see app/Http/Controllers/MilitaryRankController.php:73
* @route '/military-ranks/{military_rank}'
*/
show.head = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::edit
* @see app/Http/Controllers/MilitaryRankController.php:83
* @route '/military-ranks/{military_rank}/edit'
*/
export const edit = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/military-ranks/{military_rank}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::edit
* @see app/Http/Controllers/MilitaryRankController.php:83
* @route '/military-ranks/{military_rank}/edit'
*/
edit.url = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { military_rank: args }
    }

    if (Array.isArray(args)) {
        args = {
            military_rank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        military_rank: args.military_rank,
    }

    return edit.definition.url
            .replace('{military_rank}', parsedArgs.military_rank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::edit
* @see app/Http/Controllers/MilitaryRankController.php:83
* @route '/military-ranks/{military_rank}/edit'
*/
edit.get = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::edit
* @see app/Http/Controllers/MilitaryRankController.php:83
* @route '/military-ranks/{military_rank}/edit'
*/
edit.head = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::update
* @see app/Http/Controllers/MilitaryRankController.php:93
* @route '/military-ranks/{military_rank}'
*/
export const update = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/military-ranks/{military_rank}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::update
* @see app/Http/Controllers/MilitaryRankController.php:93
* @route '/military-ranks/{military_rank}'
*/
update.url = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { military_rank: args }
    }

    if (Array.isArray(args)) {
        args = {
            military_rank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        military_rank: args.military_rank,
    }

    return update.definition.url
            .replace('{military_rank}', parsedArgs.military_rank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::update
* @see app/Http/Controllers/MilitaryRankController.php:93
* @route '/military-ranks/{military_rank}'
*/
update.put = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::update
* @see app/Http/Controllers/MilitaryRankController.php:93
* @route '/military-ranks/{military_rank}'
*/
update.patch = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MilitaryRankController::destroy
* @see app/Http/Controllers/MilitaryRankController.php:111
* @route '/military-ranks/{military_rank}'
*/
export const destroy = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/military-ranks/{military_rank}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MilitaryRankController::destroy
* @see app/Http/Controllers/MilitaryRankController.php:111
* @route '/military-ranks/{military_rank}'
*/
destroy.url = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { military_rank: args }
    }

    if (Array.isArray(args)) {
        args = {
            military_rank: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        military_rank: args.military_rank,
    }

    return destroy.definition.url
            .replace('{military_rank}', parsedArgs.military_rank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MilitaryRankController::destroy
* @see app/Http/Controllers/MilitaryRankController.php:111
* @route '/military-ranks/{military_rank}'
*/
destroy.delete = (args: { military_rank: string | number } | [military_rank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MilitaryRankController = { apiIndex, index, create, store, show, edit, update, destroy }

export default MilitaryRankController