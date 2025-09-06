import {type Product} from "@/testing/FilterableProductTable/ProductTable/tableDataTypes";
import ProductCategoryRow from "@/testing/FilterableProductTable/ProductTable/productCategoryRow";
import ProductRow from "@/testing/FilterableProductTable/ProductTable/productRow";
import {JSX} from "react";

export default function ProductTable({
                                         products,
                                         filterText,
                                         inStockOnly
                                     }: {
    products: Product[],
    filterText: string,
    inStockOnly: boolean,
}) {
    const rows: JSX.Element[] = [];
    let lastCategory: string | null = null;

    // products sorted
    products.forEach((product) => {
        if (inStockOnly && !product.stocked) {
            return;
        }
        if (
            product.name.toLowerCase().indexOf(
                filterText.toLowerCase()
            ) === -1
        ) {
            return;
        }

        if (product.category !== lastCategory) {
            rows.push(
                <ProductCategoryRow
                    category={product.category}
                    key={product.category}/>
            );
        }
        rows.push(
            <ProductRow
                product={product}
                key={product.name}/>
        );
        lastCategory = product.category;
    });

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}
