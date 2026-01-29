<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $this->enableRegistration();

        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    public function test_new_users_can_register()
    {
        $this->enableRegistration();

        $response = $this
            ->withSession(['_token' => 'test-token'])
            ->post(route('register.store'), [
                '_token' => 'test-token',
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticated();

        $user = User::where('email', 'test@example.com')->first();

        $this->assertNotNull($user);
        $this->assertTrue(Hash::check('password', $user->password));
        $this->assertNotSame('password', $user->password);
    }

    private function enableRegistration(): void
    {
        $features = config('fortify.features', []);

        if (! Features::enabled(Features::registration())) {
            $features[] = Features::registration();
            config()->set('fortify.features', $features);
        }
    }
}
