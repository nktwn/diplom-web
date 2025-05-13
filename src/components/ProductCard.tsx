import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const minPrice = product.lowest_product_supplier?.price ?? 0;

    return (
        <Link href={`/product/${product.id}`}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer">
                <img
                    src={product.ImageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                />
                <div className="p-3">
                    <h3 className="text-md font-semibold text-[var(--foreground)]">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">от {minPrice}₽</p>
                    <button className="mt-3 w-full bg-[var(--primary)] text-white text-sm py-1.5 rounded hover:bg-[var(--primary-hover)] transition duration-300">
                        Подробнее
                    </button>
                </div>
            </div>
        </Link>
    );
}
