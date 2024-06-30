import { Signal, WritableSignal } from "@angular/core";

// Generic function for logging 

export function logSignal<T>(sg : Signal<T>, property?: keyof T){
    if (property ) {
        console.debug('signal debug: ', sg()[property]);       
    }
    else {
        console.debug('signal debug: ', sg());
    }
}


// Generic function for undating a property of the signal property 
// updateSignalPropery(signal)

export function updateSignalProperty<T, K extends keyof T> (sg: WritableSignal<T>, prop: keyof T, value: T[K]) {
    sg.update(obj => ({
        ...obj, [prop]: value
    }));
}


export function updateSignalObject<T, U> (sg: WritableSignal<T>, value: U[]) {
    sg.update(obj => ({
        ...obj, value
    }));
}
