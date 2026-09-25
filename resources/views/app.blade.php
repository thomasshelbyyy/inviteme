<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-name" content="{{ config('app.name') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name') }}</title>

        <!-- SEO -->
        <meta name="description" content="Bikin undangan pernikahan digital sendiri — gratis. Drag & drop editor. Bayar hanya saat siap publish.">
        <meta name="keywords" content="undangan pernikahan digital, undangan online, wedding invitation, bikin undangan">
        <meta property="og:site_name" content="{{ config('app.name') }}">
        <meta property="og:locale" content="id_ID">

        <!-- Fonts preconnect -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        {{-- Midtrans Snap.js — loaded globally so Editor can call window.snap.pay() --}}
        <script
            src="{{ config('midtrans.snap_url') }}"
            data-client-key="{{ config('midtrans.client_key') }}"
        ></script>
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
