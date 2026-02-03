<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    public function test_confirm_password_screen_can_be_rendered()
    {
        $this->markTestSkipped('Password confirmation feature is not enabled in Fortify');
    }

    public function test_password_confirmation_requires_authentication()
    {
        $this->markTestSkipped('Password confirmation feature is not enabled in Fortify');
    }
}
