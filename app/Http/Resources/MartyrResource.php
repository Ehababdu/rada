<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MartyrResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'national_id' => $this->national_id,
            'address' => $this->address,
            'parents_status' => $this->parentsStatus?->name_ar,
            'marital_status' => $this->maritalStatus ? [
                'id' => $this->maritalStatus->id,
                'name_ar' => $this->maritalStatus->name_ar,
                'name_en' => $this->maritalStatus->name_en,
            ] : null,
            'children_count' => $this->children_count,
            'employment_status' => $this->employmentStatus?->name,
            'employer' => $this->employer ? [
                'id' => $this->employer->id,
                'name_ar' => $this->employer->name_ar,
                'name_en' => $this->employer->name_en,
            ] : null,
            'employer_location' => $this->employerLocation ? [
                'id' => $this->employerLocation->id,
                'name_ar' => $this->employerLocation->name_ar,
                'name_en' => $this->employerLocation->name_en,
            ] : null,
            'previous_employer' => $this->previousEmployer ? [
                'id' => $this->previousEmployer->id,
                'name_ar' => $this->previousEmployer->name_ar,
                'name_en' => $this->previousEmployer->name_en,
            ] : null,
            'previous_employer_location' => $this->previousEmployerLocation ? [
                'id' => $this->previousEmployerLocation->id,
                'name_ar' => $this->previousEmployerLocation->name_ar,
                'name_en' => $this->previousEmployerLocation->name_en,
            ] : null,
            'military_number' => $this->military_number,
            'military_rank' => $this->militaryRank?->name_ar,
            'bank_name' => $this->bank?->name_ar,
            'bank_account_number' => $this->bank_account_number,
            'bank_branch' => $this->branch?->name_ar,
            'agent_name' => $this->agent_name,
            'agent_phone' => $this->agent_phone,
            'agent_relationship' => $this->agent_relationship,
            'profile_image' => $this->profile_image,
            'agent_passport_number' => $this->agent_passport_number,
            'national_id_file' => $this->national_id_file,
            'art_image' => $this->art_image,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
