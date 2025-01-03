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

export function toISOStringFormat(date: any): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
