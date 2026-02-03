<?php

namespace App\Http\Controllers;

use App\Models\AttachmentType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AttachmentTypeController extends Controller
{
    /**
     * Display a listing of attachment types.
     */
    public function index()
    {
        if (!auth()->user()->can('attachment-types.view')) {
            abort(403, 'Unauthorized');
        }

        $attachmentTypes = AttachmentType::orderBy('label')->paginate(15);

        return Inertia::render('AttachmentTypes/Index', [
            'attachmentTypes' => $attachmentTypes,
        ]);
    }

    /**
     * Show the form for creating a new attachment type.
     */
    public function create()
    {
        if (!auth()->user()->can('attachment-types.create')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('AttachmentTypes/Create');
    }

    /**
     * Store a newly created attachment type in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->can('attachment-types.create')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'label' => ['required', 'string'],
        ]);

        AttachmentType::create($request->only(['label']));

        return redirect()->route('attachment-types.index')
            ->with('success', 'تم إضافة نوع المرفق بنجاح');
    }

    /**
     * Display the specified attachment type.
     */
    public function show(AttachmentType $attachmentType)
    {
        if (!auth()->user()->can('attachment-types.view')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('AttachmentTypes/Show', [
            'attachmentType' => $attachmentType,
        ]);
    }

    /**
     * Show the form for editing the specified attachment type.
     */
    public function edit(AttachmentType $attachmentType)
    {
        if (!auth()->user()->can('attachment-types.edit')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('AttachmentTypes/Edit', [
            'attachmentType' => $attachmentType,
        ]);
    }

    /**
     * Update the specified attachment type in storage.
     */
    public function update(Request $request, AttachmentType $attachmentType)
    {
        if (!auth()->user()->can('attachment-types.edit')) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'label' => ['required', 'string'],
        ]);

        $attachmentType->update($request->only(['label']));

        return redirect()->route('attachment-types.index')
            ->with('success', 'تم تحديث نوع المرفق بنجاح');
    }

    /**
     * Remove the specified attachment type from storage.
     */
    public function destroy(AttachmentType $attachmentType)
    {
        if (!auth()->user()->can('attachment-types.delete')) {
            abort(403, 'Unauthorized');
        }

        $attachmentType->delete();

        return redirect()->route('attachment-types.index')
            ->with('success', 'تم حذف نوع المرفق بنجاح');
    }
}
