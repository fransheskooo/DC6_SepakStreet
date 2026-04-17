<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_add_to_cart_and_checkout(): void
    {
        $this->seed();
        $this->withoutVite();

        $customer = User::where('email', 'customer@sepakstore.test')->firstOrFail();
        $product = Product::where('slug', 'sepak-match-ball')->firstOrFail();

        $this->actingAs($customer)
            ->post('/cart/items', ['product_id' => $product->id, 'quantity' => 2])
            ->assertRedirect();

        $this->actingAs($customer)
            ->post('/checkout', [
                'full_name' => 'Juan Dela Cruz',
                'phone' => '09171234567',
                'address_line' => '45 Sampaguita Street',
                'city' => 'Pasig City',
                'province' => 'Metro Manila',
                'postal_code' => '1600',
                'landmark' => 'Near sports complex',
                'payment_method' => 'Cash on Delivery',
            ])
            ->assertRedirect();

        $this->assertGreaterThanOrEqual(2, Order::count());
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $this->seed();
        $this->withoutVite();

        $customer = User::where('email', 'customer@sepakstore.test')->firstOrFail();

        $this->actingAs($customer)
            ->get('/admin/dashboard')
            ->assertForbidden();
    }

    public function test_customer_can_view_orders_section(): void
    {
        $this->seed();
        $this->withoutVite();

        $customer = User::where('email', 'customer@sepakstore.test')->firstOrFail();

        $this->actingAs($customer)
            ->get('/orders')
            ->assertOk()
            ->assertSee('#SS-10021');
    }
}
