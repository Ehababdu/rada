<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttachmentType extends Model
{
    protected $fillable = [
        'label',
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'attachment_type', 'id');
    }
}
