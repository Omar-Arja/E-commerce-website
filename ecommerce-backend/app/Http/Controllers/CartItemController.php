<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
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
            foreach ($cart_items as $cart_item) {
                $name = Product::find($cart_item->product_id)->name;
                $image_url = Product::find($cart_item->product_id)->image_url;
                $price = Product::find($cart_item->product_id)->price;
                $price = $price * $cart_item->quantity;

                $cart_item->name = $name;
                $cart_item->image_url = $image_url;
                $cart_item->price = $price;
            }

            return response()->json([
                'status' => 'success',
                'cart_items' => $cart_items,
            ]);

        } else {
            $cart_items = CartItem::where('cart_id', $cart_id)->get();

            foreach ($cart_items as $cart_item) {
                $name = Product::find($cart_item->product_id)->name;
                $image_url = Product::find($cart_item->product_id)->image_url;
                $price = Product::find($cart_item->product_id)->price;
                $price = $price * $cart_item->quantity;

                $cart_item->name = $name;
                $cart_item->image_url = $image_url;
                $cart_item->price = $price;
            }

            return response()->json([
                'status' => 'success',
                'cart_items' => $cart_items,
            ]);
        }
    }

    public function store (Request $request) {
        $request->validate([
            'product_id' => 'required|numeric',
        ]);

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
        }

        $cart_item = CartItem::where('cart_id', $cart_id)->where('product_id', $request->product_id)->first();
        if($cart_item) {
            $cart_item->quantity += 1;
            $price = Product::find($request->product_id)->price;
            $cart_item->price = $price * $cart_item->quantity;
            $cart_item->save();

            $cart_items = CartItem::where('cart_id', $cart_id)->get();
            return response()->json([
                'status' => 'success',
                'message' => 'Cart item updated successfully.',
                'cart_items' => $cart_items,
            ]);
        }

        $cart_item = new CartItem();
        $cart_item->cart_id = $cart_id;
        $cart_item->product_id = $request->product_id;
        $cart_item->quantity = 1;

        $product = Product::find($request->product_id);
        $cart_item->price = $product->price;

        $cart_item->save();

        $cart_items = CartItem::where('cart_id', $cart_id)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Cart item added successfully.',
            'cart_items' => $cart_items,
        ]);
    }


    public function update(Request $request, $id){
        $request->validate([
            'quantity' => 'required|numeric',
        ]);

        $cart_item = CartItem::find($id);
        $cart_item->quantity = $request->quantity;
        $price = Product::find($cart_item->product_id)->price;
        $cart_item->price = $price * $cart_item->quantity;
        $cart_item->save();

        $cart_items = CartItem::where('cart_id', $cart_item->cart_id)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Cart item updated successfully.',
            'cart_items' => $cart_items,
        ]);
    }

    public function destroy($product_id){
        $user_id = auth()->user()->id;
        $cart_id = Cart::where('user_id', $user_id)->first()->id;

        $cart_item = CartItem::where('cart_id', $cart_id)->where('product_id', $product_id)->first();
        if($cart_item) {
            $cart_item->delete();
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart item not found.',
            ]);
        }

        $cart_items = CartItem::where('cart_id', $cart_id)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Cart item deleted successfully.',
            'cart_items' => $cart_items,
        ]); 

    }


}
