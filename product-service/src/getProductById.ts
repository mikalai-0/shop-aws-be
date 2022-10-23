import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import productsMock from './assets/products.json';
import {Product} from './types/api-types';

export const getProductByIdHandler = () => async (event, _context) => {
    try {
        const productId = event.pathParameters['productId'];

        const product = productsMock.find(item => item.id === productId);

        if ( product ) {
            return successResponse<Product>( product );
        }

        return errorResponse( { name: 'Not Found', message: "Product not found" }, 404 );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}