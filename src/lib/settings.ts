import { currentWritable } from '@threlte/core';
import { writable } from 'svelte/store';
import { Vector3 } from 'three';

export const global_illumination = writable([0, 0, 0]);

export const time_of_day = writable(0);

export const camera_position = currentWritable(new Vector3(0, 0, 0));
