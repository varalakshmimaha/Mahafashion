<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('products')->orderBy('sort_order', 'asc')->paginate(10);
        return view('admin.categories.index', compact('categories'));
    }

    public function create()
    {
        $categories = Category::orderBy('sort_order', 'asc')->get();
        return view('admin.categories.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'new_parent_name' => 'nullable|string|max:255', // Validation for new parent category name
        ]);

        $data = $request->only(['name', 'description']);
        
        // Handle parent category - check if a new parent category needs to be created
        if ($request->input('parent_id') === 'new' && $request->filled('new_parent_name')) {
            // Create the new parent category first
            $newParent = Category::create([
                'name' => $request->input('new_parent_name'),
                'slug' => Str::slug($request->input('new_parent_name')),
                'sort_order' => 0,
            ]);
            
            $data['parent_id'] = $newParent->id;
        } elseif ($request->filled('parent_id') && $request->input('parent_id') !== 'new') {
            $data['parent_id'] = $request->input('parent_id');
        } else {
            $data['parent_id'] = null;
        }
        
        // Handle sort_order field
        $data['sort_order'] = $request->input('sort_order', 0);
        
        // Generate unique slug from name
        $slug = Str::slug($request->name);
        $originalSlug = $slug;
        $count = 1;
        
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }
        
        $data['slug'] = $slug;
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            if ($image->isValid()) {
                $path = $image->store('categories', 'public');
                $data['image'] = $path;
            }
        }

        Category::create($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function show(Category $category)
    {
        return view('admin.categories.show', compact('category'));
    }

    public function edit(Category $category)
    {
        $categories = Category::where('id', '!=', $category->id)->orderBy('sort_order', 'asc')->get();
        return view('admin.categories.edit', compact('category', 'categories'));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $category->id,
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'new_parent_name' => 'nullable|string|max:255', // Validation for new parent category name (even if not used in update)
        ]);

        $data = $request->only(['name', 'description', 'parent_id']);
        
        // Handle sort_order field
        $data['sort_order'] = $request->input('sort_order', 0);
        
        // Generate unique slug from name if name changed
        if ($request->name !== $category->name) {
            $slug = Str::slug($request->name);
            $originalSlug = $slug;
            $count = 1;
            
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            
            $data['slug'] = $slug;
        }
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            if ($image->isValid()) {
                // Delete old image if exists
                if ($category->image) {
                    $oldImagePath = storage_path('app/public/' . $category->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                
                $path = $image->store('categories', 'public');
                $data['image'] = $path;
            }
        }

        $category->update($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}