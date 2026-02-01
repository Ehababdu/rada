<?php

namespace App\Services;

use App\Models\Attachment;
use App\Models\Martyr;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class AttachmentService
{
    public function getAttachments(Martyr $martyr, Request $request): LengthAwarePaginator
    {
        $search = $request->get('search');
        $type = $request->get('type');
        $perPage = $request->get('per_page', 15);

        if ($search) {
            // Use Scout for search, then filter by martyr
            $searchResults = Attachment::search($search)->get();
            $filteredResults = $searchResults->filter(function ($attachment) use ($martyr) {
                return $attachment->martyr_id === $martyr->id;
            });

            if ($type) {
                $filteredResults = $filteredResults->filter(function ($attachment) use ($type) {
                    return $attachment->attachment_type === $type;
                });
            }

            $sortedResults = $filteredResults->sortByDesc('created_at');
            $attachments = new \Illuminate\Pagination\LengthAwarePaginator(
                $sortedResults->forPage($request->page ?? 1, $perPage),
                $sortedResults->count(),
                $perPage,
                $request->page ?? 1,
                ['path' => $request->url(), 'pageName' => 'page']
            );
        } else {
            // Use regular query for listing
            $attachments = $martyr->attachments()
                ->when($type, function ($query, $type) {
                    $query->where('attachment_type', $type);
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
        }

        // Load attachmentType relationship for all attachments
        $attachments->load('attachmentType');

        return $attachments;
    }

    public function createAttachment(Martyr $martyr, array $data, Request $request): Attachment
    {
        $attachment = $martyr->attachments()->create([
            'attachment_type' => $data['attachment_type'],
            'description' => $data['description'] ?? null,
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            $attachment->addMediaFromRequest('file')
                ->usingName($file->getClientOriginalName())
                ->usingFileName($file->getClientOriginalName())
                ->toMediaCollection('attachments');

            // Update file metadata
            $media = $attachment->getFirstMedia('attachments');
            if ($media) {
                $attachment->update([
                    'file_path' => $media->getPath(),
                    'original_filename' => $media->name,
                    'mime_type' => $media->mime_type,
                    'file_size' => $media->size,
                ]);
            }
        }

        return $attachment;
    }

    public function updateAttachment(Attachment $attachment, array $data, Request $request): Attachment
    {
        $updateData = [
            'attachment_type' => $data['attachment_type'],
            'description' => $data['description'] ?? null,
        ];

        if ($request->hasFile('file')) {
            // Clear existing media
            $attachment->clearMediaCollection('attachments');

            // Add new file
            $file = $request->file('file');
            $attachment->addMediaFromRequest('file')
                ->usingName($file->getClientOriginalName())
                ->usingFileName($file->getClientOriginalName())
                ->toMediaCollection('attachments');

            // Update file metadata
            $media = $attachment->getFirstMedia('attachments');
            if ($media) {
                $updateData['file_path'] = $media->getPath();
                $updateData['original_filename'] = $media->name;
                $updateData['mime_type'] = $media->mime_type;
                $updateData['file_size'] = $media->size;
            }
        }

        $attachment->update($updateData);

        return $attachment;
    }

    public function deleteAttachment(Attachment $attachment): void
    {
        // Delete media files
        $attachment->clearMediaCollection('attachments');

        $attachment->delete();
    }
}
