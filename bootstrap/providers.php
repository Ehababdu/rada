<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\ReverbServiceProvider::class,
    // App\Providers\TelescopeServiceProvider::class, // Disabled temporarily
    Laravel\Boost\BoostServiceProvider::class,
    Laravel\Scout\ScoutServiceProvider::class,
];
