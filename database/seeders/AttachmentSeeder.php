<?php

namespace Database\Seeders;

use App\Models\Attachment;
use App\Models\AttachmentType;
use App\Models\Martyr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AttachmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all martyrs
        $martyrs = Martyr::all();

        if ($martyrs->isEmpty()) {
            $this->command->info('No martyrs found. Please run MartyrSeeder first.');

            return;
        }

        // Create sample attachments for each martyr
        foreach ($martyrs as $martyr) {
            // Create 2-5 random attachments per martyr
            $attachmentCount = rand(2, 5);

            for ($i = 0; $i < $attachmentCount; $i++) {
                $attachmentTypes = AttachmentType::pluck('id')->toArray();
                $attachmentType = $attachmentTypes[array_rand($attachmentTypes)];

                // Create a fake file in storage
                $fileName = 'sample_'.$attachmentType.'_'.($i + 1).'.pdf';
                $filePath = 'attachments/'.$fileName;

                // Create a dummy file content (in real scenario, you'd have actual files)
                Storage::disk('public')->put($filePath, 'Sample file content for '.$attachmentType);

                Attachment::create([
                    'martyr_id' => $martyr->id,
                    'attachment_type' => $attachmentType,
                    'file_path' => $filePath,
                    'original_filename' => $fileName,
                    'mime_type' => 'application/pdf',
                    'file_size' => rand(10000, 500000), // Random file size
                    'description' => 'Sample attachment for '.$martyr->full_name,
                ]);
            }
        }

        $this->command->info('Attachment seeder completed successfully!');
    }
}
