import 'common/skin/skin_1.1/skin.scss'
// import 'lib/console/vconsole.min'
import 'common/utils/polyfill'

//app  iphoneX兼容样式
import browser from "lib/util/browser"
if (browser.APP && browser.IOS) {
    document.documentElement.classList.add("iphoneX");
} else if (browser.IOS) {
    document.documentElement.classList.add("iphoneX-browser");
}
