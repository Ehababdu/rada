<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class EmploymentStatus extends Model
{
    /** @use HasFactory<\Database\Factories\EmploymentStatusFactory> */
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
    ];
}
