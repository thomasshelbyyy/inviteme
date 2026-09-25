<?php

namespace App\Http\Controllers;

use App\Models\InvitationMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = InvitationMedia::where('user_id', $request->user()->id)
            ->latest();

        if ($request->wantsJson()) {
            return response()->json($query->paginate(20));
        }

        return Inertia::render('Media/Index', [
            'media' => $query->paginate(20),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            // mimes mengecek isi file (magic bytes), extensions mengecek ekstensi asli, image memastikan itu gambar
            'file' => 'required|image|mimes:jpeg,png,jpg,webp|extensions:jpeg,png,jpg,webp|max:5120',
        ]);

        $file = $request->file('file');

        // SANGAT PENTING: Gunakan extension() bawaan Laravel (berdasarkan MIME/isi file sebenarnya)
        // BUKAN getClientOriginalExtension() (bisa dimanipulasi hacker menjadi .php)
        $filename = Str::ulid().'.'.$file->extension();
        $path = $file->storeAs('media', $filename, 'public');

        $media = InvitationMedia::create([
            'user_id' => $request->user()->id,
            'filename' => $file->getClientOriginalName(), // Hanya untuk label display
            'storage_path' => $path,
            'disk' => 'local',
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['media' => $media]);
        }

        return back()->with('success', 'Media uploaded successfully.');
    }

    public function destroy(Request $request, InvitationMedia $medium)
    {
        if ($medium->user_id !== $request->user()->id) {
            abort(403);
        }

        // Delete from storage
        if ($medium->disk === 'local') {
            Storage::disk('public')->delete($medium->storage_path);
        } else {
            Storage::disk($medium->disk)->delete($medium->storage_path);
        }

        $medium->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', 'Media deleted successfully.');
    }
}
