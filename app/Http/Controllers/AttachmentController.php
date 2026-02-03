<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttachmentRequest;
use App\Http\Requests\UpdateAttachmentRequest;
use App\Models\Attachment;
use App\Models\AttachmentType;
use App\Models\Martyr;
use App\Services\AttachmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttachmentController extends Controller
{
    protected AttachmentService $attachmentService;

    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Display a listing of attachments for a specific martyr.
     */
    public function index(Request $request, Martyr $martyr)
    {
        $attachments = $this->attachmentService->getAttachments($martyr, $request);
        $attachmentTypes = AttachmentType::orderBy('label')->get(['id', 'label'])->pluck('label', 'id');

        // Calculate attachment statistics
        $allAttachments = $martyr->attachments()->with('attachmentType')->get();
        $uploadedCount = 0;
        $notUploadedTypes = [];

        foreach ($attachmentTypes as $typeId => $typeLabel) {
            $hasAttachment = $allAttachments->contains(function ($attachment) use ($typeId) {
                return $attachment->attachment_type == $typeId &&
                       $attachment->file_path &&
                       trim($attachment->file_path) !== '';
            });

            if ($hasAttachment) {
                $uploadedCount++;
            } else {
                $notUploadedTypes[] = [
                    'id' => (int) $typeId,
                    'attachment_type' => [
                        'id' => (int) $typeId,
                        'label' => $typeLabel,
                    ],
                    'file_path' => null,
                    'original_filename' => null,
                    'mime_type' => null,
                    'file_size' => null,
                    'description' => null,
                    'created_at' => null,
                    'updated_at' => null,
                ];
            }
        }

        $attachmentStats = [
            'uploaded' => $allAttachments->filter(function ($attachment) {
                return $attachment->file_path && trim($attachment->file_path) !== '';
            })->values(),
            'notUploaded' => $notUploadedTypes,
            'uploadedCount' => $uploadedCount,
            'notUploadedCount' => count($notUploadedTypes),
            'total' => count($attachmentTypes),
        ];

        // Add attachment_type_label to each attachment
        $attachments->getCollection()->transform(function ($attachment) use ($attachmentTypes) {
            $attachment->attachment_type_label = $attachmentTypes[$attachment->attachment_type] ?? $attachment->attachment_type;

            return $attachment;
        });

        return Inertia::render('Attachments/Index', [
            'martyr' => $martyr,
            'attachments' => $attachments,
            'attachmentTypes' => $attachmentTypes,
            'attachmentStats' => $attachmentStats,
            'filters' => $request->only(['search', 'type', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new attachment.
     */
    public function create(Martyr $martyr)
    {
        return Inertia::render('Attachments/Create', [
            'martyr' => $martyr,
            'attachmentTypes' => AttachmentType::orderBy('label')->get(['id', 'label'])->pluck('label', 'id'),
        ]);
    }

    /**
     * Store a newly created attachment in storage.
     */
    public function store(StoreAttachmentRequest $request, Martyr $martyr)
    {
        // Debug: dump incoming payload to locate upload problem.
        // Triggered when ?dd=1 is present.
        if ($request->query('dd') === '1') {
            dd([
                'validated' => $request->validated(),
                'all' => $request->all(),
                'files' => $request->allFiles(),
                'headers' => $request->headers->all(),
                'content_type' => $request->header('content-type'),
            ]);
        }

        $attachment = $this->attachmentService->createAttachment($martyr, $request->validated(), $request);

        return redirect()->route('martyrs.attachments.index', $martyr)->with('success', 'تم تحميل المرفق بنجاح.');
    }

    /**
     * Display the specified attachment.
     */
    public function show(Martyr $martyr, Attachment $attachment)
    {
        // Ensure attachment belongs to martyr
        if ($attachment->martyr_id !== $martyr->id) {
            abort(404);
        }

        return Inertia::render('Attachments/Show', [
            'martyr' => $martyr,
            'attachment' => $attachment,
            'attachmentTypes' => AttachmentType::orderBy('label')->get(['id', 'label'])->pluck('label', 'id'),
        ]);
    }

    /**
     * Show the form for editing the specified attachment.
     */
    public function edit(Martyr $martyr, Attachment $attachment)
    {
        // Ensure attachment belongs to martyr
        if ($attachment->martyr_id !== $martyr->id) {
            abort(404);
        }

        return Inertia::render('Attachments/Edit', [
            'martyr' => $martyr,
            'attachment' => $attachment,
            'attachmentTypes' => AttachmentType::orderBy('label')->get(['id', 'label'])->pluck('label', 'id'),
        ]);
    }

    /**
     * Update the specified attachment in storage.
     */
    public function update(UpdateAttachmentRequest $request, Martyr $martyr, Attachment $attachment)
    {
        // Ensure attachment belongs to martyr
        if ($attachment->martyr_id !== $martyr->id) {
            abort(404);
        }

        $this->attachmentService->updateAttachment($attachment, $request->validated(), $request);

        return redirect()->route('martyrs.attachments.index', $martyr)
            ->with('success', 'تم تحديث المرفق بنجاح');
    }

    /**
     * Remove the specified attachment from storage.
     */
    public function destroy(Martyr $martyr, Attachment $attachment)
    {
        // Ensure attachment belongs to martyr
        if ($attachment->martyr_id !== $martyr->id) {
            abort(404);
        }

        $this->attachmentService->deleteAttachment($attachment);

        return redirect()->route('martyrs.attachments.index', $martyr)
            ->with('success', 'تم حذف المرفق بنجاح');
    }
}
