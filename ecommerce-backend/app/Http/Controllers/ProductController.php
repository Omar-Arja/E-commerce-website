<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(){
        $products = Product::all();

        foreach ($products as $product) {
            $category = Category::find($product->category_id)->name;
            $product->category_id = $category;
        }

        return response()->json([
            'status' => 'success',
            'products' => $products,
        ]);
    }

    public function show($id){
        $product = Product::find($id);
        $category = Category::find($product->category_id)->name;
        $product->category_id = $category;

        return response()->json([
            'status' => 'success',
            'product' => $product,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category' => 'required|string|max:200',
        ]);
        

        $user = auth()->user();
        if ($user->usertype_id == 1) {
            $product = new Product();
            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;

            $image_name = time().'.'.$request->image->extension();  
            $request->image->move(public_path('/images'), $image_name);
            $image_url = '/ecommerce-backend/public/images/'.$image_name;
            $product->image_url = $image_url;

            try {
                $request->category = strtolower($request->category);
                $category_id = Category::where('name', $request->category)->first()->id;
            } catch (\Throwable $th) {
                $request->category = strtolower($request->category);
                $category = new Category();
                $category->name = $request->category;
                $category->save();
                $category_id = $category->id;
            }


            $product->category_id = $category_id;


            $product->save();
            return response()->json([
                'status' => 'success',
                'product' => $product,
            ]);
        }
        else {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category' => 'required|string|max:200',
        ]);

        $user = auth()->user();

        if ($user->usertype_id == 1) {
           $product = Product::find($id);
            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;

            $image_name = time().'.'.$request->image->extension();
            $request->image->move(public_path('/images'), $image_name);
            $image_url = '/ecommerce-backend/public/images/'.$image_name;
            $product->image_url = $image_url;

            $category_id = Category::where('name', $request->category)->first()->id;
            $product->category_id = $category_id;

            $product->save();

            return response()->json([
                'status' => 'success',
                'product' => $product,
            ]);

        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }
    }

    public function destroy($id) {
        $user = auth()->user();

        if ($user->usertype_id == 1) {
            $product = Product::find($id);
            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product deleted successfully',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }
    }

    

}
