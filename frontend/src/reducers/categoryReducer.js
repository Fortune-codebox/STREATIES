import { bindActionCreators } from 'redux';
import {
  ALL_CATEGORIES_REQUEST,
  ALL_CATEGORIES_SUCCESS,
  ALL_CATEGORIES_FAIL,
  ALL_SUBCATEGORIES_REQUEST,
  ALL_SUBCATEGORIES_SUCCESS,
  ALL_SUBCATEGORIES_FAIL,
  CLEAR_ERRORS
} from '../constants/categoryConstants';


export const categoriesReducer = (state = {categories: []}, action) => {
    switch(action.type) {

        case ALL_CATEGORIES_REQUEST:
            return {
                loading: true,
                categories: []
            }

        case ALL_CATEGORIES_SUCCESS:
            return {
                loading: false,
                categories: action.payload.categories,
                catNames: action.payload.catNames
            }

        case ALL_CATEGORIES_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }


        default:
            return state
    }
}

export const subCategoriesReducer = (state = {subCategories: []}, action) => {
    switch(action.type) {

        case ALL_SUBCATEGORIES_REQUEST:
            return {
                loading: true,
                subCategories: []
            }

        case ALL_SUBCATEGORIES_SUCCESS:
            return {
                loading: false,
                subCategories: action.payload.subCategories,
                subCatNames: action.payload.subCatNames
            }

        case ALL_SUBCATEGORIES_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }


        default:
            return state
    }
}