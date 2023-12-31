<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $type = "buyer";
        $usertype_id = Auth::user()->where('email', $request->email)->first()->usertype_id;
        if ($usertype_id == 1) {
            $type = "admin";
        }
        else if ($usertype_id == 2) {
            $type = "buyer";
        }
        
        $user = Auth::user();
        return response()->json([
                'status' => 'success',
                'user' => $user,
                'type' => $type,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ]);

    }

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:5',
            'type' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Email already exists',
            ], 400);
        }

        $usertype_id = 2;
        if($request->type == 'admin'){
            $usertype_id = 1;
        }else if($request->type == 'buyer'){
            $usertype_id = 2;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'usertype_id' => $usertype_id,
        ]);

        $token = Auth::login($user);
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

}