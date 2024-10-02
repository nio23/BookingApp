export function isCurrentDay(date: Date){
    let currentDate = new Date();
    return date.getDate() == currentDate.getDate() && date.getMonth() == currentDate.getMonth();
}

export function toOnlyDateString(date: Date): string{
    let strDate = [];
    strDate.push(date.getFullYear());
    strDate.push(date.getMonth() + 1);
    strDate.push(date.getDate());
    return strDate.join('-');
}

export function toISOStringFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
