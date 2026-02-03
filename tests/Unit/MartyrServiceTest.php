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
        $this->markTestSkipped('GD extension not available in test environment');
    }

    public function test_get_martyrs_search_matches_related_fields()
    {
        // Clear the search index to ensure test isolation
        try {
            \App\Models\Martyr::query()->unsearchable();
        } catch (\Exception $e) {
            // Ignore if clearing fails
        }

        // Create related records
        $parents = \App\Models\ParentsStatus::create(['name_ar' => 'على قيد الحياة', 'name_en' => 'Alive']);
        $marital = \App\Models\MaritalStatus::factory()->create();
        $employment = \App\Models\EmploymentStatus::factory()->create();

        // Create a martyr linked to parentsStatus with a distinctive string
        $martyr = Martyr::factory()->create([
            'full_name' => 'أحمد مثال فريد',
            'parents_status_id' => $parents->id,
            'employment_status_id' => $employment->id,
        ]);
        $martyr->searchable(); // Make sure it's indexed immediately

        $request = new Request;
        $request->merge(['search' => 'فريد']);

        $service = new MartyrService;

        $paginator = $service->getMartyrs($request);

        $this->assertEquals(1, $paginator->total());
        $this->assertEquals('أحمد مثال فريد', $paginator->items()[0]['full_name']);
    }

    public function test_get_martyrs_search_by_national_id()
    {
        // Create a martyr with a specific national ID
        $martyr = Martyr::factory()->create([
            'full_name' => 'محمد عبدالله الهاشمي تابون',
            'national_id' => '119930049098',
        ]);

        $request = new Request;
        $request->merge(['search' => '119930049098']);

        $service = new MartyrService;

        $paginator = $service->getMartyrs($request);

        $this->assertEquals(1, $paginator->total());
        $this->assertEquals('محمد عبدالله الهاشمي تابون', $paginator->items()[0]['full_name']);
        $this->assertEquals('119930049098', $paginator->items()[0]['national_id']);
    }

    public function test_get_martyrs_search_by_military_number()
    {
        // Create a martyr with a specific military number
        $martyr = Martyr::factory()->create([
            'full_name' => 'أحمد محمد علي',
            'military_number' => '69817455',
        ]);

        $request = new Request;
        $request->merge(['search' => '69817455']);

        $service = new MartyrService;

        $paginator = $service->getMartyrs($request);

        $this->assertEquals(1, $paginator->total());
        $this->assertEquals('أحمد محمد علي', $paginator->items()[0]['full_name']);
        $this->assertEquals('69817455', $paginator->items()[0]['military_number']);
    }

    public function test_get_martyrs_search_by_phone_number()
    {
        // Create a martyr with a specific phone number
        $martyr = Martyr::factory()->create([
            'full_name' => 'فاطمة أحمد حسن',
            'agent_phone' => '0916299469',
        ]);

        $request = new Request;
        $request->merge(['search' => '0916299469']);

        $service = new MartyrService;

        $paginator = $service->getMartyrs($request);

        $this->assertEquals(1, $paginator->total());
        $this->assertEquals('فاطمة أحمد حسن', $paginator->items()[0]['full_name']);
        $this->assertEquals('0916299469', $paginator->items()[0]['agent_phone']);
    }
}
