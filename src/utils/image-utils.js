function getImageURL(url){
    return new URL(`../assets/${url}.png`,import.meta.url).href
}

export {getImageURL}