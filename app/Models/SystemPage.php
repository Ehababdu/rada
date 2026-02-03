<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class SystemPage extends Model
{
    use Searchable;

    protected $fillable = [
        'id',
        'title',
        'route',
        'group',
        'icon',
        'permission',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'route' => $this->route,
            'group' => $this->group,
            'icon' => $this->icon,
            'permission' => $this->permission,
        ];
    }
}
