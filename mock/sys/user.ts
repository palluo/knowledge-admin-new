import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess } from '../_util';

function createFakeUserList() {
  return [
    {
      userId: '1',
      name: 'vben',
      nickname: 'Vben Admin',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      name: 'test',
      password: '123456',
      nickname: 'test user',
      desc: 'tester',
      token: 'fakeToken2',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  {
    url: '/api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { name, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.name === name && password === item.password
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const { userId, name: _username, token, nickname, desc, roles } = checkUser;
      return resultSuccess({
        roles,
        userId,
        name: _username,
        token,
        nickname,
        desc,
      });
    },
  },
  {
    url: '/api/getUserInfoById',
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;
      const checkUser = createFakeUserList().find((item) => item.userId === userId);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/api/getPermCodeByUserId',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;
      if (!userId) {
        return resultError('userId is not null!');
      }
      const codeList = fakeCodeList[userId];

      return resultSuccess(codeList);
    },
  },
] as MockMethod[];
