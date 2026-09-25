<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('invitation_id');
            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->string('guest_id')->nullable();
            $table->foreign('guest_id')->references('id')->on('guests')->nullOnDelete();
            $table->string('event_type')->comment('view, rsvp_open, rsvp_submit, link_click');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            // Append-only table — no updated_at
            $table->index(['invitation_id', 'event_type']);
            $table->index(['invitation_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
