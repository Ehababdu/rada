<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Scout\Scout;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Disable Scout queueing for tests to ensure immediate indexing
        config(['scout.queue' => false]);
        // Set Scout driver to meilisearch for all tests
        config(['scout.driver' => 'meilisearch']);
    }
}
