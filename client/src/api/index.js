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
// 2.4 根据当前用户活动数据
export const getActivitiesByAccount = (account) => ajax(`${BASE_URL}/activities/${account}`);
// 2.4 根据当前活动id获取活动数据
export const getActivitiesById = (id) => ajax(`${BASE_URL}/activities/show/${id}`);
// 2.6 编辑活动数据
export const editActivities = (id, params) => ajax(`${BASE_URL}/activities/edit/${id}`, params, 'POST');
// 2.7 增加或编辑活动信息
export const addOrEditActivities = (url, params) => ajax(`${BASE_URL}/activities/${url}`, params, 'POST');
// 2.8 删除活动数据
export const deleteActivities = (id) => ajax(`${BASE_URL}/activities/delete/${id}`, false, 'DELETE');

//管理
//签到列表
export const getSignInList = () => ajax(`${BASE_URL}/signInUsers`);
//留言列表
export const getDanmakuList = () => ajax(`${BASE_URL}/danmakus`);

// 2.1 用户签到
export const signIn = (user) => ajax(`${BASE_URL}/signInUsers/signIn`, user, 'POST');
// 2.3 根据用户ID获取用户信息
export const getSignInUserInfoById = (id) => ajax(`${BASE_URL}/signInUsers/${id}`);

// 2.1 添加获奖信息
export const addWin = (user) => ajax(`${BASE_URL}/wins/add`, user, 'POST');
// 2.3 根据活动ID和用户ID获取获奖信息
export const getWin = (activityIdAndUserId) => ajax(`${BASE_URL}/wins/`, activityIdAndUserId, 'POST');