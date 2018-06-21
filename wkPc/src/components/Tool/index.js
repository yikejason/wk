

// 时间 xx年xx小时xx分xx秒
export const changeTime = (second) => {
    const seconds = second % 60;
    const minutes = Math.floor(second / 60) % 60;
    const hours = Math.floor(second / (60*60)) % 24;
    const days = Math.floor(second / (60*60*24)) % 365;
    const years = Math.floor(second / (60*60*24*365));
    if(years){
        return `${years}年${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    if(days){
        return `${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    if(hours){
        return `${hours}小时${minutes}分${seconds}秒`;
    }
    if(minutes){
        return `${minutes}分${seconds}秒`;
    }
    return `${seconds}秒`;
}
export const currentDate = (join) =>{
    const date= new Date();
    const year=date.getFullYear(); 
    let month=date.getMonth()+1;
    let days = date.getDate();
    month =(month < 10 ? "0"+month : month);  
    days =(days < 10 ? "0"+days : days);
    if(!join) return `${year}年${month}月${days}日`;
    return `${year}${join}${month}${join}${days}${join}`;
}
