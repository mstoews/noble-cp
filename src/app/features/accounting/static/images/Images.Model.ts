import {imageItem } from  'app/models';

export interface ImageModel {
    imageList: imageItem[],
    activeImageId: number | null,
    selectedImage: imageItem,
    isLoading: boolean,
    error: string,
}

