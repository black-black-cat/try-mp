/*******
 * props默认值
 */

export const array = {
    type: Array,
    default () {
        return []
    }
};

export const object = {
    type: Object,
    default () {
        return []
    }
};

export const boolean = function(bool = true){
    return {
        type: Boolean,
        default: bool
    }
};

export const string = function(str = ""){
    return {
        type: String,
        default: str
    }
};

export const number = function(num = 0){
    return {
        type: Number,
        default: num
    }
};