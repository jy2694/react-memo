export function saveData(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}
export function getData(key){
    return JSON.parse(localStorage.getItem(key));
}

export function saveBackground(value){
    localStorage.setItem("background", value);
}

export function getBackground(){
    return localStorage.getItem("background");
}