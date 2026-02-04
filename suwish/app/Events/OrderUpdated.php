<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    public $type;

    /**
     * Create a new event instance.
     */
    public function __construct($order, $type = 'status')
    {
        $this->order = $order;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('orders.' . ($this->order->id ?? 'unknown'));
    }

    /**
     * Data to broadcast
     */
    public function broadcastWith()
    {
        // Ensure order is serializable
        $order = $this->order;
        if (method_exists($order, 'toArray')) {
            $order = $order->toArray();
        }

        return [
            'type' => $this->type,
            'order' => $order,
        ];
    }
}
