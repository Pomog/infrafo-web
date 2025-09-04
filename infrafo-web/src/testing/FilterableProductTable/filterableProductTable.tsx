import SearchBar from "@/testing/FilterableProductTable/searchBar";
import ProductTable from "@/testing/FilterableProductTable/ProductTable/productTable";
import {type Product} from "@/testing/FilterableProductTable/ProductTable/tableDataTypes";

export default function FilterableProductTable({products}: { products: Product[] }) {
    return (
        <div>
            <SearchBar/>
            <ProductTable products={products}/>
        </div>
    );
}