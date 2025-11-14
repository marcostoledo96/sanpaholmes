import React from 'react';
import { Product } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { PoliceButton } from './PoliceButton';
import { ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border border-[#fbbf24]/20 rounded-2xl overflow-hidden evidence-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/20 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-3 right-3">
          <CategoryBadge category={product.category} />
        </div>
        
        {/* Evidence number */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[#fbbf24] px-3 py-1.5 border border-[#fbbf24]/30 rounded-lg text-sm">
          #{product.id}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white mb-2 group-hover:text-[#fbbf24] transition-colors">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#fbbf24]/10">
          <div className="text-[#fbbf24]">
            <span className="text-2xl font-semibold">${product.price}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black rounded-xl hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-[#fbbf24]/30 hover:scale-105 active:scale-100"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}