import * as handlers from './src/functions';

export const getProductsList = handlers.getProductsListHandler();
export const getProductById = handlers.getProductByIdHandler();
export const createProduct = handlers.createProductHandler();
export const catalogBatchProcess = handlers.catalogBatchProcessHandler;
