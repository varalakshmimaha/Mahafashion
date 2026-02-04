<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Product::with(['category', 'subcategory', 'variants', 'images'])->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'SKU',
            'Name',
            'Description',
            'Category',
            'Subcategory',
            'Price',
            'Discount',
            'Stock Quantity',
            'Status',
            'Fabric Type',
            'Brand',
            'Color',
            'Package Contains',
            'Fit',
            'Origin',
            'Is Trending',
            'Is New Arrival',
            'Is Ethnic Wear',
            'Is Suwish Collection',
            'Created At',
            'Updated At',
        ];
    }

    /**
     * @param mixed $product
     * @return array
     */
    public function map($product): array
    {
        return [
            $product->id,
            $product->sku,
            $product->name,
            $product->description,
            $product->category ? $product->category->name : '',
            $product->subcategory ? $product->subcategory->name : '',
            $product->price,
            $product->discount,
            $product->stock_quantity,
            $product->status,
            $product->fabric_type,
            $product->brand,
            $product->color,
            $product->package_contains,
            $product->fit,
            $product->origin,
            $product->is_trending ? 'Yes' : 'No',
            $product->is_new_arrival ? 'Yes' : 'No',
            $product->is_ethnic_wear ? 'Yes' : 'No',
            $product->is_suwish_collection ? 'Yes' : 'No',
            $product->created_at ? $product->created_at->format('Y-m-d H:i:s') : '',
            $product->updated_at ? $product->updated_at->format('Y-m-d H:i:s') : '',
        ];
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 8,  // ID
            'B' => 15, // SKU
            'C' => 30, // Name
            'D' => 50, // Description
            'E' => 15, // Category
            'F' => 15, // Subcategory
            'G' => 10, // Price
            'H' => 10, // Discount
            'I' => 12, // Stock
            'J' => 12, // Status
            'K' => 15, // Fabric Type
            'L' => 15, // Brand
            'M' => 15, // Color
            'N' => 20, // Package Contains
            'O' => 12, // Fit
            'P' => 12, // Origin
            'Q' => 12, // Is Trending
            'R' => 15, // Is New Arrival
            'S' => 15, // Is Ethnic Wear
            'T' => 20, // Is Suwish Collection
            'U' => 20, // Created At
            'V' => 20, // Updated At
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2E8F0']
                ]
            ],
        ];
    }
}
