---
title: 【NOI-Pre】MST精讲
date: 2026-07-25 18:20:53
tags: [C++ ,Techno]
categories: 蒜法
description: |
    MST是什么？Kruskal是什么？
---
###### By XXS
# 背景
[MST](https://chentucheng.github.io/oi-wiki/graph/mst/)是用来干什么的？

明确一个知识点，MST中文翻译为最小生成树，即在一张无向图中寻找一张边权最小的无根树

一般被用来处理网络布线，灾后重建
# 算法介绍
## 1.Kruskal
### ①口糊
按照边权排序从小到大选边，将选到边两边的点归入一个并查集，加入当所有点在同一个并查集中，就结束算法

不难发现这是一种贪心，也不难证明这种贪心的正确性

时间复杂度$O(M)$,其中M为原图边的数量
### ②模板
~~~cpp
struct Edge{
    int from,to,c;
}edge[N];
int tot=0,n;
void add(int u,int v,int w){
    edge[++tot].from=u;
    edge[tot].to=v;
    edge[tot].c=w;
}
int fa[N];
bool cmp(Edge a,Edge b){return a.c<b.c;}
int init(){for(int i=1;i<=n;i++)fa[i]=i;}
int find(int a){return fa[a]==a?a:fa[a]=find(fa[a]);}
void union(int a,int b){
    int ra=find(a),rb=find(b);
    fa[ra]=rb;
}
int mst(){
    init();
    int ans=0;
    sort(edge+1,edge+1+tot,cmp)p;
    for(int i=1;i<=tot;i++){
        if(find(edge[i].from)!=find(edge[i].to)){
            ans+=edge[i].c;
            union(edge[i].from,edge[i],to);
        }
    }
    return ans;
}
~~~
## 2.Prim
### ①口糊
原理类似Dij，都是在到达一个点后BFS剩下的所有点，并更新点权，然后选择更新后点权最小的点再BFS

时间复杂度$O(N)$
