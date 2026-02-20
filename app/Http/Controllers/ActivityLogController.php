<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $model = $request->get('model');
        $user = $request->get('user');
        $date_from = $request->get('date_from');
        $date_to = $request->get('date_to');

        $activities = Activity::with(['causer', 'subject'])
            ->when($search, function ($query) use ($search) {
                $query->where('description', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%");
            })
            ->when($model, function ($query) use ($model) {
                $query->where('subject_type', 'like', "%{$model}%");
            })
            ->when($user, function ($query) use ($user) {
                $query->whereHas('causer', function ($q) use ($user) {
                    $q->where('name', 'like', "%{$user}%")
                        ->orWhere('email', 'like', "%{$user}%");
                });
            })
            ->when($date_from, function ($query) use ($date_from) {
                $query->whereDate('created_at', '>=', $date_from);
            })
            ->when($date_to, function ($query) use ($date_to) {
                $query->whereDate('created_at', '<=', $date_to);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        /** @phpstan-ignore-next-line */
        $activities->through(function (\Spatie\Activitylog\Models\Activity $activity) {
            return [
                'id' => $activity->id,
                'description' => $activity->description,
                'event' => $activity->event,
                'subject_type' => $activity->subject_type ? class_basename($activity->subject_type) : null,
                'subject_id' => $activity->subject_id,
                'causer_name' => $activity->causer?->name,
                'causer_email' => $activity->causer?->email,
                'changes' => $activity->changes(),
                'created_at' => $activity->created_at->format('d/m/Y H:i'),
                'properties' => $activity->properties,
            ];
        });

        return Inertia::render('ActivityLog/Index', [
            'activities' => $activities,
            'filters' => [
                'search' => $search,
                'model' => $model,
                'user' => $user,
                'date_from' => $date_from,
                'date_to' => $date_to,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($activity_log)
    {
        $activity = \Spatie\Activitylog\Models\Activity::findOrFail($activity_log);

        $changes = $activity->changes();
        $oldValues = $changes['old'] ?? [];
        $newValues = $changes['attributes'] ?? [];

        $data = [
            'activity' => [
                'id' => $activity->id,
                'description' => $activity->description ?: 'لا يوجد وصف',
                'event' => $activity->event ?: 'unknown',
                'subject_type' => $activity->subject_type ? class_basename($activity->subject_type) : 'غير محدد',
                'subject_id' => $activity->subject_id ?: 'غير محدد',
                'causer_name' => $activity->causer?->name ?: null,
                'causer_email' => $activity->causer?->email ?: null,
                'changes' => [
                    'old' => $oldValues,
                    'new' => $newValues,
                ],
                'properties' => $activity->properties ?: [],
                'created_at' => $activity->created_at ? $activity->created_at->format('d/m/Y H:i:s') : now()->format('d/m/Y H:i:s'),
            ],
        ];

        return Inertia::render('ActivityLog/Show', $data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($activity_log)
    {
        $activity = \Spatie\Activitylog\Models\Activity::findOrFail($activity_log);
        $activity->delete();

        return redirect()->route('activity-log.index')
            ->with('success', __('Activity log entry deleted successfully.'));
    }
}
