<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle user login
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required|string',
            'password' => 'required',
        ]);

        // Check if the input is an email or phone number
        $field = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        
        $user = User::where($field, $request->email_or_phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke all previous tokens
        $user->tokens()->delete();

        // Create a new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Handle user registration
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'shipping_address' => $request->address,
            'shipping_city' => $request->city,
            'shipping_state' => $request->state,
            'shipping_pincode' => $request->pincode,
            'shipping_phone' => $request->phone, // Default shipping phone to main phone
            'shipping_name' => $request->name,   // Default shipping name to main name
        ]);

        // Create a token for the new user
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Handle user logout
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $user->id,
            'date_of_birth' => 'sometimes|nullable|date',
        ]);

        $user->name = $request->has('name') ? $request->name : $user->name;
        $user->email = $request->has('email') ? $request->email : $user->email;
        $user->phone = $request->has('phone') ? $request->phone : $user->phone;
        if ($request->has('date_of_birth')) {
            $user->date_of_birth = $request->date_of_birth;
        }

        $user->save();

        return response()->json($user);
    }

    /**
     * Change authenticated user's password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password incorrect'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }

    /**
     * Handle forgot password request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Even if user doesn't exist, return success to prevent email enumeration
            return response()->json(['message' => 'If your email exists in our system, a password reset link has been sent']);
        }

        // Delete any existing reset tokens for this email
        \DB::table('password_resets')->where('email', $request->email)->delete();

        // Generate a reset token
        $token = bin2hex(random_bytes(32));
        
        // Store the reset token
        \DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => now()
        ]);
        
        // In a real application, you would send an email here
        // For now, we'll just return the token for testing purposes
        
        return response()->json([
            'message' => 'If your email exists in our system, a password reset link has been sent',
            'token' => $token, // This is for testing only, in real app tokens should not be returned
        ]);
    }

    /**
     * Handle reset password request
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check if the reset token exists and is valid (not expired)
        $reset = \DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$reset) {
            return response()->json(['message' => 'Invalid or expired reset token'], 400);
        }

        // Check if the token is older than 1 hour (60 minutes)
        if (now()->diffInHours($reset->created_at) > 1) {
            // Delete the expired token
            \DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Reset token has expired'], 400);
        }

        // Find the user
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the used reset token
        \DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successfully']);
    }
}