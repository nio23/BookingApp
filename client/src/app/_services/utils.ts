export function isCurrentDay(date: Date){
    let currentDate = new Date();
    return date.getDate() == currentDate.getDate() && date.getMonth() == currentDate.getMonth();
}

export function toOnlyDateString(date: Date){
    let strDate = [];
    strDate.push(date.getFullYear());
    strDate.push(date.getMonth() + 1);
    strDate.push(date.getDate());
    return strDate.join('-');
}