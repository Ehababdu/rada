<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Martyr;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $attachmentTypes = \App\Models\AttachmentType::pluck('id')->toArray();
        $attachmentType = $this->faker->randomElement($attachmentTypes);

        // Create a fake file
        $file = UploadedFile::fake()->create(
            $this->faker->word . '.pdf',
            $this->faker->numberBetween(100, 10000), // Size in KB
            'application/pdf',
        );

        return [
            'martyr_id' => Martyr::factory(),
            'attachment_type' => $attachmentType,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'description' => $this->faker->optional(0.7)->sentence(),
        ];
    }

    /**
     * Configure the factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Attachment $attachment) {
            // Create fake PDF content and add it to media library
            $content = '%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000354 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
459
%%EOF';

            $attachment->addMediaFromString($content)
                ->usingName($attachment->original_filename)
                ->usingFileName($attachment->original_filename)
                ->toMediaCollection('attachments');

            // Update the attachment with media info
            $media = $attachment->getFirstMedia('attachments');
            if ($media) {
                $attachment->update([
                    'file_path' => $media->getPath(),
                    'mime_type' => $media->mime_type,
                    'file_size' => $media->size,
                ]);
            }
        });
    }

    /**
     * Indicate that the attachment is for a specific martyr.
     */
    public function forMartyr(Martyr $martyr): static
    {
        return $this->state(fn (array $attributes) => [
            'martyr_id' => $martyr->id,
        ]);
    }

    /**
     * Create an attachment of a specific type.
     */
    public function ofType(int $typeId): static
    {
        return $this->state(fn (array $attributes) => [
            'attachment_type' => $typeId,
        ]);
    }
}
