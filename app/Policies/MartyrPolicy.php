<?php

namespace App\Policies;

use App\Models\Martyr;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MartyrPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('manage martyrs') || $user->hasRole('admin');
    }

    public function view(User $user, Martyr $martyr): bool
    {
        return $user->can('manage martyrs') || $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->can('manage martyrs') || $user->hasRole('admin');
    }

    public function update(User $user, Martyr $martyr): bool
    {
        return $user->can('manage martyrs') || $user->hasRole('admin');
    }

    public function delete(User $user, Martyr $martyr): bool
    {
        return $user->can('manage martyrs') || $user->hasRole('admin');
    }
}
