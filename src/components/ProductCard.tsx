import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const minPrice = product.lowest_product_supplier?.price ?? 0;

    return (
        <Link href={`/product/${product.id}`}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow hover:shadow-md transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col h-[340px] w-full">
                <div className="w-full h-40 flex items-center justify-center bg-white">
                    <img
                        src={product.ImageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                <div className="p-3 flex flex-col justify-between flex-grow overflow-hidden">
                    <h3 className="text-md font-semibold text-[var(--foreground)] line-clamp-2 h-[3.2em]">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">от {minPrice.toLocaleString()} ₸</p>
                    <button className="mt-3 w-full bg-[var(--primary)] text-white text-sm py-1.5 rounded hover:bg-[var(--primary-hover)] transition duration-300">
                        Подробнее
                    </button>
                </div>
            </div>
        </Link>
    );
}
