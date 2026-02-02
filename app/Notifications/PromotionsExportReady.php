<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PromotionsExportReady extends Notification implements ShouldQueue
{
    use Queueable;

    protected $downloadUrl;

    /**
     * Create a new notification instance.
     */
    public function __construct($downloadUrl)
    {
        $this->downloadUrl = $downloadUrl;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('تقرير الترقيات جاهز للتحميل.')
            ->action('تحميل التقرير', $this->downloadUrl)
            ->line('شكراً لاستخدام النظام!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'تقرير الترقيات جاهز للتحميل',
            'download_url' => $this->downloadUrl,
        ];
    }
}