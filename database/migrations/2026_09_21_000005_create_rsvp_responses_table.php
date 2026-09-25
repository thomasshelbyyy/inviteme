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
        Schema::create('rsvp_responses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('invitation_id');
            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->string('guest_id')->nullable();
            $table->foreign('guest_id')->references('id')->on('guests')->nullOnDelete();
            $table->string('attendance')->comment('yes or no');
            $table->unsignedTinyInteger('attendee_count')->default(1);
            $table->text('message')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->index(['invitation_id', 'guest_id']);
            $table->index('invitation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rsvp_responses');
    }
};
