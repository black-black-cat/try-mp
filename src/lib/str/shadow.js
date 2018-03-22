/**
 * 为字符串加上掩码，前后保留两个可见字符，其它的都变成*
 * 例子：
 *
 * import shadow from "../str/shadow";
 * var str = shadow("hello world"); // he*******ld
 * before : 前保留位数
 * back : 后保留位数
 *
 */
export default function(match, before,back) {    
    match = String(match);
    if (match.length == 1) {
        match = "*";
    } else if (match.length < 5) {
        match = match.split("");
        match[1] = match[match.length - 2] = "*";
        match = match.join("");
    } else {
        before = before || 2;
        back = back || 2;
        match = match.substring(0,before) + new Array(match.length - before - back +1).join("*") + match.substring(match.length - back);
        // match = match[0] + match[1] + new Array(match.length - 3).join("*") + match[match.length - 2] + match[match.length - 1];
    }

    return match;
}