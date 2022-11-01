import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import {Product, Stock} from './types/api-types';
import {productRepository, stockRepository} from "./lib/repositories";

export const getProductsListHandler = () => async (_event, _context) => {
    try {
        const productsData: Product[] = await productRepository.GetProducts();
        const stocks: Stock[] = await stockRepository.GetStocks();

        const response = productsData.map(product => {
            const stock: Stock = stocks.find(stock => stock.productId === product.id);
            return ({
                ...product,
                count: stock.count,
            })
        });

        return successResponse<Product[]>( response );
    }
    catch (err) {
        return errorResponse( err );
    }
}
