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
                $sortedResults->forPage($request->page ?? 1, 15),
                $sortedResults->count(),
                15,
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
                ->paginate(15);
        }

        // Load attachmentType relationship for all attachments
        // $attachments->load('attachmentType');

        return $attachments;
    }

    public function createAttachment(Martyr $martyr, array $data, Request $request): Attachment
    {
        $file = $request->file('file');
        $path = $file->store('attachments', 'public');

        return $martyr->attachments()->create([
            'attachment_type' => $data['attachment_type'],
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'description' => $data['description'] ?? null,
        ]);
    }

    public function updateAttachment(Attachment $attachment, array $data, Request $request): Attachment
    {
        $updateData = [
            'attachment_type' => $data['attachment_type'],
            'description' => $data['description'] ?? null,
        ];

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($attachment->file_path);

            $file = $request->file('file');
            $path = $file->store('attachments', 'public');

            $updateData['file_path'] = $path;
            $updateData['original_filename'] = $file->getClientOriginalName();
            $updateData['mime_type'] = $file->getMimeType();
            $updateData['file_size'] = $file->getSize();
        }

        $attachment->update($updateData);

        return $attachment;
    }

    public function deleteAttachment(Attachment $attachment): void
    {
        // Delete file from storage
        Storage::disk('public')->delete($attachment->file_path);

        $attachment->delete();
    }
}
