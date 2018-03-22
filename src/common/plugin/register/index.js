/*******
 *
 * 注册组件弹窗
 *
 */
import register from './register.vue';

register.install = (Vue) => Vue.component('register',register);

export default register;