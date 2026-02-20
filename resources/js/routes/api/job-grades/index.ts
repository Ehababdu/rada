import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\JobGradeController::index
* @see app/Http/Controllers/JobGradeController.php:191
* @route '/api/job-grades'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/job-grades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobGradeController::index
* @see app/Http/Controllers/JobGradeController.php:191
* @route '/api/job-grades'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobGradeController::index
* @see app/Http/Controllers/JobGradeController.php:191
* @route '/api/job-grades'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobGradeController::index
* @see app/Http/Controllers/JobGradeController.php:191
* @route '/api/job-grades'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const jobGrades = {
    index: Object.assign(index, index),
}

export default jobGrades