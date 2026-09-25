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
        Schema::create('guests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('invitation_id');
            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('group')->nullable();
            $table->text('address')->nullable();
            $table->string('token', 16)->unique()->index()->comment('Secure random token for personalized URL');
            $table->string('rsvp_status')->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['invitation_id', 'token']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
