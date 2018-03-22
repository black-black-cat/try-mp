/**
 * Created by TIAN on 2017/10/25.
 * 加强体验，页面跳转切换
 */
import transform from 'lib/ani/transform'
import viewport from 'lib/comp/viewport'
import browser from "lib/util/browser"

let bodyStyle;
export default {
    start (fn) {
        if(browser.WX){
            let body = document.body;
            let width = window.innerWidth;
            let height = Math.max(window.innerHeight, body.scrollHeight);
            let node = document.createElement("DIV");
            node.classList.add("m-page-switch");
            node.style.cssText = `;position: fixed; width: ${width}px; height: ${height}px; top: 0px; left: ${width}px; z-index: 202012121; background: #fff; `;
            body.appendChild(node);
            let style = document.body.style;
            bodyStyle = style;
            style.cssText = transform(320, -width, 0, true);
            setTimeout(() => {
                node.style.left = "0px";
                (typeof fn === "function") && fn();
            }, 320);
        }else{
            (typeof fn === "function") && fn();
        }
        
    },
    end () {
        if(browser.WX){
            let node = document.querySelector(".m-page-switch");
            node && document.body.removeChild(node);
        }
        // bodyStyle.cssText = transform(320, 0, 0, true);
        location.reload();
    }
}

