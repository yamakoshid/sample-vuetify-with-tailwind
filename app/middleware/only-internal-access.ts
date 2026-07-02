export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to.path, from.path)
  if (to.path === from.path) {
    return navigateTo('/')
  }
})
