<template>
  <div class="w-full">
    <!-- ステータスバッジ -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <span
          v-if="stats.total"
          class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          {{ stats.total }} 件
        </span>
        <span
          v-if="stats.added"
          class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          追加 {{ stats.added }}
        </span>
        <span
          v-if="stats.edited"
          class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          編集 {{ stats.edited }}
        </span>
        <span
          v-if="stats.deleted"
          class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          削除 {{ stats.deleted }}
        </span>
      </div>
    </div>

    <!-- テーブルカード -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <!-- ツールバー -->
      <div
        class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3"
      >
        <p class="text-xs text-gray-500">セルをクリックして直接編集できます</p>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          @click="addRow"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          新規追加
        </button>
      </div>

      <!-- テーブル -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th
                class="w-8 py-3 pl-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                #
              </th>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-3 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase"
              >
                {{ col.label }}
                <span v-if="col.required" class="ml-0.5 text-red-400">*</span>
              </th>
              <th
                class="w-28 px-3 py-3 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- 空行 -->
            <tr v-if="rows.length === 0">
              <td
                :colspan="columns.length + 2"
                class="px-4 py-10 text-center text-sm text-gray-400"
              >
                データがありません。「新規追加」から追加してください。
              </td>
            </tr>

            <!-- データ行 -->
            <tr v-for="(row, i) in rows" :key="row._id" :class="rowClass(row)">
              <!-- 行番号 -->
              <td
                class="py-2 pl-4 align-middle font-mono text-xs text-gray-400"
              >
                <span
                  v-if="row._state === 'new'"
                  class="font-bold text-emerald-500"
                  >✦</span
                >
                <span v-else>{{ i + 1 }}</span>
              </td>

              <!-- 各列 -->
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-3 py-2 align-top"
              >
                <!-- 既存行の読み取り専用列 -->
                <template
                  v-if="col.type === 'readonly' && row._state !== 'new'"
                >
                  <span class="block py-1 font-mono text-xs text-gray-500">{{
                    row[col.key]
                  }}</span>
                </template>

                <!-- 入力セル -->
                <template v-else>
                  <input
                    :type="col.type === 'email' ? 'email' : 'text'"
                    :placeholder="col.placeholder ?? col.label"
                    :readonly="row._state === 'deleted'"
                    :class="[
                      'w-full rounded border-0 bg-transparent px-1.5 py-1 text-sm transition-all outline-none',
                      col.type === 'readonly' || col.type === 'email'
                        ? 'font-mono text-xs'
                        : '',
                      row._state === 'deleted'
                        ? 'cursor-default text-gray-400 line-through'
                        : 'text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                      cellError(row, col.key)
                        ? 'bg-red-50 ring-2 ring-red-400'
                        : '',
                    ]"
                    v-model="row[col.key]"
                    @input="onInput(row)"
                  />
                  <p
                    v-if="cellError(row, col.key)"
                    class="mt-0.5 text-xs text-red-500"
                  >
                    {{ cellError(row, col.key) }}
                  </p>
                </template>
              </td>

              <!-- 操作ボタン -->
              <td class="px-3 py-2 align-middle">
                <div class="flex items-center justify-center gap-1">
                  <!-- 通常・新規行 → 削除ボタン -->
                  <button
                    v-if="row._state !== 'deleted' && row._state !== 'edited'"
                    type="button"
                    class="rounded px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    @click="deleteRow(row)"
                  >
                    削除
                  </button>

                  <!-- 編集行・削除行 → 元に戻すボタン -->
                  <button
                    v-if="row._state === 'edited' || row._state === 'deleted'"
                    type="button"
                    class="rounded px-2 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50"
                    @click="undoRow(row)"
                  >
                    ↩ 元に戻す
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- フッター -->
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3"
      >
        <p class="text-xs text-gray-500">
          <template v-if="hasChanges">
            変更あり：
            <span v-if="stats.added">追加 {{ stats.added }} 件　</span>
            <span v-if="stats.edited">編集 {{ stats.edited }} 件　</span>
            <span v-if="stats.deleted">削除 {{ stats.deleted }} 件</span>
          </template>
          <template v-else>変更なし</template>
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="!hasChanges"
            class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            @click="resetAll"
          >
            すべてリセット
          </button>
          <button
            type="button"
            :disabled="!hasChanges || submitting"
            class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="submitAll"
          >
            <span v-if="submitting">送信中…</span>
            <span v-else>
              変更を保存
              <span v-if="changeCount > 0" class="ml-1 opacity-80"
                >({{ changeCount }} 件)</span
              >
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * EditableTable — 汎用編集可能テーブルコンポーネント
 *
 * Props:
 *   columns  ColumnDef[]  列定義
 *   initial  Row[]        初期データ
 *
 * ColumnDef:
 *   key          string   行データのキー名
 *   label        string   ヘッダー表示名
 *   type         'text' | 'email' | 'readonly'
 *                  readonly: 既存行は表示のみ、新規行は入力可
 *   required?    boolean  必須バリデーション
 *   unique?      boolean  重複禁止（全行 or deleted除外を field ごとに制御）
 *   uniqueScope? 'active' | 'all'
 *                  'active'(default): deleted行を除いてユニーク
 *                  'all':             deleted行も含めてユニーク
 *   placeholder? string   入力プレースホルダー
 *
 * Emits:
 *   submit(payload)
 *     payload.add    { [key]: value }[]  追加行
 *     payload.update { [key]: value }[]  更新行
 *     payload.delete any[]               削除行の key 値一覧
 */

