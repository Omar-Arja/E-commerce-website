<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\User;

class Favorite extends Model
{
    use HasFactory;

    public function index(){
        $user_id = auth()->user()->id;
        $favorites = Favorite::where('user_id', $user_id)->get();

        foreach ($favorites as $favorite) {
            $name = Product::find($favorite->product_id)->name;
            $image_url = Product::find($favorite->product_id)->image_url;
            $price = Product::find($favorite->product_id)->price;

            $favorite->name = $name;
            $favorite->image_url = $image_url;
            $favorite->price = $price;
        }

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites,
        ]);
    }

    public function store($id){
        $user_id = auth()->user()->id;
        $favorite = new Favorite();
        $favorite->user_id = $user_id;
        $favorite->product_id = $id;
        $favorite->save();

        return response()->json([
            'status' => 'success',
            'favorite' => $favorite,
        ]);
    }

    public function destroy($id){
        $user_id = auth()->user()->id;
        $favorite = Favorite::where('user_id', $user_id)->where('product_id', $id)->first();
        $favorite->delete();

        return response()->json([
            'status' => 'success',
            'favorite' => $favorite,
        ]);
    }

    public function deleteAll(){
        $user_id = auth()->user()->id;
        $favorites = Favorite::where('user_id', $user_id)->get();

        foreach ($favorites as $favorite) {
            $favorite->delete();
        }

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites,
        ]);
    }

}
