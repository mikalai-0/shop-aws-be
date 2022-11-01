import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import {Product} from './types/api-types';
import {productRepository} from "./lib/repositories";

export const createProductHandler = () => async (event, _context) => {
    try {
        const body = JSON.parse(event.body);
        const { title, description, count, price } = body;
        const product = { title, description, price };
        const response = await productRepository.CreateProduct(product, count);

        if ( title !== undefined && price !== undefined ) {
            return successResponse<Product>( response, 201 );
        }

        return errorResponse( { name: 'Bad Request', message: `title and price should be specified` }, 400 );
    }
    catch ( err ) {
        return errorResponse( {...err, name: event} );
    }
}