<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Martyr extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'full_name',
        'national_id',
        'address',
        'parents_status_id',
        'marital_status_id',
        'children_count',
        'wife_status',
        'employment_status_id',
        'job_grade_id',
        'employer_id',
        'employer_location_id',
        'has_previous_workplace',
        'previous_employer_id',
        'previous_employer_location_id',
        'military_number',
        'military_rank_id',
        'bank_id',
        'branch_id',
        'bank_account_number',
        'agent_name',
        'agent_phone',
        'agent_relationship',
        'profile_image',
        'agent_passport_number',

        'death_date',
        'has_martyr_decision',
        'decision_number',
        'decision_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'children_count' => 'integer',
            'wife_status' => 'string',
            'death_date' => 'date',
            'has_martyr_decision' => 'boolean',
            'has_previous_workplace' => 'boolean',
            'decision_date' => 'date',
            'status' => 'string',
        ];
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function employmentStatus()
    {
        return $this->belongsTo(EmploymentStatus::class, 'employment_status_id');
    }

    public function jobGrade()
    {
        return $this->belongsTo(JobGrade::class, 'job_grade_id');
    }

    public function parentsStatus()
    {
        return $this->belongsTo(ParentsStatus::class, 'parents_status_id');
    }

    public function maritalStatus()
    {
        return $this->belongsTo(MaritalStatus::class, 'marital_status_id');
    }

    public function militaryRank()
    {
        return $this->belongsTo(MilitaryRank::class, 'military_rank_id');
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function employerLocation()
    {
        return $this->belongsTo(EmployerLocation::class);
    }

    public function previousEmployer()
    {
        return $this->belongsTo(Employer::class, 'previous_employer_id');
    }

    public function previousEmployerLocation()
    {
        return $this->belongsTo(EmployerLocation::class, 'previous_employer_location_id');
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

    public function getDataCompletionStatusAttribute(): string
    {
        $requiredTypes = AttachmentType::pluck('id')->toArray();
        $uploadedTypes = $this->attachments->whereNotNull('file_path')->pluck('attachment_type')->toArray();

        return count(array_intersect($requiredTypes, $uploadedTypes)) === count($requiredTypes)
            ? 'complete'
            : 'incomplete';
    }

    public function getIsDataCompleteAttribute(): bool
    {
        return $this->data_completion_status === 'complete';
    }

    /**
     * Calculate compensation amount based on martyr's status
     */
    public function calculateCompensationAmount(): float
    {
        // Only married martyrs get compensation
        if ($this->marital_status_id !== 1) { // 1 = married
            return 0;
        }

        $amount = 0;
        $childrenCount = $this->children_count ?? 0;
        $motherAlive = in_array($this->parents_status_id, [3, 4]); // 3 = mother alive, 4 = both alive
        $wifeRemarried = $this->wife_status === 'متزوجة';

        // Base amount per child: 500
        $amount += $childrenCount * 500;

        // Mother compensation: 500 if alive
        if ($motherAlive) {
            $amount += 500;
        }

        // Wife compensation: 500 if not remarried
        if (! $wifeRemarried) {
            $amount += 500;
        }

        // Special case: if mother deceased, wife remarried, and no children = 0
        if (! $motherAlive && $wifeRemarried && $childrenCount === 0) {
            return 0;
        }

        return $amount;
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'national_id' => $this->national_id,
            'address' => $this->address,
            'parents_status' => $this->parentsStatus?->name_ar,
            'marital_status' => $this->maritalStatus?->name_ar,
            'employment_status' => $this->employmentStatus?->name_ar,
            'job_grade' => $this->jobGrade?->name_ar,
            'military_number' => $this->military_number,
            'military_rank' => $this->militaryRank?->name_ar,
            'bank_name' => $this->bank?->name_ar,
            'agent_name' => $this->agent_name,
            'agent_phone' => $this->agent_phone,
        ];
    }
}
