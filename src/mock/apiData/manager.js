import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

let List = []
const count = 40

// 默认生成的模拟数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
     
	  id: Mock.Random.guid(),
	  role_id:Mock.Random.integer(1,20),
	  role:{
		  id: Mock.Random.increment(),
		 name:Mock.Random.pick(['站长','管理员','运营','账务']),
		 desc:Mock.Random.pick(['权限一','权限二','权限三','权限四']),
		  status: Mock.Random.integer(0,1)
	  },
      username: Mock.Random.first(),
      password: Mock.Random.string(),
	  avatar:Mock.Random.image('50x50', '#02adea', 'Hello'),
      status: Mock.Random.integer(0,1)
    })
  )
}

export default {
  //获取列表数据
  get: config => {
      const { username, page = 1, limit = 20 } = param2Obj(config.url)
     
      const mockList = List.filter(user => {
		  // 查询条件
            if (username && user.username.indexOf(username) === -1 ) return false
            return true
      })
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        count: mockList.length,
        list: pageList
      }
    },
  //增加用户
  create: config => {
    const {role_id,username, password, role, avatar, status} = JSON.parse(config.body)
    console.log(JSON.parse(config.body))
    List.unshift({
      id: Mock.Random.guid(),
      role_id: role_id,
	  role:{
	  		 id: Mock.Random.increment(),
	  		 name:Mock.Random.pick(['站长','管理员','运营','账务']),
	  		 desc:Mock.Random.pick(['权限一','权限二','权限三','权限四']),
	  		  status: Mock.Random.integer(0,1)
	  },
      username: username,
      password: password,
      avatar : Mock.Random.image('50x50', '#02adea', 'Hello'),
      status: status
    })
    return {
      code: 20000,
      data: {
        message: '添加成功'
      }
    }
  },
  //单个删除
  del: config => {
    const { id } = param2Obj(config.url)
    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 20000,
        message: '删除成功'
      }
    }
  },
  // 批量删除
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 20000,
      data: {
        message: '批量删除成功'
      }
    }
  },
  // 修改用户
  update: config => {
    const { id,role_id, username, password, role, avatar, status } = JSON.parse(config.body)
    // const sex_num = parseInt(sex)
    List.some(u => {
      if (u.id === id) {
		u.role_id = role_id,
        u.username = username,
        u.password = password,
		u.role = role,
        u.avatar= avatar,
        u.status= status
        return true
      }
    })
    return {
      code: 20000,
      data: {
        message: '编辑成功'
      }
    }
  }
}
