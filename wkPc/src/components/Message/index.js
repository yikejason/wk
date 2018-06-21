import { message } from 'antd';

/**
 * @param    {object|Arrary}  Data        接口返回Data数据
 * @param    {Number}         Ret         返回Ret                                              
 * @param    {String}         Msg         返回Msg
 * @param    {String}         mesType     提示类型
 * 
 * @date     2017/05/04
 * @author   Lin
 */

// 请求全局提示
export function messageFetch({Data,Ret,Msg},mesType=false,field=false) {
    // 返回结果（0-成功；>0-失败） Ret=0 成功返回/Ret=1 参数错误/Ret=2 频率受限 /Ret=3 Token无效 /Ret=4 服务器内部错误 /Ret=5 用户操作错误 / Ret=6 停机维护
    //先销毁去重
  message.destroy();
  const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`;
  const messageType = (types,text) =>{
        if(!types){
            message.error(text);
        }else{
            switch (types) {
                case 'error':  
                    message.error(text);
                    break;
                case 'warning':  
                    message.warning(text);
                    break;
                case 'success':  
                    message.success(text);
                    break;
                case 'info':  
                    message.info(text);
                    break;
                default:  
                    message.error(text);
                    break;
            }
        }
    }
    // Data为数组、对象不提示
    if(isType('Object')(Data) && Data && Object.keys(Data).length > 0) {
        if(!field){
            return;
        } else{
            if(Data.hasOwnProperty(field) && !!Data[field] && (Object.keys(Data[field]).length > 0 ||　Data[field].length > 0)) return;
                messageType(mesType,'暂无相关数据');
                 return
        }
    };
    if(isType('Array')(Data) && Data.length > 0) return;
    // 错误提示为空
    if(typeof Msg === 'string' && Msg.trim() == ""){
        switch (Ret-0) {
            case 1: 
                messageType(mesType,'参数错误');
                break;
            case 2: 
                messageType(mesType,'频率受限');
                break;
            case 3: 
                messageType(mesType,'Token无效');
                break;
            case 4: 
                messageType(mesType,'服务器内部错误');
                break;
            case 5: 
                messageType(mesType,'用户操作错误');
                break;
            case 6: 
                messageType(mesType,'停机维护');
                break;
            default: 
                break;    
        }   
        return;
    }else{
       messageType(mesType,Msg);
    }
    return
}
  