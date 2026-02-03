<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->get('search');
        $type = $request->get('type');
        $status = $request->get('status'); // read, unread

        $alerts = Alert::forUser(auth()->id())
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            })
            ->when($type && $type !== 'all', function ($query) use ($type) {
                $query->where('type', $type);
            })
            ->when($status === 'read', function ($query) {
                $query->read();
            })
            ->when($status === 'unread', function ($query) {
                $query->unread();
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $alerts->through(function ($alert) {
            return [
                'id' => $alert->id,
                'title' => $alert->title,
                'message' => $alert->message,
                'type' => $alert->type,
                'read_at' => $alert->read_at?->format('d/m/Y H:i'),
                'created_at' => $alert->created_at->format('d/m/Y H:i'),
                'is_read' => $alert->isRead(),
            ];
        });

        return Inertia::render('Alerts/Index', [
            'alerts' => $alerts,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Alert $alert): \Inertia\Response
    {
        // Ensure user can only view their own alerts
        if ($alert->user_id !== auth()->id()) {
            abort(403);
        }

        // Mark as read if not already read
        if (! $alert->isRead()) {
            $alert->markAsRead();
        }

        return Inertia::render('Alerts/Show', [
            'alert' => [
                'id' => $alert->id,
                'title' => $alert->title,
                'message' => $alert->message,
                'type' => $alert->type,
                'data' => $alert->data,
                'read_at' => $alert->read_at?->format('d/m/Y H:i'),
                'created_at' => $alert->created_at->format('d/m/Y H:i'),
                'is_read' => $alert->isRead(),
            ],
        ]);
    }

    /**
     * Mark alert as read.
     */
    public function markAsRead(Alert $alert): RedirectResponse
    {
        if ($alert->user_id !== auth()->id()) {
            abort(403);
        }

        $alert->markAsRead();

        return redirect()->back()
            ->with('success', __('Alert marked as read.'));
    }

    /**
     * Mark alert as unread.
     */
    public function markAsUnread(Alert $alert): RedirectResponse
    {
        if ($alert->user_id !== auth()->id()) {
            abort(403);
        }

        $alert->markAsUnread();

        return redirect()->back()
            ->with('success', __('Alert marked as unread.'));
    }

    /**
     * Mark all alerts as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        Alert::forUser(auth()->id())
            ->unread()
            ->update(['read_at' => now()]);

        return redirect()->back()
            ->with('success', __('All alerts marked as read.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alert $alert): RedirectResponse
    {
        if ($alert->user_id !== auth()->id()) {
            abort(403);
        }

        $alert->delete();

        return redirect()->route('alerts.index')
            ->with('success', __('Alert deleted successfully.'));
    }
}
