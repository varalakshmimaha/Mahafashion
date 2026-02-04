<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaticPageController extends Controller
{
    /**
     * Display a listing of the static pages.
     */
    public function index()
    {
        $pages = StaticPage::orderBy('sort_order', 'asc')->get();
        return view('admin.static-pages.index', compact('pages'));
    }

    /**
     * Show the form for creating a new static page.
     */
    public function create()
    {
        return view('admin.static-pages.create');
    }

    /**
     * Store a newly created static page in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:static_pages,name|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Auto-generate slug from name if not present, enforcing lowercase/kebab
        $slug = \Illuminate\Support\Str::slug($request->name);

        StaticPage::create([
            'name' => $request->name,
            'slug' => $slug, // Ensure slug is populated
            'title' => $request->title,
            'content' => $request->content,
            'status' => 'published', // Default to published
            'sort_order' => $request->sort_order ?? 0,
            'meta_title' => $request->title, // Default metadata
            'meta_description' => \Illuminate\Support\Str::limit(strip_tags($request->content), 160),
        ]);

        return redirect()->route('admin.static-pages.index')->with('success', 'Static page created successfully.');
    }

    /**
     * Display the specified static page.
     */
    public function show($name)
    {
        $staticPage = StaticPage::where('name', $name)->firstOrFail();
        return view('admin.static-pages.show', compact('staticPage'));
    }

    /**
     * Show the form for editing the specified static page.
     */
    public function edit($name)
    {
        $page = StaticPage::where('name', $name)->firstOrFail();
        return view('admin.static-pages.edit', compact('page'));
    }

    /**
     * Update the specified static page in storage.
     */
    public function update(Request $request, $name)
    {
        $page = StaticPage::where('name', $name)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $page->update([
            'title' => $request->title,
            'content' => $request->content,
            'sort_order' => $request->sort_order ?? 0,
            // Optimization: If name/slug editing is allowed, update it here.
            // For now, assuming name is constant after creation or handled separately.
            // Updating metadata if needed:
            'meta_title' => $request->title,
            'meta_description' => \Illuminate\Support\Str::limit(strip_tags($request->content), 160),
        ]);

        return redirect()->route('admin.static-pages.index')->with('success', 'Static page updated successfully.');
    }

    /**
     * Remove the specified static page from storage.
     */
    public function destroy(StaticPage $staticPage)
    {
        $staticPage->delete();

        return redirect()->route('admin.static-pages.index')->with('success', 'Static page deleted successfully.');
    }
}