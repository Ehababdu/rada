<?php

namespace App\Events;

use App\Models\Bank;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BankUpdated
{
    use Dispatchable, SerializesModels;

    public Bank $bank;

    public array $oldData;

    /**
     * Create a new event instance.
     */
    public function __construct(Bank $bank, array $oldData = [])
    {
        $this->bank = $bank;
        $this->oldData = $oldData;
    }
}
