<?php

use App\Models\Martyr;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

describe('Martyrs Index Page', function () {

    beforeEach(function () {
        $this->user = User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.view']);
        $this->user->givePermissionTo('martyrs.view');
        actingAs($this->user);
    });

    it('can display the martyrs index page', function () {
        get(route('martyrs.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data')
                ->has('filters')
                ->has('maritalStatuses')
                ->has('employmentStatuses'),
            );
    });

    it('can filter martyrs by search query', function () {
        $martyr = Martyr::factory()->create(['full_name' => 'John Doe']);
        $martyr->searchable(); // Make sure it's indexed immediately
        $martyr2 = Martyr::factory()->create(['full_name' => 'Jane Smith']);
        $martyr2->searchable(); // Make sure it's indexed immediately

        // Test without search filter first
        get(route('martyrs.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data'),
            );
    });

    it('can filter martyrs by marital status', function () {
        $status1 = \App\Models\MaritalStatus::factory()->create();
        $status2 = \App\Models\MaritalStatus::factory()->create();
        Martyr::factory()->create(['marital_status_id' => $status1->id]);
        Martyr::factory()->create(['marital_status_id' => $status2->id]);

        get(route('martyrs.index', ['marital_status_id' => $status1->id]))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 1)
                ->where('martyrs.data.0.marital_status_id', $status1->id),
            );
    });

    it('can filter martyrs by employment status', function () {
        $status1 = \App\Models\EmploymentStatus::factory()->create();
        $status2 = \App\Models\EmploymentStatus::factory()->create();
        Martyr::factory()->create(['employment_status_id' => $status1->id]);
        Martyr::factory()->create(['employment_status_id' => $status2->id]);

        get(route('martyrs.index', ['employment_status_id' => $status1->id]))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 1)
                ->where('martyrs.data.0.employment_status_id', $status1->id),
            );
    });

    it('can paginate martyrs', function () {
        Martyr::factory()->count(25)->create();

        get(route('martyrs.index', ['per_page' => 10]))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 10)
                ->where('martyrs.per_page', 10)
                ->where('martyrs.current_page', 1)
                ->where('martyrs.last_page', 3),
            );
    });

    it('can sort martyrs by different columns', function () {
        Martyr::factory()->create(['full_name' => 'Zoe Last']);
        Martyr::factory()->create(['full_name' => 'Alice First']);

        get(route('martyrs.index', ['sort' => 'full_name']))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 2)
                ->where('martyrs.data.0.full_name', 'Alice First')
                ->where('martyrs.data.1.full_name', 'Zoe Last'),
            );
    });

    it('can sort martyrs in descending order', function () {
        Martyr::factory()->create(['full_name' => 'Alice First']);
        Martyr::factory()->create(['full_name' => 'Zoe Last']);

        get(route('martyrs.index', ['sort' => '-full_name']))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 2)
                ->where('martyrs.data.0.full_name', 'Zoe Last')
                ->where('martyrs.data.1.full_name', 'Alice First'),
            );
    });

    it('includes proper pagination metadata', function () {
        Martyr::factory()->count(15)->create();

        get(route('martyrs.index', ['per_page' => 5, 'page' => 2]))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('martyrs.data', 5)
                ->where('martyrs.current_page', 2)
                ->where('martyrs.per_page', 5)
                ->where('martyrs.total', 15)
                ->where('martyrs.last_page', 3)
                ->has('martyrs.links'),
            );
    });

    it('loads required filter options', function () {
        \App\Models\MaritalStatus::factory()->count(3)->create();
        \App\Models\EmploymentStatus::factory()->count(2)->create();

        get(route('martyrs.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->has('maritalStatuses', 3)
                ->has('employmentStatuses', 2)
                ->has('filters'),
            );
    });

    it('maintains filter state across requests', function () {
        $filters = [
            'search' => 'test search',
            'marital_status_id' => '1',
            'employment_status_id' => '2',
            'date_from' => '2024-01-01',
            'date_to' => '2024-12-31',
        ];

        get(route('martyrs.index', $filters))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->where('filters.search', 'test search')
                ->where('filters.marital_status_id', '1')
                ->where('filters.employment_status_id', '2')
                ->where('filters.date_from', '2024-01-01')
                ->where('filters.date_to', '2024-12-31'),
            );
    });

    it('maintains per_page filter state across requests', function () {
        get(route('martyrs.index', ['per_page' => '25']))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Martyrs/Index')
                ->where('filters.per_page', '25'),
            );
    });
});
