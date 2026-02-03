<?php

namespace Tests\Feature;

use App\Models\Attachment;
use App\Models\Martyr;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttachmentTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected $martyr;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed attachment types
        $this->seed(\Database\Seeders\AttachmentTypeSeeder::class);

        // Create a test user and authenticate
        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        // Create a test martyr
        $this->martyr = Martyr::factory()->create();

        // Disable CSRF protection for tests
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);
    }

    public function test_user_can_view_attachments_index()
    {
        $attachments = Attachment::factory()->count(3)->forMartyr($this->martyr)->create();

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Attachments/Index')
            ->has('martyr')
            ->has('attachments.data', 3)
            ->has('attachmentTypes')
        );
    }

    public function test_user_can_create_attachment()
    {
        $file = UploadedFile::fake()->createWithContent('test.pdf', '%PDF-1.4 test content', 'application/pdf');

        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->post("/martyrs/{$this->martyr->id}/attachments", [
                'attachment_type' => 1,
                'file' => $file,
                'description' => 'Test attachment description',
            ]);

        $response->assertRedirect("/martyrs/{$this->martyr->id}/attachments");

        $this->assertDatabaseHas('attachments', [
            'martyr_id' => $this->martyr->id,
            'attachment_type' => 1,
            'original_filename' => 'test.pdf',
            'mime_type' => 'application/pdf',
            'description' => 'Test attachment description',
        ]);

        // Check that media was created
        $attachment = \App\Models\Attachment::where('martyr_id', $this->martyr->id)->first();
        $this->assertNotNull($attachment);
        $this->assertTrue($attachment->hasMedia('attachments'));
        $media = $attachment->getFirstMedia('attachments');
        $this->assertNotNull($media);
        $this->assertEquals('test.pdf', $media->name);
        $this->assertEquals('application/pdf', $media->mime_type);
    }

    public function test_attachment_creation_validates_required_fields()
    {
        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->post("/martyrs/{$this->martyr->id}/attachments", [
            ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['attachment_type', 'file']);
    }

    public function test_user_can_view_single_attachment()
    {
        $attachment = Attachment::factory()->forMartyr($this->martyr)->create();

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Attachments/Show')
            ->has('martyr')
            ->has('attachment')
            ->where('attachment.id', $attachment->id)
        );
    }

    public function test_user_cannot_view_attachment_from_different_martyr()
    {
        $otherMartyr = Martyr::factory()->create();
        $attachment = Attachment::factory()->forMartyr($otherMartyr)->create();

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}");

        $response->assertStatus(404);
    }

    public function test_user_can_update_attachment()
    {
        $attachment = Attachment::factory()->forMartyr($this->martyr)->create();
        $newFile = UploadedFile::fake()->createWithContent('updated.pdf', '%PDF-1.4 updated content', 'application/pdf');

        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->put("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}", [
                'attachment_type' => 2,
                'file' => $newFile,
                'description' => 'Updated description',
            ]);

        $response->assertRedirect("/martyrs/{$this->martyr->id}/attachments");

        $this->assertDatabaseHas('attachments', [
            'id' => $attachment->id,
            'attachment_type' => 2,
            'original_filename' => 'updated.pdf',
            'mime_type' => 'application/pdf',
            'description' => 'Updated description',
        ]);

        // Check that old media was cleared and new media was added
        $attachment->refresh();
        $this->assertTrue($attachment->hasMedia('attachments'));
        $media = $attachment->getFirstMedia('attachments');
        $this->assertNotNull($media);
        $this->assertEquals('updated.pdf', $media->name);
        $this->assertEquals('application/pdf', $media->mime_type);
    }

    public function test_user_can_update_attachment_without_changing_file()
    {
        $attachment = Attachment::factory()->forMartyr($this->martyr)->create();

        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->put("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}", [
                'attachment_type' => 3,
                'description' => 'Updated description without file',
            ]);

        $response->assertRedirect("/martyrs/{$this->martyr->id}/attachments");

        $this->assertDatabaseHas('attachments', [
            'id' => $attachment->id,
            'attachment_type' => 3,
            'description' => 'Updated description without file',
        ]);
    }

    public function test_user_can_delete_attachment()
    {
        $attachment = Attachment::factory()->forMartyr($this->martyr)->create();
        $mediaId = $attachment->getFirstMedia('attachments')?->id;

        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->delete("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}");

        $response->assertRedirect("/martyrs/{$this->martyr->id}/attachments");

        $this->assertDatabaseMissing('attachments', [
            'id' => $attachment->id,
        ]);

        // Check that media was also deleted
        if ($mediaId) {
            $this->assertDatabaseMissing('media', ['id' => $mediaId]);
        }
    }

    public function test_user_cannot_delete_attachment_from_different_martyr()
    {
        $otherMartyr = Martyr::factory()->create();
        $attachment = Attachment::factory()->forMartyr($otherMartyr)->create();

        $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
            ->delete("/martyrs/{$this->martyr->id}/attachments/{$attachment->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('attachments', [
            'id' => $attachment->id,
        ]);
    }

    public function test_attachments_can_be_filtered_by_type()
    {
        Attachment::factory()->forMartyr($this->martyr)->ofType(1)->create();
        Attachment::factory()->forMartyr($this->martyr)->ofType(2)->create();
        Attachment::factory()->forMartyr($this->martyr)->ofType(3)->create();

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments?type=1");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('attachments.data', 1)
            ->where('attachments.data.0.attachment_type.id', 1)
        );
    }

    public function test_attachments_can_be_searched_by_filename()
    {
        Attachment::factory()->forMartyr($this->martyr)->create(['original_filename' => 'unique_death_cert.pdf']);
        Attachment::factory()->forMartyr($this->martyr)->create(['original_filename' => 'family_doc.pdf']);
        Attachment::factory()->forMartyr($this->martyr)->create(['original_filename' => 'other.pdf']);

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments?search=unique_death");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('attachments.data', 1)
            ->where('attachments.data.0.original_filename', 'unique_death_cert.pdf')
        );
    }

    public function test_attachments_are_paginated()
    {
        // Create more attachments than the default per page (15)
        Attachment::factory()->count(20)->forMartyr($this->martyr)->create();

        $response = $this->get("/martyrs/{$this->martyr->id}/attachments");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('attachments.data', 15) // Should show 15 per page
            ->where('attachments.current_page', 1)
            ->where('attachments.last_page', 2)
        );
    }
}
