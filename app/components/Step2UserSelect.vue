<script setup>
/**
 * Step2: オーダー変更対象ユーザー選択画面
 *
 * - props.order: 対象オーダー情報
 * - props.users: 対象オーダーを利用しているユーザー一覧
 *     各ユーザーの services は「自分（ログイン中の管理者）が管理権限を持つサービスのみ」を
 *     サーバー側でフィルタ済みの状態で渡ってくる想定。
 *     editable は「services の中にオーナー行（owner: true）が含まれているか」で決まる。
 *     editable = false のユーザーは、システム上のオーナーサービス名を ownerService に持つ
 *     （管理権限が無いため services には含まれていない）。
 *
 * - emit('next', selectedUserIds): 「次へ」押下時に選択中のユーザーIDを渡す
 * - emit('cancel'): キャンセル押下時
 */
const props = defineProps({
  order: {
    type: Object,
    required: true,
    // 例: { id: 'ORDER-00231', name: 'プランX・月額', endDate: '2026-07-31' }
  },
  users: {
    type: Array,
    required: true,
    // 例: [{
    //   id: 'u1', name: '山田 太郎', code: 'user_00981',
    //   ownerService: 'サービスA', editable: true,
    //   services: [
    //     { name: 'サービスA', role: 'オーナー（本オーダー保有）', owner: true },
    //     { name: 'サービスB', role: '利用のみ', owner: false },
    //   ],
    // }, ...]
  },
})

const emit = defineEmits(['next', 'cancel'])

const headers = [
  { title: 'ユーザー名', key: 'name' },
  { title: '状態', key: 'status', width: 140 },
  { title: 'Action', key: 'data-table-expand', width: 140 },
]

const selected = ref([])
const expanded = ref([])

const editableUsers = computed(() => props.users.filter((u) => u.editable))
const nonEditableCount = computed(
  () => props.users.length - editableUsers.value.length,
)

/**
 * オーナーサービス名を表示用に取得する。
 * editable な場合は services 内のオーナー行から、
 * 非 editable な場合は権限が無く services に含まれないため ownerService フィールドから取得する。
 */
function ownerServiceName(user) {
  const ownerInList = user.services.find((s) => s.owner)
  return ownerInList ? ownerInList.name : user.ownerService
}

function handleRequestPermission(user) {
  // TODO: 実際には該当サービスの管理者へ依頼を送信するAPIを呼び出す
  console.log('依頼送信:', ownerServiceName(user))
}

function handleNext() {
  emit('next', selected.value)
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <v-container style="max-width: 1100px">
    <v-breadcrumbs
      :items="[
        '① オーダー選択',
        '② 対象ユーザー選択',
        '③ 新オーダー指定・確認',
        '④ 実行結果',
      ]"
    />

    <h1 class="text-h5 mb-1">対象ユーザーを選択</h1>
    <p class="text-body-2 text-medium-emphasis mb-4">
      このオーダーを利用しているユーザーの一覧です。オーダーを変更するユーザーにチェックを入れてください。
    </p>

    <v-alert type="info" variant="tonal" class="mb-4">
      対象オーダー：<strong>{{ order.id }} / {{ order.name }}</strong>
      　　終了予定：{{ order.endDate }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="4">
        <v-card>
          <v-card-item>
            <v-card-subtitle>対象ユーザー</v-card-subtitle>
            <v-card-title>{{ users.length }} 人</v-card-title>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-item>
            <v-card-subtitle>変更可能</v-card-subtitle>
            <v-card-title class="text-success"
              >{{ editableUsers.length }} 人</v-card-title
            >
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-item>
            <v-card-subtitle>権限なし（変更不可）</v-card-subtitle>
            <v-card-title class="text-warning"
              >{{ nonEditableCount }} 人</v-card-title
            >
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-space-between align-center mb-2">
      <span class="text-caption text-medium-emphasis">
        行をクリックすると、利用サービスが展開されます
      </span>
      <v-btn
        variant="text"
        prepend-icon="mdi-grid"
        @click="$emit('show-matrix')"
      >
        サービス横断で見る
      </v-btn>
    </div>

    <v-data-table
      v-model="selected"
      v-model:expanded="expanded"
      class="rounded-2xl border border-gray-300"
      :headers="headers"
      :items="users"
      item-value="id"
      show-select
      show-expand
      item-selectable="editable"
    >
      <template #item.status="{ item }">
        <v-chip :color="item.editable ? 'success' : 'warning'" size="small">
          {{ item.editable ? '変更可能' : '権限なし' }}
        </v-chip>
      </template>

      <template
        #:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }"
      >
        <v-btn
          :append-icon="
            isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'
          "
          :text="isExpanded(internalItem) ? 'Collapse' : 'More info'"
          class="text-none"
          color="medium-emphasis"
          size="small"
          variant="text"
          width="105"
          border
          slim
          @click="toggleExpand(internalItem)"
        ></v-btn>
      </template>

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="1"></td>
          <td :colspan="columns.length - 1">
            <v-table class="no-row-lines" density="compact">
              <tbody>
                <tr v-for="s in item.services" :key="s.name">
                  <td>{{ s.name }}</td>
                  <td>{{ s.role }}</td>
                </tr>
              </tbody>
            </v-table>

            <v-alert
              v-if="!item.editable"
              type="warning"
              variant="tonal"
              class="mt-2"
            >
              オーナーサービス「{{
                ownerServiceName(item)
              }}」が自分の管理下にないため、
              このユーザーのオーダーは変更できません。
              <div class="mt-2">
                <v-btn
                  size="small"
                  variant="text"
                  color="warning"
                  prepend-icon="mdi-email-outline"
                  @click="handleRequestPermission(item)"
                >
                  {{ ownerServiceName(item) }}の管理者に変更を依頼する
                </v-btn>
              </div>
            </v-alert>
          </td>
        </tr>
      </template>
    </v-data-table>

    <div class="d-flex justify-space-between align-center mt-4 mb-8">
      <span
        >選択中：<strong>{{ selected.length }}</strong> 人</span
      >
      <div>
        <v-btn variant="outlined" class="mr-2" @click="handleCancel"
          >キャンセル</v-btn
        >
        <v-btn
          color="primary"
          :disabled="selected.length === 0"
          @click="handleNext"
        >
          次へ（新オーダーを指定）
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
