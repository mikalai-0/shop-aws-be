import { errorResponse, successResponse } from "../../utils/apiResponseBuilder";
import {Product, Stock} from '../../types/api-types';
import {productRepository, stockRepository} from "../../lib/repositories";

export const getProductByIdHandler = () => async (event, _context) => {
    try {
        const productId = event.pathParameters['productId'];
        const product: Product = await productRepository.GetProduct(productId);
        const stock: Stock = await stockRepository.GetStockByProductId(productId);

        if ( product ) {
            const response = { ...product, count: stock?.count || 0 };
            return successResponse<Product>( response );
        }

        return errorResponse( { name: 'Not Found', message: `Product ${productId} not found` }, 404 );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}