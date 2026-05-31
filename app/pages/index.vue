<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">ルート一覧（階層表示）</h1>
    <nav>
      <RouteTree :nodes="routeTree" />
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. ルート一覧を取得して整形する関数
function buildRouteTree() {
  const routes = router.getRoutes()
  const root = { children: {} }

  for (const route of routes) {
    // パスを '/' で分割（空文字の要素は除外）
    // 例: '/table/editable-table-1' -> ['table', 'editable-table-1']
    const parts = route.path.split('/').filter(Boolean)

    // トップレベル（'/'）のハンドリング
    if (route.path === '/') {
      root.isPage = true
      root.path = '/'
      root.name = route.name
      root.label = 'ホーム'
      continue
    }

    let current = root
    let currentPath = ''

    for (const [index, part] of parts.entries()) {
      currentPath += `/${part}`

      if (!current.children[part]) {
        current.children[part] = {
          label: part,
          path: currentPath,
          children: {},
          isPage: false, // 途中のディレクトリか、実際のページかを判定するフラグ
        }
      }

      // 最後の要素であれば、それは実際のページ
      if (index === parts.length - 1) {
        current.children[part].isPage = true
        current.children[part].name = route.name
      }

      current = current.children[part]
    }
  }

  return root
}

// 2. テンプレートで扱いやすいように配列に変換する
function convertToArray(node) {
  return Object.values(node.children).map((child) => ({
    ...child,
    children: convertToArray(child),
  }))
}

const routeTree = computed(() => {
  const treeData = buildRouteTree()
  const result = convertToArray(treeData)

  // ホーム（'/'）が存在する場合は先頭に追加
  if (treeData.isPage) {
    result.unshift({
      label: 'ホーム (/)',
      path: '/',
      isPage: true,
      children: [],
    })
  }
  return result
})
</script>
