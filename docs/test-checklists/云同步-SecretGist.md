# 功能名：云同步（Secret Gist，替代 AirDrop）

> 背景：家长希望不用每次都 AirDrop 传文件，改成「电脑发布 → iPad 在线拉取」。
> 用 GitHub 的 Secret Gist 做中转：admin 端发布整库 JSON 到一个不公开列出的 Gist，
> play 端凭 Gist ID（无需 token）拉取最新内容，走现有 validateJson + importFull。
>
> ⚠️ **此功能需要真实 GitHub 账号 + Personal Access Token 才能完整测试成功路径**，
> 本次开发时机器上没有可用 token，只验证了「缺 token / 无效 Gist ID」的报错路径。
> 首次真机测试请务必走一遍下面「成功路径」，确认能跑通。

## 前置条件

- 一个 GitHub 账号
- 生成一个 Fine-grained Personal Access Token：Repository access 选 "No access"，
  Permissions 里只勾 **Gists → Read and write**

---

## 编辑端（admin/pages/import-export.html「☁️ 发布到云端」区块）

### 成功路径（需真实 token）

- [ ] 填入合法 token，Gist ID 留空 → 点「☁️ 发布到云端」→ 提示发布成功，显示新生成的 Gist ID
- [ ] 登录 github.com/你的用户名 → Gists 页面确认**没有**这个 Gist 出现在公开列表里（Secret 生效）
- [ ] 用生成的 Gist ID 直接访问 `https://gist.github.com/<你的用户名>/<gist-id>` → 能看到内容（有链接就能看，符合预期）
- [ ] 再次点「发布到云端」（Gist ID 已填好）→ 走 PATCH 更新同一个 Gist，不会重复创建新的
- [ ] 修改探险数据后再次发布 → Gist 内容更新为最新版本
- [ ] 刷新页面 → token 和 Gist ID 自动回填（存在 localStorage）
- [ ] F12 Console 无红色错误

### 异常路径（本次已验证）

- [x] Token 留空点「发布」→ 提示「请先填写 GitHub Token」，不发请求
- [ ] Token 故意填错（无效字符串）→ 提示「Token 无效或已过期」
- [ ] Gist ID 填一个不存在/别人的 ID → 提示「这个 Gist ID 找不到了…」

---

## 游戏端（play/pages/settings.html「☁️ 在线更新」区块）

### 成功路径（需先在 admin 端发布过一次）

- [ ] 粘贴 admin 发布后拿到的 Gist ID → 点「🔄 检查云端更新」→ 确认弹窗显示正确的探险/点位/题目数量
- [ ] 确认更新 → 导入成功提示，「当前数据」统计区数字刷新
- [ ] 刷新页面 → Gist ID 自动回填
- [ ] 探险数据在 admin 端修改并重新发布后 → play 端再次点「检查云端更新」能拉到最新内容（不是旧缓存）
- [ ] 有进行中的游戏时点「检查云端更新」→ 弹「检测到正在进行中的游戏…」二次确认

### 异常路径（本次已验证）

- [x] Gist ID 留空点「检查云端更新」→ 提示「请先粘贴家长给的 Gist ID」
- [x] Gist ID 填一个不存在的字符串 → 实际请求 GitHub API 返回 404，正确提示「找不到这个 Gist」
- [ ] 飞行模式下点「检查云端更新」→ 提示网络错误（不应崩溃/白屏）

### iPad Safari / PWA 测试

- [ ] 同上「检查云端更新」关键路径，在 iPad Safari 和 PWA 主屏幕图标下均正常
- [ ] （不需要测试飞行模式下能否更新——在线更新本来就需要联网，这点和「导入」不同）
