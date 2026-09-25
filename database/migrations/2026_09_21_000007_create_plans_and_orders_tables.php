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
        Schema::create('plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('key')->unique()->index()->comment('e.g. basic, premium');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price')->comment('Price in IDR (smallest unit)');
            $table->json('features')->nullable()->comment('Array of feature strings');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('invitation_id');
            $table->foreign('invitation_id')->references('id')->on('invitations')->cascadeOnDelete();
            $table->string('plan')->comment('Plan key: basic, premium');
            $table->unsignedBigInteger('amount')->comment('Amount in IDR');
            $table->string('currency', 3)->default('IDR');
            $table->string('status')->default('pending')->index();
            $table->string('payment_gateway')->nullable()->comment('midtrans, xendit, manual');
            $table->string('gateway_order_id')->nullable()->index();
            $table->string('gateway_payment_id')->nullable();
            $table->json('gateway_payload')->nullable()->comment('Full gateway response');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['invitation_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('plans');
    }
};
