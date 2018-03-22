/**
 * Created by TIAN on 2017/10/25.
 * 打开一个新的页面
 */
import query from 'lib/json/query'
import pageSwitch from './pageSwitch'
import webBridge from 'common/utils/webBridge'
import browser from 'lib/util/browser'
export default function (url, str, animated=true) {
    if (!animated) {
        location.assign(str ? query.url(url, str) : url);
        return;
    }
    pageSwitch.start(() => {
    	url = str ? query.url(url, str) : url
    	if(browser.WX){
            location.assign(url);
        }else{
            webBridge.openUrl(url);
        }        
    });
    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            pageSwitch.end()
        }
    });
}
