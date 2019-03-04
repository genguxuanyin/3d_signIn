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


// 2.4 活动数据
export const getActivities = () => ajax(`${BASE_URL}/activities`);
// 2.5 编辑活动数据
export const editActivities = (id, params) => ajax(`${BASE_URL}/activities/edit/${id}`, params, 'POST');
// 2.3 增加或编辑活动信息
export const addOrEditActivities = (url, params) => ajax(`${BASE_URL}/activities/${url}`, params, 'POST');
// 2.5 删除活动数据
export const deleteActivities = (id) => ajax(`${BASE_URL}/activities/delete/${id}`, false, 'DELETE');