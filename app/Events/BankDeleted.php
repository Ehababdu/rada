<?php

namespace App\Events;

use App\Models\Bank;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BankDeleted
{
    use Dispatchable, SerializesModels;

    public Bank $bank;

    /**
     * Create a new event instance.
     */
    public function __construct(Bank $bank)
    {
        $this->bank = $bank;
    }
}
