//vue3中利用proxy作拦截
function reactive(obj) {
  return new Proxy(obj, {
    get(target,key) {
        console.log('get',key)
        return target[key]
    },
    set(target,key,val) {
        console.log('set',key)
        target[key] = val
    },
    deleteProperty(target,key) {
        console.log('delete',key)
        delete target.key
    }
  })
}

const state = reactive({
    foo : 'foo'
})
state.foo
state.foo = 'xqius'
state.bar = 'bar'
delete state.foo