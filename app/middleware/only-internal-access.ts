export default defineNuxtRouteMiddleware((to, from) => {
  // 1. クライアント側（ブラウザ）での直接アクセス判定
  // 2. サーバー側（SSR）での最初のアクセスも、実質「直接アクセス」として扱う
  const isDirectAccess = import.meta.server || from.name === undefined

  // 3. 同じページ内でのハッシュ（#）移動かどうかを判定
  const isSamePageHash = to.path === from.path && to.hash !== from.hash

  // 直接アクセス、かつ同じページ内のハッシュ移動「ではない」場合は拒否
  if (isDirectAccess && !isSamePageHash) {
    // サーバー・クライアント共通でトップページへリダイレクト
    return navigateTo('/')
  }
})
