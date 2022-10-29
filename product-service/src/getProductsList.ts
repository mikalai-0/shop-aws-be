import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import productsMock from './assets/products.json';
import {Product} from './types/api-types';

export const getProductsListHandler = () => async (_event, _context) => {
    try {
        return successResponse<Product[]>( productsMock );
    }
    catch (err) {
        return errorResponse( err );
    }
}
