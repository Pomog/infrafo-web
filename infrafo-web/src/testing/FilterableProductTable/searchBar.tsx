export default function SearchBar({
                                      filterText,
                                      inStockOnly
                                  }: {
    filterText: string,
    inStockOnly: boolean,
}) {
    return (
        <form>
            <input
                type="text"
                value={filterText}
                placeholder="Search..."
            />
            <label>
                <input
                    type="checkbox"
                    checked={inStockOnly}
                />
                {' '}
                Only show products in stock
            </label>
        </form>
    );
}