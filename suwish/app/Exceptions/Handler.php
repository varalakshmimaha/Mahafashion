<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert an authentication exception into a response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => $exception->getMessage()], 401);
        }

        $redirectTo = $exception->redirectTo();

        // If no redirect path is provided by the exception
        if (!$redirectTo) {
            // Check if admin request
            if ($request->is('admin/*') || $request->is('admin')) {
                return redirect()->guest(route('admin.login'));
            }

            // Check if login route exists
            if (\Illuminate\Support\Facades\Route::has('login')) {
                $redirectTo = route('login');
            } else {
                // Return a clear 403 or 401 page/message instead of crashing
                return response('Unauthenticated. Please login through the frontend application.', 401);
            }
        }

        return redirect()->guest($redirectTo);
    }
}