import { ref, reactive, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  initial: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit'])

// ── 内部ID採番 ──────────────────────────────────────────
let idSeq = 1000

// ── 行データ初期化 ──────────────────────────────────────
const makeRow = (item) => ({
  _id: item._id ?? ++idSeq,
  _state: 'unchanged',
  _orig: { ...item },
  ...Object.fromEntries(props.columns.map((c) => [c.key, item[c.key] ?? ''])),
})

const rows = ref(props.initial.map(makeRow))
const errors = reactive({})
const submitting = ref(false)

// ── 統計 ────────────────────────────────────────────────
const stats = computed(() => ({
  total: rows.value.length,
  added: rows.value.filter((r) => r._state === 'new').length,
  edited: rows.value.filter((r) => r._state === 'edited').length,
  deleted: rows.value.filter((r) => r._state === 'deleted').length,
}))
const changeCount = computed(
  () => stats.value.added + stats.value.edited + stats.value.deleted,
)
const hasChanges = computed(() => changeCount.value > 0)

// ── 行スタイル ───────────────────────────────────────────
const rowClass = (row) => ({
  'bg-emerald-50': row._state === 'new',
  'bg-amber-50': row._state === 'edited',
  'bg-red-50 opacity-60': row._state === 'deleted',
  'border-l-2 border-l-emerald-400 pl-0': row._state === 'new',
  'border-l-2 border-l-amber-400': row._state === 'edited',
  'border-l-2 border-l-red-400': row._state === 'deleted',
})

// ── 重複検知 ─────────────────────────────────────────────
const getDuplicateRowIds = (col) => {
  const scope = col.uniqueScope ?? 'active'
  const target =
    scope === 'all'
      ? rows.value
      : rows.value.filter((r) => r._state !== 'deleted')
  const seen = {}
  const dupes = new Set()
  target.forEach((r) => {
    const key = (r[col.key] ?? '').trim().toLowerCase()
    if (!key) return
    if (seen[key] !== undefined) {
      dupes.add(seen[key])
      dupes.add(r._id)
    } else seen[key] = r._id
  })
  return dupes
}

const uniqueCols = computed(() => props.columns.filter((c) => c.unique))

// ── リアルタイム重複チェック ─────────────────────────────
const checkDuplicatesRealtime = () => {
  uniqueCols.value.forEach((col) => {
    const dupes = getDuplicateRowIds(col)
    const scope = col.uniqueScope ?? 'active'
    const target =
      scope === 'all'
        ? rows.value
        : rows.value.filter((r) => r._state !== 'deleted')
    target.forEach((row) => {
      if (!errors[row._id]) errors[row._id] = {}
      if (dupes.has(row._id)) {
        errors[row._id][col.key] = `この${col.label}は既に使用されています`
      } else if (
        errors[row._id][col.key] === `この${col.label}は既に使用されています`
      ) {
        delete errors[row._id][col.key]
        if (!Object.keys(errors[row._id]).length) delete errors[row._id]
      }
    })
  })
}

// ── セルエラー取得 ───────────────────────────────────────
const cellError = (row, key) => errors[row._id]?.[key] ?? null

// ── 入力ハンドラ ─────────────────────────────────────────
const onInput = (row) => {
  if (row._state === 'unchanged') row._state = 'edited'
  const orig = row._orig
  const allSame = props.columns.every((c) => row[c.key] === (orig[c.key] ?? ''))
  if (row._state === 'edited' && allSame) row._state = 'unchanged'
  checkDuplicatesRealtime()
}

// ── 行操作 ───────────────────────────────────────────────
const addRow = () => {
  rows.value.push({
    _id: ++idSeq,
    _state: 'new',
    _orig: Object.fromEntries(props.columns.map((c) => [c.key, ''])),
    ...Object.fromEntries(props.columns.map((c) => [c.key, ''])),
  })
  setTimeout(() => {
    document.querySelectorAll('tbody tr:last-child input')[0]?.focus()
  }, 50)
}

const deleteRow = (row) => {
  if (row._state === 'new') {
    rows.value = rows.value.filter((r) => r._id !== row._id)
  } else {
    if (row._state === 'edited') {
      props.columns.forEach((c) => {
        row[c.key] = row._orig[c.key] ?? ''
      })
      delete errors[row._id]
    }
    row._state = 'deleted'
  }
  checkDuplicatesRealtime()
}

const undoRow = (row) => {
  if (row._state === 'new') {
    rows.value = rows.value.filter((r) => r._id !== row._id)
  } else {
    props.columns.forEach((c) => {
      row[c.key] = row._orig[c.key] ?? ''
    })
    row._state = 'unchanged'
    delete errors[row._id]
  }
  checkDuplicatesRealtime()
}

const resetAll = () => {
  rows.value.forEach((row) => {
    if (row._state === 'edited' || row._state === 'deleted') {
      props.columns.forEach((c) => {
        row[c.key] = row._orig[c.key] ?? ''
      })
      row._state = 'unchanged'
      delete errors[row._id]
    }
  })
  rows.value = rows.value.filter((r) => r._state !== 'new')
  Object.keys(errors).forEach((k) => delete errors[k])
}

// ── バリデーション ───────────────────────────────────────
const validate = () => {
  let ok = true
  Object.keys(errors).forEach((k) => delete errors[k])

  const dupeMap = Object.fromEntries(
    uniqueCols.value.map((col) => [col.key, getDuplicateRowIds(col)]),
  )

  rows.value.forEach((row) => {
    const e = {}

    props.columns.forEach((col) => {
      // unique チェック（scope:all は deleted行も対象）
      if (col.unique) {
        const scope = col.uniqueScope ?? 'active'
        if (scope === 'all' || row._state !== 'deleted') {
          if (dupeMap[col.key].has(row._id)) {
            e[col.key] = `この${col.label}は既に使用されています`
            return
          }
        }
      }

      // deleted行はここ以降スキップ
      if (row._state === 'deleted') return

      // 必須チェック
      if (col.required && !(row[col.key] ?? '').trim()) {
        e[col.key] = `${col.label}は必須です`
        return
      }

      // email 形式チェック
      if (col.type === 'email' && row[col.key].trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[col.key])) {
          e[col.key] = '正しいメール形式で入力してください'
        }
      }
    })

    if (Object.keys(e).length) {
      errors[row._id] = e
      ok = false
    }
  })
  return ok
}

// ── 一括送信 ─────────────────────────────────────────────
const submitAll = async () => {
  if (!validate()) return

  submitting.value = true

  // keyCol: readonly 列の最初をIDキーとして使用
  const idCol = props.columns.find((c) => c.type === 'readonly')?.key ?? '_id'

  const payload = {
    add: rows.value
      .filter((r) => r._state === 'new')
      .map((r) =>
        Object.fromEntries(props.columns.map((c) => [c.key, r[c.key]])),
      ),
    update: rows.value
      .filter((r) => r._state === 'edited')
      .map((r) =>
        Object.fromEntries(props.columns.map((c) => [c.key, r[c.key]])),
      ),
    delete: rows.value
      .filter((r) => r._state === 'deleted')
      .map((r) => r[idCol]),
  }

  emit('submit', payload)

  // 送信後の状態確定（実際はAPIレスポンス後に呼ぶ想定）
  rows.value = rows.value
    .filter((r) => r._state !== 'deleted')
    .map((r) => ({
      ...r,
      _state: 'unchanged',
      _orig: Object.fromEntries(props.columns.map((c) => [c.key, r[c.key]])),
    }))

  submitting.value = false
}

// 親から呼べるようにexposeする
defineExpose({ submitAll, resetAll })
</script>
