<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    public function index(){

        $user_id = auth()->user()->id;
        
        try {
            $cart_id = Cart::where('user_id', $user_id)->first()->id;
        } catch (\Throwable $th) {
            $cart_id = null;
        }

        if(!$cart_id) {
            $cart = new Cart();
            $cart->user_id = $user_id;
            $cart->total = 0;
            $cart->save();

            $cart_id = $cart->id;

            $cart_items = CartItem::where('cart_id', $cart_id)->get();
            return response()->json([
                'status' => 'success',
                'message' => 'New cart created successfully.',
                'cart_items' => $cart_items,
            ]);

        } else {
            $cart_items = CartItem::where('cart_id', $cart_id)->get();
            return response()->json([
                'status' => 'success',
                'cart_items' => $cart_items,
            ]);
        }


        

    }
}
