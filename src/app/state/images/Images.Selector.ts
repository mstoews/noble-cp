import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ImageModel } from "./Images.Model";

const selectImagesState = createFeatureSelector<ImageModel>('images');

export const selectImages = createSelector(
    selectImagesState, (state) => {
        return state.imageList
    }
);

export const isFundsLoading = createSelector(
    selectImagesState,
    ({ isLoading }) => isLoading
);


