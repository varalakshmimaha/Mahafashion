<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())->get();
        
        return response()->json($addresses);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|in:home,office,other',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // If this is a default address, unset the current default
        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        } elseif (!Address::where('user_id', Auth::id())->exists()) {
            // If no address exists, make this one the default
            $request->merge(['is_default' => true]);
        }
        
        $address = Address::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'street' => $request->street,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'country' => $request->country ?? 'India',
            'phone' => $request->phone,
            'type' => $request->type,
            'is_default' => $request->is_default ?? false,
        ]);
        
        return response()->json($address, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        
        return response()->json($address);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'street' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'zip' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'type' => 'sometimes|in:home,office,other',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // If this is being set as default, unset the current default
        if ($request->has('is_default') && $request->is_default) {
            Address::where('user_id', Auth::id())->where('id', '!=', $id)->update(['is_default' => false]);
        }
        
        $address->update($request->all());
        
        return response()->json($address);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $address->delete();
        
        return response()->json(null, 204);
    }
}