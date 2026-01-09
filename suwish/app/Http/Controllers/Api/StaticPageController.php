<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaticPageController extends Controller
{
    /**
     * Display the specified static page content.
     *
     * @param string $name
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $name)
    {
        $page = StaticPage::where('name', $name)->first();

        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }

    /**
     * Update the specified static page content in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param string $name
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $name)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $page = StaticPage::where('name', $name)->first();
        
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }
        
        if ($request->has('content')) {
            $page->content = $request->content;
        }
        
        if ($request->has('sort_order')) {
            $page->sort_order = $request->sort_order;
        }
        
        $page->save();

        return response()->json($page);
    }
}