"use client";

import SearchBar from "@/testing/FilterableProductTable/searchBar";
import ProductTable from "@/testing/FilterableProductTable/ProductTable/productTable";
import {type Product} from "@/testing/FilterableProductTable/ProductTable/tableDataTypes";
import {useState} from "react";

export default function FilterableProductTable({products}: { products: Product[] }) {
    const [filterText, setFilterText] = useState<string>('');
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);

    return (
        <div>
            <SearchBar
                filterText={filterText}
                inStockOnly={inStockOnly}
                onFilterTextChange={setFilterText}
                onInStockOnlyChange={setInStockOnly}
            />
            <ProductTable
                products={products}
                filterText={filterText}
                inStockOnly={inStockOnly}
            />
        </div>
    );
}