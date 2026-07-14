---
title: 【NOI-Pre】Tarjan精讲
date: 2026-07-14 21:41:43
tags: [C++ ,Techno]
categories: 蒜法
description: |
    Tarjan是什么？强连通分量是什么？
---
###### By XXS

## 1.背景

Tarjan，一大堆算法的总称，由于这些算法都是由Tarjan发明的，而他又似乎不太会命名，所以导致求强连通分量、求割点、桥、求最近公共祖先（LCA）这些问题中全都有这么个Tarjan

本期主要讲求强连通分量

## 2.正题
### 1.强连通分量是什么？
明确以下几点

1. 仅在有向图中存在强连通分量这一概念
1. 一个点自身一定是强连通的
1. 强连通指的是再任意有向图中，任意两个节点可达，即对于任意$u, v \in S$，都有$U \leadsto V$且$V \leadsto U$

所以强连通分量，即为一个有向图中满足强连通的子图

### 2.怎么求？
显然，用Tarjan

那我问你，怎么用？

过程如下：

1. 定义dfn[u]（点$u$第一次被访问的时间戳），low[u]（点$u$沿DFS树边向下走若干步，再至多用一条返祖边，能到达的仍在栈中的最小dfn。），栈S（已经发现，但还没有确定归属SCC的点）
1. 访问$u$：令dfn[u]=low[u]=++timer（累加时间戳）
1. 枚举访问$u$的出边$u \to v$
1. $v$未访问，递归访问$v$，回溯后用low[v]更新low[u]
1. $v$已访问，用dfn[v]更新low[u]
1. 若dfn[u]=low[u]，则$u$是SCC的根，不断弹栈直到$u$

### 3.怎么打
模板（求强连通分量数量）：
~~~cpp
#include<bits/stdc++.h>
#define N 1000010
int n,m,dfn[N],low[N],scc[N],timer,cnt;
vector<int> g[N];
stack<int> s;
bool is[N];
void tarjan(int u){
    dfn[u]=low[u]=++timer;
    is[u]=true;
    s.push(u);
    for(int v:g[u]){
        if(!dfn[v]){
            tarjan(v);
            low[u]=min(low[u],low[u]);
        }else if(is[v]) low[u]=min(low[u],dfn[v]);
    }
    if(dfn[u]==low[u]){
        cnt++;
        int nw=-1;
        while(nw!=u){
            nw=s.top();
            s.pop();
            scc[nw]=cnt;
            is[nw]=false;
        }
    }
}
int main(){
    cin>>n>>m;
    for(int i=1;i<=m;i++){
        int u,v;
        cin>>u>>v;
        g[u].push_back(v);
    }
    for(int i=1;i<=n;i++) if(!dfn[i]) tarjan(i);
    cout<<cnt;
    return 0;
}
~~~

# 完结撒花！