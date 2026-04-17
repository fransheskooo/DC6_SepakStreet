<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@sepakstore.test'],
            ['name' => 'Sepak Admin', 'role' => 'admin', 'password' => Hash::make('password')]
        );
        $admin->cart()->firstOrCreate();

        $customer = User::updateOrCreate(
            ['email' => 'customer@sepakstore.test'],
            ['name' => 'Juan Dela Cruz', 'role' => 'customer', 'password' => Hash::make('password')]
        );
        $customer->cart()->firstOrCreate();

        $categories = collect([
            ['name' => 'Balls', 'description' => 'Match and training balls'],
            ['name' => 'Apparel', 'description' => 'Jerseys and shorts'],
            ['name' => 'Accessories', 'description' => 'Bags, wraps, and guards'],
            ['name' => 'Training Gear', 'description' => 'Nets and cones'],
        ])->mapWithKeys(function ($category) {
            $record = Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category + ['slug' => Str::slug($category['name'])]
            );

            return [$record->slug => $record];
        });

        $products = [
            ['name' => 'Sepak Match Ball', 'category' => 'balls', 'price' => 799, 'stock' => 20, 'featured' => true, 'description' => 'Official match quality sepak takraw ball for competition and daily training.'],
            ['name' => 'Training Jersey', 'category' => 'apparel', 'price' => 999, 'stock' => 8, 'featured' => true, 'description' => 'Breathable jersey built for intense training sessions.'],
            ['name' => 'Ankle Support', 'category' => 'accessories', 'price' => 450, 'stock' => 12, 'featured' => true, 'description' => 'Supportive ankle brace for added stability during play.'],
            ['name' => 'Mini Ball', 'category' => 'balls', 'price' => 399, 'stock' => 25, 'featured' => false, 'description' => 'Compact training ball for footwork drills and beginner practice.'],
            ['name' => 'Nanyang Shoes', 'category' => 'apparel', 'price' => 2499, 'stock' => 5, 'featured' => false, 'description' => 'Classic Nanyang court shoes with dependable grip for sepak takraw movement.'],
            ['name' => 'Takraw Net', 'category' => 'training-gear', 'price' => 1799, 'stock' => 18, 'featured' => false, 'description' => 'Tournament-size net for practice courts and school gyms.'],
            ['name' => 'Grip Wrap', 'category' => 'accessories', 'price' => 160, 'stock' => 55, 'featured' => false, 'description' => 'Soft grip wrap for better ball control and comfort.'],
            ['name' => 'Player Jersey', 'category' => 'apparel', 'price' => 899, 'stock' => 15, 'featured' => false, 'description' => 'Lightweight jersey for practice and team matches.'],
            ['name' => 'Socks', 'category' => 'apparel', 'price' => 250, 'stock' => 32, 'featured' => false, 'description' => 'Breathable sports socks designed for court movement.'],
        ];

        foreach ($products as $index => $data) {
            $product = Product::updateOrCreate(
                ['sku' => 'SS'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT)],
                [
                    'category_id' => $categories[$data['category']]->id,
                    'name' => $data['name'],
                    'slug' => Str::slug($data['name']),
                    'price' => $data['price'],
                    'description' => $data['description'],
                    'image' => null,
                    'is_featured' => $data['featured'],
                    'is_active' => true,
                ]
            );

            $product->inventory()->updateOrCreate(
                ['product_id' => $product->id],
                ['stock' => $data['stock'], 'low_stock_threshold' => 10]
            );
        }

        if (! Order::exists()) {
            $address = ShippingAddress::create([
                'user_id' => $customer->id,
                'full_name' => 'Juan Dela Cruz',
                'phone' => '09171234567',
                'address_line' => '45 Sampaguita Street',
                'city' => 'Pasig City',
                'province' => 'Metro Manila',
                'postal_code' => '1600',
                'landmark' => 'Near sports complex',
            ]);

            $order = Order::create([
                'user_id' => $customer->id,
                'shipping_address_id' => $address->id,
                'order_number' => '#SS-10021',
                'payment_method' => 'Cash on Delivery',
                'status' => 'Pending',
                'subtotal' => 2048,
                'shipping_fee' => 100,
                'total' => 2148,
                'placed_at' => now()->subDay(),
            ]);

            $matchBall = Product::where('slug', 'sepak-match-ball')->first();
            $ankleSupport = Product::where('slug', 'ankle-support')->first();

            $order->items()->createMany([
                [
                    'product_id' => $matchBall->id,
                    'product_name' => $matchBall->name,
                    'unit_price' => $matchBall->price,
                    'quantity' => 2,
                    'line_total' => 1598,
                ],
                [
                    'product_id' => $ankleSupport->id,
                    'product_name' => $ankleSupport->name,
                    'unit_price' => $ankleSupport->price,
                    'quantity' => 1,
                    'line_total' => 450,
                ],
            ]);
        }
    }
}
