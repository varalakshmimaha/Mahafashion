<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaticPageController extends Controller
{
    // Admin: list all static pages
    public function index()
    {
        $pages = StaticPage::orderBy('sort_order', 'asc')->get();
        return response()->json($pages);
    }

    // Public: list all published static pages
    public function publicIndex()
    {
        $pages = StaticPage::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get(['title', 'slug', 'category']);
        return response()->json($pages);
    }

    // Admin: create a new static page
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:static_pages,name|max:255',
            'slug' => 'required|string|unique:static_pages,slug|max:255',
            'category' => 'nullable|string|in:quick_link,policy',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $page = StaticPage::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'category' => $request->category ?? 'quick_link',
            'title' => $request->title,
            'content' => $request->content,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'status' => $request->status ?? 'draft',
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json($page, 201);
    }

    /**
     * Display the specified static page (public).
     * Only published pages are returned to public callers.
     */
    public function show(string $slug)
    {
        $page = StaticPage::where('slug', $slug)->first();

        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        // If the page is not published, return 404 for public consumers
        if ($page->status !== 'published') {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json([
            'title' => $page->title,
            'content' => $page->content,
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
            'slug' => $page->slug,
        ]);
    }

    // Admin: update a static page (by slug)
    public function update(Request $request, string $slug)
    {
        $page = StaticPage::where('slug', $slug)->first();
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|unique:static_pages,name,' . $page->id,
            'slug' => 'nullable|string|unique:static_pages,slug,' . $page->id,
            'category' => 'nullable|string|in:quick_link,policy',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'slug', 'category', 'title', 'content', 'meta_title', 'meta_description', 'status', 'sort_order']);
        $page->fill(array_filter($data, function ($v) { return $v !== null; }));
        $page->save();

        return response()->json($page);
    }

    /**
     * Admin: Display the specified static page (all fields, no status check).
     */
    public function adminShow(string $slug)
    {
        $page = StaticPage::where('slug', $slug)->first();

        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }

    // Admin: delete a page
    public function destroy($id)
    {
        $page = StaticPage::find($id);
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        $page->delete();
        return response()->json(['message' => 'Page deleted']);
    }
}