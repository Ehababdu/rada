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
            $this->faker->word.'.pdf',
            $this->faker->numberBetween(100, 10000) // Size in KB
        );

        return [
            'martyr_id' => Martyr::factory(),
            'attachment_type' => $attachmentType,
            'file_path' => 'attachments/'.$file->hashName(),
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'description' => $this->faker->optional(0.7)->sentence(),
        ];
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
