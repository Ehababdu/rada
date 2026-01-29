<?php

namespace Tests\Unit;

use App\Models\Martyr;
use App\Services\MartyrService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MartyrServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_martyr_replaces_files_and_deletes_old()
    {
        Storage::fake('public');

        // Create initial file and martyr
        Storage::disk('public')->put('martyrs/images/old.jpg', 'old');

        $martyr = Martyr::factory()->create([
            'profile_image' => 'martyrs/images/old.jpg',
        ]);

        $service = new MartyrService;

        $file = UploadedFile::fake()->image('new.jpg');
        $request = new Request;
        $request->files->set('profile_image', $file);

        $service->updateMartyr($martyr, [], $request);

        // old file deleted
        Storage::disk('public')->assertMissing('martyrs/images/old.jpg');

        // new file exists
        Storage::disk('public')->assertExists($martyr->refresh()->profile_image);
    }

    public function test_get_martyrs_search_matches_related_fields()
    {
        // Create related records
        $parents = \App\Models\ParentsStatus::create(['name_ar' => 'في الحياة', 'name_en' => 'Alive']);
        $marital = \App\Models\MaritalStatus::factory()->create();
        $employment = \App\Models\EmploymentStatus::factory()->create();

        // Create a martyr linked to parentsStatus with a distinctive string
        $martyr = Martyr::factory()->create([
            'full_name' => 'أحمد مثال',
            'parents_status_id' => $parents->id,
            'employment_status_id' => $employment->id,
        ]);

        $request = new Request;
        $request->merge(['search' => 'في الحياة']);

        $service = new MartyrService;

        $paginator = $service->getMartyrs($request);

        $this->assertEquals(1, $paginator->total());
        $this->assertEquals('أحمد مثال', $paginator->items()[0]['full_name']);
    }
}
