<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            // Check if the request is for the admin panel
            if ($request->is('admin') || $request->is('admin/*')) {
                return route('admin.login');
            }
            
            // Check if a standard 'login' route exists
            if (\Illuminate\Support\Facades\Route::has('login')) {
                return route('login');
            }

            // Fallback for API or routes without a defined login page
            // Returning null will cause Laravel to throw an AuthenticationException (401 Unauthorized for JSON)
            return null;
        }
    }
}
