import { createAction, props } from "@ngrx/store";
import { ImageItem, ImageItemIndex } from "app/models/imageItem";

export const LOAD_IMAGE = '[images] getall';
export const LOAD_IMAGE_SUCCESS = '[images] getall success';
export const LOAD_IMAGE_FAILURE = '[images] getall failure'; 

export const LOAD_IMAGE_DROPDOWN = '[images] getall dropdown';
export const LOAD_IMAGE_DROPDOWN_SUCCESS = '[images] getall dropdown success';
export const LOAD_IMAGE_DROPDOWN_FAILURE = '[images] getall dropdown failure';

export const DELETE_IMAGE = '[images] delete'
export const DELETE_IMAGE_SUCCESS = '[images] delete success'

export const ADD_IMAGE = '[images] add'
export const ADD_IMAGE_SUCCESS = '[images] add success'

export const UPDATE_IMAGE = '[images] update'
export const UPDATE_IMAGE_SUCCESS = '[images] update success'

export const GET_IMAGE = '[images] get'

export const loadImage = createAction(LOAD_IMAGE);
export const loadImageSuccess = createAction(LOAD_IMAGE_SUCCESS, props<{ images: ImageItemIndex[] }>());
export const loadImageFailure = createAction(LOAD_IMAGE_FAILURE, props<{ error: string }>());

export const deleteImage = createAction(DELETE_IMAGE, props<{ id: number }>());
export const deleteImageSuccess = createAction(DELETE_IMAGE_SUCCESS, props<{ id: number }>());

export const addImage = createAction(ADD_IMAGE, props<{ images: ImageItemIndex }>());
export const addImageSuccess = createAction(ADD_IMAGE_SUCCESS, props<{ images: ImageItemIndex }>());

export const updateImage = createAction(UPDATE_IMAGE, props<{ images: ImageItemIndex }>());
export const updateImageSuccess = createAction(UPDATE_IMAGE_SUCCESS, props<{ images: ImageItemIndex }>());

export const getImageById = createAction(GET_IMAGE, props<{ id: number }>());
export const getImageSuccess = createAction(UPDATE_IMAGE_SUCCESS, props<{ images: ImageItemIndex }>());
export const getImageFailure = createAction(LOAD_IMAGE_FAILURE, props<{ error: string }>());

export const ImageActions = {
    loadImage,
    loadImageSuccess,
    loadImageFailure,
    deleteImage,
    deleteImageSuccess,
    addImage,
    addImageSuccess,
    updateImage,
    updateImageSuccess,
    getImageById,
    getImageSuccess,
    getImageFailure,    
};



