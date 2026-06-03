パターン1

```mermaid
classDiagram
    direction LR
    class SettingsStore {
        +current : ParentData
        +draft : ParentData
        +isLoading : boolean
        +fetchInitialData()
        +saveAllSettings()
        +resetDraft()
    }

    class ParentData {
        +textField : string
        +child : ChildData
    }

    class ChildData {
        +child_toggle : boolean
        +grandchild : GrandchildData
    }

    class GrandchildData {
        +text_input : string
    }

    %% 依存関係の表現（丸ごと内包している）
    SettingsStore --> ParentData
    ParentData --> ChildData
    ChildData --> GrandchildData
```

パターン2

```mermaid
classDiagram
    class ParentStore {
        +textField : string
        +childrenToggle : Record~string, boolean~
        +submitAll()
    }

    class ChildrenStore {
        +committed : Record~string, ChildData~
        +draft : Record~string, ChildData~
        +beginEdit(childId)
        +applyDraft(childId)
        +cancelEdit(childId)
    }

    class GrandchildrenStore {
        +committed : Record~string, GrandData~
        +draft : Record~string, GrandData~
        +beginEdit(grandId)
        +applyDraft(grandId)
        +cancelEdit(grandId)
    }

    %% 依存関係（下のストアが、上のストアを呼び出してデータをマージする）
    ChildrenStore ..> ParentStore : インポートして利用
    GrandchildrenStore ..> ChildrenStore : インポートして利用

```

完全版?

```mermaid
classDiagram
    direction LR

    %% -------------------------------------------
    %% 階層1: ParentStore (ルート)
    %% -------------------------------------------
    class ParentStore {
        +current : ParentData
        +parentDraft : ParentData
        +isLoading : boolean
        +fetchInitialData() : void
        +submitAll() : void
        +cancelAll() : void
    }

    class ParentData {
        +textField : string
        +child : ChildData
    }

    %% -------------------------------------------
    %% 階層2: ChildrenStore
    %% -------------------------------------------
    class ChildrenStore {
        +childDraft : ChildData
        +beginEdit() : void
        +applyToParent() : void
        +cancelEdit() : void
    }

    class ChildData {
        +child_toggle : boolean
        +grandchild : GrandchildData
    }

    %% -------------------------------------------
    %% 階層3: GrandchildrenStore
    %% -------------------------------------------
    class GrandchildrenStore {
        +grandchildDraft : GrandchildData
        +beginEdit() : void
        +applyToChild() : void
        +cancelEdit() : void
    }

    class GrandchildData {
        +text_input : string
    }

    %% -------------------------------------------
    %% 関係性の定義
    %% -------------------------------------------
    %% データ構造のネスト関係
    ParentData *-- ChildData : 内包 (Has-a)
    ChildData *-- GrandchildData : 内包 (Has-a)

    %% ストア間の依存・データ書き換えアクション
    ChildrenStore ..> ParentStore : "applyToParent() で<br/> parentStore.parentDraft.child<br /> を直接上書きマージ"
    GrandchildrenStore ..> ChildrenStore : "applyToChild() で<br /> childrenStore.childDraft.grandchild<br /> を直接上書きマージ"
```

1. 画面を開いたとき (beginEdit)
   1. 下位のストアは、1つ上のストアの draft の中にある自分用のデータをディープコピーして、自身の draft（例: grandchildDraft）を生成します。
      1. 孫を開くとき: childrenStore.childDraft.grandchild ➔ grandchildDraft2.
2. 設定ボタンを押したとき (applyToChild / applyToParent)
   1. 自分の committed を書き換えるのではなく、1つ上のストアの draft 内にある該当オブジェクトに対して、自身の最新 draft を上書きマージします。
   2. 孫の設定: grandchildDraft ➔ childrenStore.childDraft.grandchild
   3. 子の設定: childDraft ➔ parentStore.parentDraft.child3.
3. キャンセルボタンを押したとき (cancelEdit)
   1. 上の階層はまだ一切汚されていない（設定ボタンを押すまで上書きされない）ため、自分の draft（バッファ）を単に null にしてクリアするだけで、確実に1つ前の状態に安全にロールバックします。
4. 最上位の送信ボタンを押したとき (submitAll)
   1. すべての階層の変更がマージされて集約された parentStore.parentDraft を一括でサーバーに送信します。送信が成功した瞬間にのみ、current = parentDraft として全体の確定状態を更新します。
5. この「1つ上の draft を書き換える」アプローチにおいて、Vue（Nuxt 3）の各コンポーネントがストアを呼び出して実行するbeginEdit と applyTo... の具体的なプログラム記述例について詳しく確認しますか？
