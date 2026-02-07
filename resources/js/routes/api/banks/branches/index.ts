import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:145
* @route '/api/banks/{bank}/branches'
*/
export const index = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/banks/{bank}/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:145
* @route '/api/banks/{bank}/branches'
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
* @see app/Http/Controllers/BranchController.php:145
* @route '/api/banks/{bank}/branches'
*/
index.get = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BranchController::index
* @see app/Http/Controllers/BranchController.php:145
* @route '/api/banks/{bank}/branches'
*/
index.head = (args: { bank: number | { id: number } } | [bank: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

const branches = {
    index: Object.assign(index, index),
}

export default branches