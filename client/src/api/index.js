import ajax from './ajax'

// 1. 基础路径
const BASE_URL = '/api';
// const BASE_URL = 'http://localhost:5001/api';

// 2. 请求方法

// 2.1 用户注册
export const register = (registerUser) => ajax(`${BASE_URL}/users/register`, registerUser, 'POST');
// 2.2 用户登录
export const login = (loginUser) => ajax(`${BASE_URL}/users/login`, loginUser, 'POST');
// 2.3 获取所有用户信息
export const getUsers = () => ajax(`${BASE_URL}/users`);
// 2.3 根据用户ID获取用户信息
export const getUserInfoById = (id) => ajax(`${BASE_URL}/users/${id}`);
// 2.3 增加或编辑用户信息
export const addOrEditUser = (url, params) => ajax(`${BASE_URL}/users/${url}`, params, 'POST');
// 2.3 根据用户ID编辑用户信息
export const editUserInfoById = (id, params) => ajax(`${BASE_URL}/users/edit/${id}`, params, 'POST');


// 2.4 商品数据
export const getGoods = () => ajax(`${BASE_URL}/goods`);
// 2.5 编辑商品数据
export const editGoods = (id, params) => ajax(`${BASE_URL}/goods/edit/${id}`, params, 'POST');
// 2.3 增加或编辑商品信息
export const addOrEditGoods = (url, params) => ajax(`${BASE_URL}/goods/${url}`, params, 'POST');
// 2.5 删除商品数据
export const deleteGoods = (id) => ajax(`${BASE_URL}/goods/${id}`, false, 'DELETE');


// 2.5 订单数据
export const getOrders = () => ajax(`${BASE_URL}/orders`);
// 2.5 编辑订单数据
export const editOrders = (id, params) => ajax(`${BASE_URL}/orders/edit/${id}`, params, 'POST');
// 2.3 增加或编辑订单信息
export const addOrEditOrders = (url, params) => ajax(`${BASE_URL}/orders/${url}`, params, 'POST');
// 2.5 删除订单数据
export const deleteOrders = (id) => ajax(`${BASE_URL}/orders/${id}`, false, 'DELETE');