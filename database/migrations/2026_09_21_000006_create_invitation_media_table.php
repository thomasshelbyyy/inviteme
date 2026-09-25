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
        Schema::create('invitation_media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('invitation_id')->nullable();
            $table->foreign('invitation_id')->references('id')->on('invitations')->nullOnDelete();
            $table->string('filename')->comment('Original filename');
            $table->string('storage_path')->comment('Relative path on disk or object storage key');
            $table->string('disk')->default('local')->comment('Storage disk: local, s3, r2');
            $table->string('mime_type');
            $table->unsignedBigInteger('size_bytes');
            $table->unsignedSmallInteger('width')->nullable();
            $table->unsignedSmallInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('invitation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitation_media');
    }
};
