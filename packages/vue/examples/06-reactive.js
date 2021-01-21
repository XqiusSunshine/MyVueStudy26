//vue3中利用proxy作拦截
function reactive(obj) {
  //obj 必须 是对象
  if (typeof obj !== 'object' || typeof obj === null) {
    return obj
  }
  return new Proxy(obj, {
    get(target, key) {
      console.log('get', key)
      const val = Reflect.get(target, key)
      //依赖收集
      track(target, key)
      //反射方式去获取 当用户使用这个值 时去判断 ，若是对象，则递归
      return typeof val === 'oject' ? reactive(val) : val
    },
    set(target, key, val) {
      console.log('set', key)
      //   target[key] = val

      const ret = Reflect.set(target, key, val)
      //触发过程
      trigger(target, key)
      return ret
    },
    deleteProperty(target, key) {
      console.log('delete', key)
      //触发过程
      trigger(target, key)
      const ret = Reflect.deleteProperty(target, key)
      return ret
    }
  })
}

//临时保存副作用函数
const effectStack = []

//添加副作用
function effect(fn) {
  //包装一下，处理错误
  const e = createReactiveEffect(fn)
  // 立即执行一次
  e()
  return e
}
function createReactiveEffect(fn) {
  //高阶函数
  //处理fn可能的错误
  const effect = function() {
    try {
      //放入临时数组
      effectStack.push(effect)
      //执行fn
      return fn()
    } catch (error) {
    } finally {
      effectStack.pop()
    }
  }
  return effect
}
//映射 表
const targetMap = new WeakMap()

//依赖收集
function track(target, key) {
  //尝试获取 effect函数
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    //获取 target对应的Map
    let depMap = targetMap.get(target)

    //初始化时需创建
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    let deps = depMap.get(key)
    if (!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }

    deps.add(effect)
  }
}
//依赖触发
function trigger(target, key) {
  //获取target对应的map
  const depMap = targetMap.get(target)
  if (!depMap) {
    return
  }
  //获取key对应的set
  const deps = depMap.get(key)
  if (deps) {
    //遍历执行
    deps.forEach(dep => {
      dep()
    })
  }
}

const state = reactive({
  foo: 'foo',
  n: {
    a: 1
  }
})
// state.foo
// state.foo = 'xqius'
// state.bar = 'bar'
// delete state.foo
effect(() => {
  console.log('effect1', state.foo)
})
effect(() => {
  console.log('effect2', state.n.a, state.foo)
})
// state.n
// state.n.a
//两个副作用函数都执行了
// state.foo = 'xqius'
state.n.a = 10
