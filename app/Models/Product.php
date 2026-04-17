<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'price',
        'description',
        'image',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['status_label', 'is_low_stock', 'available_stock'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->inventory?->stock > 0 && $this->inventory?->stock <= $this->inventory?->low_stock_threshold;
    }

    public function getAvailableStockAttribute(): int
    {
        return $this->inventory?->stock ?? 0;
    }

    public function getStatusLabelAttribute(): string
    {
        if (! $this->is_active || $this->available_stock === 0) {
            return 'Out';
        }

        return $this->is_low_stock ? 'Low' : 'Available';
    }
}
