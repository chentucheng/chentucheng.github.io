---
title: EOJ部署指南
date: 2026-09-13 20:56:36
tags: Techno
description: |
    教你如何用CF+GH快（gui）速制作属于你自己的OJ！
---
###### By 1000CC

# 一.Install！

## 1.材料准备

1. 网址（Cloudflare的中国很难进）
2. CF账号
3. GH账号
4. Ubuntu
5. Git
6. Node.js
7. wrangler

### Note：如果你没有后三个

~~~bash
# 安装 Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Git
sudo apt install -y git

# 安装 Wrangler
npm i -g wrangler

# 登录 Cloudflare
wrangler login
~~~

## 2.克隆项目 + 安装依赖

废话不多说，上Bash

~~~bash
git clone https://github.com/wanwusangzhigit/eoj.git
cd eoj

cd frontend && npm i
cd ../backend && npm i
~~~

## 3. 创建 D1 数据库
~~~bash
cd ~/Code/eoj/backend
wrangler d1 create oj-database
~~~
记下输出的 database_id。

## 4. 执行数据库迁移
~~~bash
npx wrangler d1 migrations apply oj-database --remote
~~~

## 5. 配置 wrangler.toml
~~~bash
nano ~/Code/eoj/backend/wrangler.toml
~~~
填入：

~~~toml
name = "oj-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "oj-database"
database_id = "你的数据库ID"

[assets]
directory = "./public"
binding = "ASSETS"
not_found_handling = "none"
run_worker_first = true

[[send_email]]
name = "SEND_EMAIL"

[vars]
GITHUB_CLIENT_ID = "你的Client ID"
GITHUB_CLIENT_SECRET = "你的Client Secret"
GITHUB_TOKEN = "你的PAT"
JWT_SECRET = "openssl rand -base64 32 生成"
CALLBACK_SECRET = "openssl rand -base64 32 生成"
JUDGE_REPO = "你的用户名/ccoj-judge"
FRONTEND_URL = "https://你的域名"
REGISTRATION_OPEN = "true"
DEFAULT_FROM_EMAIL = "noreply@你的域名"
CPOAUTH_CLIENT_ID = ""
CPOAUTH_CLIENT_SECRET = ""
~~~

## 6. 创建 GitHub OAuth App
地址：https://github.com/settings/developers

回调地址：https://你的域名/api/v1/auth/github/callback

拿到 Client ID 和 Client Secret 填入上面的配置。1

## 7. 创建判题仓库
GitHub 新建 Private 仓库：~xxx-judge~

推送本地 judge-repo 内容：

~~~bash
cd ~/Code/eoj/judge-repo
git init
git add .
git commit -m "init judge repo"
git remote add origin git@github.com:你的用户名/ccoj-judge.git
git branch -M main
git push -u origin main
~~~

## 8. 配置判题仓库 Secrets

地址：`https://github.com/你的用户名/ccoj-judge/settings/secrets/actions`

| Secret 名 | 值 |
|-----------|-----|
| `WORKER_API` | `https://你的域名` |
| `CALLBACK_SECRET` | 和 wrangler.toml 里一致 |


## 9. 构建前端 + 部署后端

```bash
cd ~/Code/eoj/frontend
npm run build:site

cd ../backend
npx wrangler deploy
```

## 10. 绑定自定义域名

Cloudflare → **Workers 和 Pages** → `oj-backend` → **设置** → **域和路由** → **添加域名** → 输入域名。

## 11. 设置管理员

```bash
npx wrangler d1 execute oj-database --remote --command "UPDATE users SET role = 'admin', permissions = '[\"contest_admin\",\"problem_admin\",\"list_admin\",\"ticket_admin\"]' WHERE username = '你的用户名';"
```

---

# 二、日常更新

## 场景 A：只改前端（站点名、图标、主题、页面）

```bash
cd ~/Code/eoj/frontend
npm run build:site
cd ../backend
npx wrangler deploy
```

## 场景 B：只改后端（API、逻辑、数据库操作）

```bash
cd ~/Code/eoj/backend
npx wrangler deploy
```

## 场景 C：前后端都改了

```bash
cd ~/Code/eoj/frontend
npm run build:site
cd ../backend
npx wrangler deploy
```

## 场景 D：改了判题逻辑（judge.sh、judge.yml）

```bash
cd ~/Code/eoj/judge-repo
git add .
git commit -m "更新判题逻辑"
git pull --rebase origin main
git push
```

> 注意：`judge-repo` 每次 EOJ 提交代码都会自动推送，所以本地推之前**必须先 `git pull --rebase`**。

## 场景 E：改了数据库结构

```bash
cd ~/Code/eoj/backend
npx wrangler d1 migrations apply oj-database --remote
```

---

# 三、常用排查命令

```bash
# 查看用户列表和角色
npx wrangler d1 execute oj-database --remote --command "SELECT id, username, role FROM users;"

# 查看提交记录
npx wrangler d1 execute oj-database --remote --command "SELECT id, user_id, problem_id, status FROM submissions ORDER BY id DESC LIMIT 10;"

# 实时查看 Worker 日志
npx wrangler tail

# 查看数据库所有表
npx wrangler d1 execute oj-database --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

---

# 四、关键路径速查

| 内容 | 路径 |
|------|------|
| 项目根目录 | `~/Code/eoj` |
| 前端源码 | `~/Code/eoj/frontend` |
| 前端配置 | `~/Code/eoj/frontend/config.yaml` |
| 后端源码 | `~/Code/eoj/backend` |
| 后端配置 | `~/Code/eoj/backend/wrangler.toml` |
| 判题仓库 | `~/Code/eoj/judge-repo` |
| 判题脚本 | `~/Code/eoj/judge-repo/scripts/judge.sh` |
| 判题工作流 | `~/Code/eoj/judge-repo/.github/workflows/judge.yml` |

---

# 五、核心规律

> **改前端 → 必须 `npm run build:site` + `wrangler deploy`**
> **改后端 → `wrangler deploy`**
> **改判题 → `git pull --rebase` + `git push`**

谔谔谔终于写完了谔谔谔