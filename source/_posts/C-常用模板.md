---
title: C++常用模板
date: 2026-06-21 16:26:43
tags: C++
description: |
    Normal _Italic_ **Strong**
---
# C++常用模板
## 1.KMP
~~~cpp
#include<iostream>
#include<cstring>
#define MAXN 1000010
using namespace std;
int kmp[MAXN];
int la,lb,j; 
char a[MAXN],b[MAXN];
int main()
{
    cin>>a+1;
    cin>>b+1;
    la=strlen(a+1);
    lb=strlen(b+1);
    for (int i=2;i<=lb;i++)
	   {     
	   while(j&&b[i]!=b[j+1])
        j=kmp[j];    
       if(b[j+1]==b[i])j++;    
        kmp[i]=j;
       }
    j=0;
    for(int i=1;i<=la;i++)
	   {
          while(j>0&&b[j+1]!=a[i])
           j=kmp[j];
          if (b[j+1]==a[i]) 
           j++;
          if (j==lb) {cout<<i-lb+1<<endl;j=kmp[j];}
       }

    for (int i=1;i<=lb;i++)
    cout<<kmp[i]<<" ";
    return 0;
}
~~~
## 2.手写堆
~~~cpp
#include <cstdio>
#include <vector>
#include <cstring>
#include <queue>
#define ll long long
#define inf 1<<30
#define il inline 
#define in1(a) read(a)
#define in2(a,b) in1(a),in1(b)
#define in3(a,b,c) in2(a,b),in1(c)
#define in4(a,b,c,d) in2(a,b),in2(c,d)
il int max(int x,int y){return x>y?x:y;}
il int min(int x,int y){return x<y?x:y;}
il int abs(int x){return x>0?x:-x;}
il void swap(int &x,int &y){int t=x;x=y;y=t;}
il void readl(ll &x){
    x=0;ll f=1;char c=getchar();
    while(c<'0'||c>'9'){if(c=='-')f=-f;c=getchar();}
    while(c>='0'&&c<='9'){x=x*10+c-'0';c=getchar();}
    x*=f;
}
il void read(int &x){
    x=0;int f=1;char c=getchar();
    while(c<'0'||c>'9'){if(c=='-')f=-f;c=getchar();}
    while(c>='0'&&c<='9'){x=x*10+c-'0';c=getchar();}
    x*=f;
}
using namespace std;
/*===================Header Template=====================*/
#define N 200010
priority_queue<int,vector<int>,greater<int> > q;
priority_queue<int> q1;
int n,m,a[N],b[N];
int main(){
    in2(n,m);
    for(int i=1;i<=n;i++)in1(a[i]);
    for(int i=1;i<=m;i++)in1(b[i]);
    int i=1;
    for(int j=1;j<=m;j++){
        for(;i<=b[j];i++){
            q1.push(a[i]);
            if(q1.size()==j)q.push(q1.top()),q1.pop();
        }
        printf("%d\n",q.top());
        q1.push(q.top());q.pop();
    }
    return 0;
}
~~~
## 3.【作者手打】Floyd
~~~cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;
const int INF = 1e9;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> dist(n + 1, vector<int>(n + 1, INF));
    for (int i = 1; i <= n; i++) {
        dist[i][i] = 0;
    }
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        if (w < dist[u][v]) {
            dist[u][v] = w;
            dist[v][u] = w; 
        }
    }
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (dist[i][k] < INF && dist[k][j] < INF) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            cout << dist[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
~~~
## 4.Manacher
~~~cpp
//@winlere
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;
const int maxn=11000002;
char data[maxn<<1];
int p[maxn<<1],cnt,ans;
inline void qr(){
      char c=getchar();
      data[0]='~',data[cnt=1]='|';
      while(c<'a'||c>'z') c=getchar();
      while(c>='a'&&c<='z') data[++cnt]=c,data[++cnt]='|',c=getchar();
}
int main(){
      qr();
      for(int t=1,r=0,mid=0;t<=cnt;++t){
	    if(t<=r) p[t]=min(p[(mid<<1)-t],r-t+1);
	    while(data[t-p[t]]==data[t+p[t]]) ++p[t];
	    //暴力拓展左右两侧,当t-p[t]==0时，由于data[0]是'~'，自动停止。故不会下标溢出。
	    //假若我这里成功暴力扩展了，就意味着到时候r会单调递增，所以manacher是线性的。
	    if(p[t]+t>r) r=p[t]+t-1,mid=t;
	    //更新mid和r,保持r是最右的才能保证我们提前确定的部分回文半径尽量多。
	    if(p[t]>ans) ans=p[t];
      }
      printf("%d\n",ans-1);
      return 0;
}
~~~
## 5.Runs【Lyndon分解】
~~~cpp
#pragma GCC target("sse,sse2,sse3,ssse3,sse4.1,sse4.2,avx,avx2,popcnt,tune=native")

#include <bits/stdc++.h>

typedef long long ll;
typedef unsigned int ui;
typedef unsigned long long ull;

namespace standard_utilities {
  template <typename Ty>
  inline Ty max(const Ty &a, const Ty &b) {
    return a > b ? a : b;
  }

  template <typename Ty>
  inline Ty min(const Ty &a, const Ty &b) {
    return a < b ? a : b;
  }

  template <typename Ty>
  inline void check_max(Ty &a, const Ty &b) {
    if (b > a) a = b;
  }

  template <typename Ty>
  inline void check_min(Ty &a, const Ty &b) {
    if (b < a) a = b;
  }

  template <typename Ty>
  inline void swap(Ty &a, Ty &b) {
    Ty c = a;
    a = b, b = c;
  }
} // namespace standard_utilities

using namespace standard_utilities;

namespace Fast_IO {
  const int MaxBuff = 1 << 15;
  const int MaxOut = 1 << 24;

  char b[MaxBuff], *S = b, *T = b;
  char buff[MaxOut], *iter = buff;

  inline void flush() {
    fwrite(buff, 1, iter - buff, stdout), iter = buff;
  }

  inline char get_char() {
    return (S == T && (T = (S = b) + fread(b, 1, MaxBuff, stdin), S == T) ? 0 : *S++);
  }

  inline void put_char(char c) {
    if (iter - buff >= 1 << 24 - 1) flush();
    *iter++ = c;
  }
  
  struct Fast_IO_template {
    ~Fast_IO_template() { flush(); }

    inline Fast_IO_template &operator>>(char &c) {
      c = get_char();
      return *this;
    }

    inline Fast_IO_template &operator<<(char c) {
      put_char(c);
      return *this;
    }

    inline Fast_IO_template &operator>>(char *s) {
      char *iter = s;
      while (*iter = get_char(), *iter == ' ' || *iter == '\n' || *iter == '\r');
      while (*++iter = get_char(), *iter && *iter != ' ' && *iter != '\n' && *iter != '\r');
      *iter = 0;
      return *this;
    }

    inline Fast_IO_template &operator<<(int x) {
      static int stack[110];
      int O = 0;
      if (!x) put_char('0');
      else {
        if (x < 0) x = -x, put_char('-');
        for (; x; x /= 10) stack[++O] = x % 10;
        for (; O; put_char('0' + stack[O--]));
      }
      return *this;
    }
  };
} // namespace Fast_IO

Fast_IO::Fast_IO_template io;

const int N = 1e6 + 10;

struct my_tuple {
  int x, y, z;

  inline bool operator < (const my_tuple &b) const {
    if (x != b.x)
      return x < b.x;
    if (y != b.y)
      return y < b.y;
    return z < b.z;
  }

  inline int operator[](const int b) {
    if (b == 0)
      return x;
    if (b == 1)
      return y;
    if (b == 2)
      return z;
  }

  inline bool operator == (const my_tuple &b) { 
    return x == b.x && y == b.y && z == b.z; 
  }

  inline bool operator != (const my_tuple &b) { 
    return x != b.x || y != b.y || z != b.z; 
  }
};

struct my_pair {
  int x, y;

  inline int &operator[](const int b) { return b == 0 ? x : y; }
};

namespace SAIS {
  #define alloc(x, type, len) type *x = new type[len];

  void induced_sort(int n, int m, int *s, bool *T, int *sa, int *cnt) {
    static int lptr[N], rptr[N];
    int tmp;
    lptr[0] = rptr[0] = 0;
    for (int i = 1; i <= m; ++i) lptr[i] = cnt[i - 1], rptr[i] = cnt[i] - 1;
    for (int i = 0; i <= n; ++i) sa[i] > 0 && !T[tmp = sa[i] - 1] ? sa[lptr[s[tmp]]++] = tmp : 0;
    for (int i = n; i >= 0; --i) sa[i] > 0 &&  T[tmp = sa[i] - 1] ? sa[rptr[s[tmp]]--] = tmp : 0;
  }

  bool compare(int *x, int *y, int n) {
    while (n--) if (*x++ != *y++) return 1;
    return 0;
  }

  void sais(int n, int m, int *s, int *sa) {
    --n;
    alloc(T, bool, n + 10);
    alloc(cnt, int, m + 10);
    alloc(lms, int, n + 10);
    alloc(tmp, int, n + 10);
    for (int i = n; i >= 0; --i) {
      T[i] = (i == n || s[i] < s[i + 1] || s[i] == s[i + 1] && T[i + 1]);
      ++cnt[s[i]];
    }
    tmp[0] = 0;
    for (int i = 1; i <= m; ++i) cnt[i] += cnt[i - 1], tmp[i] = cnt[i] - 1;
    int LMS = 0;
    for (int i = 1; i <= n; ++i) T[i] && !T[i - 1] ? lms[LMS++] = i : 0;
    memset(sa, -1, (n + 1) << 2);
    for (int i = 0; i < LMS; ++i) sa[tmp[s[lms[i]]]--] = lms[i];
    induced_sort(n, m, s, T, sa, cnt);
    alloc(len, int, n + 10);
    lms[LMS] = n + 1;
    for (int i = 0; i < LMS; ++i) len[lms[i]] = lms[i + 1] - lms[i] + 1;
    alloc(lab, int, n + 10);
    int m0 = 0;
    memset(lab, -1, (n + 1) << 2);
    for (int i = 1, p = -1, q = -1; i <= n; ++i)
      if ((q = sa[i]) > 0 && T[q] && !T[q - 1]) {
        if (p == -1 || len[p] != len[q] || compare(s + p, s + q, len[p])) ++m0;
        lab[q] = m0; p = q;
      }
    lab[n] = 0;
    alloc(s0, int, LMS + 10);
    alloc(sa0, int, LMS + 10);
    for (int i = 0, p = 0; i <= n; ++i) lab[i] >= 0 ? s0[p++] = lab[i] : 0;
    if (m0 + 1 == LMS) for (int i = 0; i < LMS; ++i) sa0[s0[i]] = i;
    else sais(LMS, m0, s0, sa0);
    tmp[0] = 0;
    for (int i = 1; i <= m; ++i) tmp[i] = cnt[i] - 1;
    memset(sa, -1, (n + 1) << 2);
    for (int i = LMS - 1; i >= 0; --i) sa[tmp[s[lms[sa0[i]]]]--] = lms[sa0[i]];
    induced_sort(n, m, s, T, sa, cnt);
  }
} // namespace SAIS

inline int log2n(int n) { return 32 - __builtin_clz(n - 1); }

namespace RMQ_table {
  const int N = 2e6 + 20;
  const int D_max = 21;
  const int L = 20;
  const int inf = 1 << 30;

  int stack[L + 1];

  template <typename T, int MAXN>
  class ST {
   private:
    int f[N / L][D_max], M[N / L], a[N + L], n, q, D;

    struct node {
      int state[L + 1], *a;

      int Qmin(int x, int y) { return a[x + __builtin_ctz(state[y] >> x)]; }

      void init(int *_a) {
        int top = 0;
        a = _a;
        for (int i = 1; i <= L; ++i) {
          state[i] = state[i - 1];
          while (top && a[i] <= a[stack[top]])
            state[i] -= 1 << stack[top], --top;
          stack[++top] = i;
          state[i] += 1 << i;
        }
      }
    } c[N / L];

   public:
    void build(int _n, int *_a) {
      n = _n;
      for (int i = 1; i <= _n; ++i) a[i] = _a[i];
      D = int(log2(n)) + 1;
      int nn = n / L;
      M[0] = -1;
      for (int i = 1; i <= nn; ++i) {
        f[i][0] = inf;
        for (int j = 1; j <= L; ++j)
          f[i][0] = min(f[i][0], a[(i - 1) * L + j]);
      }
      for (int i = 1; i <= nn; ++i)
        M[i] = !(i & (i - 1)) ? M[i - 1] + 1 : M[i - 1];
      for (int j = 1; j <= D; ++j)
        for (int i = 1; i <= nn - (1 << j) + 1; ++i)
          f[i][j] = min(f[i][j - 1], f[i + (1 << (j - 1))][j - 1]);
      for (int i = 1; i <= nn + 1; ++i)
        c[i].init(a + (i - 1) * L);
    }

    inline int Qmin_ST(int x, int y) {
      int z = M[y - x + 1];
      return min(f[x][z], f[y - (1 << z) + 1][z]);
    }

    inline int rmq(int x, int y) {
      ++x, ++y;
      int xx = (x - 1) / L + 1, yy = (y - 1) / L + 1, res;
      if (xx + 1 <= yy - 1)res = Qmin_ST(xx + 1, yy - 1); else res = inf;
      if (xx == yy)res = min(res, c[xx].Qmin(x - (xx - 1) * L, y - (yy - 1) * L));
      else res = min(res, c[xx].Qmin(x - (xx - 1) * L, L)), res = min(res, c[yy].Qmin(1, y - (yy - 1) * L));
      return res;
    }
  };
} // namespace RMQ_table

using RMQ_table::ST;

template <int N, template <typename, int> class RMQ_T>
class SA {
 public:
  RMQ_T<int, N - 1> rmq;
  int n, sa[N], rk[N], height[N];

  void build(int _n, char *str) {
    n = _n;
    alloc(s, int, n + 10);
    for (int i = 0; i < n; ++i) s[i] = str[i];
    SAIS::sais(n + 1, 26, s, sa);
    for (int i = 1; i <= n; ++i) rk[sa[i]] = i;
    for (int k = 0, i = 0, j; i < n; height[rk[i++]] = k)
    for (k ? k-- : 0, j = sa[rk[i] - 1]; s[i + k] == s[j + k]; ++k);
    rmq.build(n, height);
  }

  int lcp(int i, int j) {
    //printf("lcp(%d,%d)\n", i, j);
    if (i == j) return n - i;
    if (j == n) return 0;
    i = rk[i], j = rk[j];
    if (i > j) std::swap(i, j); 
    return rmq.rmq(i, j - 1);
  }
};

template <int N, template <typename, int> class RMQ_T>
class ISA {
 public:
  RMQ_T<int, N - 1> rmq;
  int n, sa[N], rk[N], height[N];

  void build(int _n, char *str) {
    n = _n;
    alloc(s, int, n + 10);
    for (int i = 0; i < n; ++i) s[i] = str[n - i - 1];
    SAIS::sais(n + 1, 26, s, sa);
    for (int i = 1; i <= n; ++i) rk[sa[i]] = i;
    for (int k = 0, i = 0, j; i < n; height[rk[i++]] = k)
    for (k ? k-- : 0, j = sa[rk[i] - 1]; s[i + k] == s[j + k]; ++k);
    rmq.build(n, height);
    //for (int i = 2; i <= n + 1; ++i) printf("%d ", height[i]); printf("\n");
    //for (int i = 0; i < n; ++i) printf("%d ", rk[i]); printf("\n");
  }

  int lcs(int i, int j) {
    //++i, ++j;
    if (i <= 0 || j <= 0) return 0;
    if (i == j) return i;
    i = rk[n - i], j = rk[n - j];
    if (i > j) std::swap(i, j);
    //printf("rmq(%d,%d)", i, j);
    return rmq.rmq(i, j - 1);
  }
};

int n, nsv[N], nbv[N];
char s[N];
SA<N, ST> sa;
ISA<N, ST> isa;
std::vector<my_tuple> runs;

int get_lcs(int i, int j) {
  int low = 0, high = min(i, j);
  while (low < high) {
    int middle = low + high + 1 >> 1;
    if (sa.lcp(i - middle, j - middle) >= middle)
      low = middle;
    else
      high = middle - 1;
  }
  //printf("lcs(%d,%d) : %d %d\n", i, j, isa.lcs(i, j), low);
  return low;
}

void add_run(int i, int j) {
  int length = j - i;
  int lcs = isa.lcs(i, j);
  if (lcs < length) {
    int lcp = sa.lcp(i, j);
    if (lcs + lcp >= length) runs.push_back((my_tuple){i - lcs + 1, j + lcp, length});
  }
}

std::vector<int> a[N], a2[N], a3[N];
int b[N], c[N];

void my_sort_and_unique() {
  int m = runs.size();
  for (int i = 0; i < m; ++i) a[runs[i].z].push_back(i);
  for (int i = 1, tmp = 0; i <= n; ++i)
    for (int j = 0; j < a[i].size(); ++j) b[tmp++] = a[i][j];
  for (int i = 0; i < m; ++i) a2[runs[b[i]].y].push_back(b[i]);
  for (int i = 1, tmp = 0; i <= n; ++i)
    for (int j = 0; j < a2[i].size(); ++j) b[tmp++] = a2[i][j];
  for (int i = 0; i < m; ++i) a3[runs[b[i]].x].push_back(b[i]);
  for (int i = 1, tmp = 0; i <= n; ++i)
    for (int j = 0; j < a3[i].size(); ++j) b[tmp++] = a3[i][j];
  int tmp = 0; c[0] = b[0];
  for (int i = 1; i < m; ++i)
    if (runs[b[i - 1]] != runs[b[i]]) c[++tmp] = b[i];
  io << tmp + 1 << '\n';
  for (int i = 0; i <= tmp; ++i)
    io << runs[c[i]].x << ' ' << runs[c[i]].y << ' ' << runs[c[i]].z << '\n';
}

int main() {
  io >> s; n = strlen(s);
  for (int i = 0; i < n; ++i) s[i] = s[i] - 'a' + 1;
  sa.build(n, s);
  isa.build(n, s);
  for (int i = n; i--;) {
    for (int &j = nsv[i] = i + 1; j < n && sa.rk[i] < sa.rk[j];) j = nsv[j];
    for (int &j = nbv[i] = i + 1; j < n && sa.rk[i] > sa.rk[j];) j = nbv[j];
    add_run(i, nsv[i]);
    if (nsv[i] != nbv[i]) add_run(i, nbv[i]);
  }
  std::sort(runs.begin(), runs.end());
  runs.erase(std::unique(runs.begin(), runs.end()), runs.end());
  io << (int)runs.size() << '\n';
  for (auto a : runs) io << a.x << ' ' << a.y << ' ' << a.z << '\n';
  return 0;
}
~~~
## 6.Pfaffian
~~~cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn=505,mod=1000000007;
int n,ans,flg;
int a[maxn][maxn];
int ksm(int a,int b) {
	int res=1;
	while(b) {
		if(b&1)
			res=1ll*res*a%mod;
		a=1ll*a*a%mod,b>>=1;
	}
	return res;
}
int main() {
	scanf("%d",&n);
	for(int i=1; i<=n; i++)
		for(int j=i+1; j<=n; j++)
			scanf("%d",&a[i][j]);
	for(int i=1; i<=n; i+=2) {
		int p=i+1;
		for(int j=i+2; j<=n; j++)
			if(a[i][j]) {
				p=j;
				break;
			}
		if(p!=i+1) {
			flg^=1;
			for(int j=1; j<=i; j++)
				swap(a[j][i+1],a[j][p]);
			for(int j=i+2; j<p; j++)
				swap(a[i+1][j],a[j][p]),a[i+1][j]=mod-a[i+1][j],a[j][p]=mod-a[j][p];
			a[i+1][p]=mod-a[i+1][p];
			for(int j=p+1; j<=n; j++)
				swap(a[i+1][j],a[p][j]);
		}
		int iv=ksm(a[i][i+1],mod-2);
		for(int j=i+2; j<=n; j++)
			if(a[i][j]) {
				int coef=1ll*(mod-a[i][j])*iv%mod;
				for(int k=1; k<=i; k++)
					a[k][j]=(a[k][j]+1ll*coef*a[k][i+1])%mod;
				for(int k=i+2; k<j; k++)
					a[k][j]=(a[k][j]+1ll*(mod-coef)*a[i+1][k])%mod;
				for(int k=j+1; k<=n; k++)
					a[j][k]=(a[j][k]+1ll*coef*a[i+1][k])%mod;
			}
	}
	ans=1;
	for(int i=1; i<=n; i+=2)
		ans=1ll*ans*a[i][i+1]%mod;
	printf("%d\n",flg==0? ans%mod:(mod-ans)%mod);
	return 0;
}
~~~
## 7.负环
~~~cpp
#include<cstdio>
#include<cstring>
#include<queue>
#define inf 0x3f3f3f3f
using namespace std;
const int MAXN=2010;
const int MAXM=3010;
int n,m;

int en=-1,eh[MAXN];
struct edge
{
	int u,v,w,next;
	edge(int U=0,int V=0,int W=0,int N=0):u(U),v(V),w(W),next(N){}
};edge e[MAXM<<1];
inline void add_edge(int u,int v,int w)
{
	e[++en]=edge(u,v,w,eh[u]);eh[u]=en;
}
void input()
{
	scanf("%d %d",&n,&m);
	en=-1;
	memset(eh,-1,sizeof(eh));
	int u,v,w;
	for(int i=1;i<=m;++i)
	{
		scanf("%d %d %d",&u,&v,&w);
		add_edge(u,v,w);
		if(w>=0)add_edge(v,u,w);
	}
}

int dis[MAXN],cnt[MAXN];
bool vis[MAXN];
queue<int> q;
void spfa()
{
	fill(dis+1,dis+n+1,inf);
	memset(cnt,0,sizeof(cnt));
	memset(vis,0,sizeof(vis));
	
	while(!q.empty())q.pop();
	dis[1]=0;vis[1]=1;q.push(1);
	
	int u,v,w;
	while(!q.empty())
	{
		u=q.front();vis[u]=0;q.pop();
		for(int i=eh[u];i!=-1;i=e[i].next)
		{
			v=e[i].v;w=e[i].w;
			if(dis[u]+w<dis[v])
			{
				dis[v]=dis[u]+w;
				if(!vis[v])
				{
					if(++cnt[v]>=n)//注意就是这个位置的判断。一定要保证在判vis之后，即判入队次数；而不是在判vis之前，即判松弛次数！！！
					{
						printf("YES\n");return;
					}
					vis[v]=1;q.push(v);
				}
			}
		}
	}
	printf("NO\n");
}

int main()
{
//	freopen("in.txt","r",stdin);
	int t;
	scanf("%d",&t);
	for(int i=1;i<=t;++i)
	{
		input();
		spfa();
	}
	return 0;
}
~~~
## 8.手打队列
~~~cpp
#include<iostream>
#include<string.h>
#include<string>
#include<unordered_map>
#include<algorithm>
#include<stdio.h>
#include<queue>
using namespace std;
int n, m, i, j, k;
queue<int> q;
int main()
{
    cin >> n;
    for (i = 1; i <= n; i++)
    {
        int op, x;
        cin >> op;
        if (op == 1) cin >> x, q.push(x);//加入
        else if (op == 2)
        {
            if (q.empty()) cout << "ERR_CANNOT_POP\n";//要判断是否为空，否则RE
            else q.pop();//如果不为空，弹出
        }
        else if (op == 3)
        {
            if (q.empty()) cout << "ERR_CANNOT_QUERY\n";//同上
            else cout << q.front() << endl;//输出第一个
        }
        else cout << q.size() << endl;//输出队列大小
    }
    return 0;//结束
}
~~~
## 9.Pollard-Rho
~~~cpp
#include<fstream>
#include<iostream>
#include<ctime>
#include<cstdlib>
#include<map>
#define auto unsigned long long
#define abs
using namespace std;
const int tl=12;
const auto p[]={2,3,5,7,11,13,17,19,23,29,31,37};
auto product(auto x,auto y,auto mod)
{
	return (__int128)x*y%mod;
}
auto gcd(auto a,auto b)
{
	return (b==0)?a:gcd(b,a%b);
}/*
auto gcd(auto a,auto b)//所谓的快速gcd 实测一点都不快
{
	if(!a||!b)return a|b;//这个特判是有用的
	int k=__builtin_ctzll(a|b);//作用是取某个数最后一位0的个数
	b>>=__builtin_ctzll(b);
	while(a)
	{
		a>>=__builtin_ctzll(a);
		if(a<b)swap(a,b);
		a-=b;
	}
	return (b<<k);
}*/
auto power(auto x,auto a,auto mod)//快速幂的另一种写法
{
	auto res;
	for(res=1;a!=0;a>>=1)
	{
		if((a&1)!=0)res=product(res,x,mod);
		x=product(x,x,mod);
	}
	return res;
}
bool Miller_Rabin(auto x)
{
	if(x==1)return 0;//特判
	for(int i=0;i<tl;i++)
	{
		if(x==p[i])return 1;//显然
		bool ok=0;
		auto v=x-1;
		while((v&1)==0)v>>=1;
		auto y=power(p[i],v,x);
		if(y==1)ok=1;
		else
		{
			while(v<x-1)
			{
				if(y==x-1)
				{
					ok=1;
					break;
				}
				v<<=1;
				y=product(y,y,x);
			}
		}
		if(!ok)return 0;
	}
	return 1;
}
auto big_rand()//[0,2^45)
{
	auto x=rand();
	for(int i=0;i<3;++i)
	x=(x<<15|rand());
	return rand();
}
auto seed;
auto f(auto a,auto mod)
{
	return (product(a,a,mod)+seed)%mod;
}
auto floyd(auto n) //绕环
{
	seed=big_rand()%n;
//	cout<<seed;
	auto fast,slow,res;
	fast=slow=big_rand()%n;
	fast=f(fast,n);//注意一开始不要先跳两步
	while(fast!=slow)
	{
		res=gcd(fast-slow+n,n);
	//	cout<<fast<<' '<<slow<<' '<<(fast-slow+n)%n<<endl;
		if(res!=1)return res;
		fast=f(f(fast,n),n);
		slow=f(slow,n);
	}
//	for(;;);
	return 1;
}
void Pollard_rho(auto n,map<auto,int>&fat)
{
	if(n==1)return;
//	cout<<n<<endl;
	if(Miller_Rabin(n))
	{
		fat[n]++;
		return;
	}
	auto k=1;
	while(k==1)k=floyd(n);
//	cout<<n<<'!'<<k<<endl;
	Pollard_rho(k,fat);
	Pollard_rho(n/k,fat);
}
int main()
{
	srand(time(NULL));
	auto n;
	map<auto,int>fat;
	cin>>n;
	Pollard_rho(n,fat);
	for(map<auto,int>::iterator it=fat.begin();it!=fat.end();it++)
	cout<<it->first<<' '<<it->second<<endl;
	return 0;
}
~~~
## 10.2-SAT
~~~cpp
#include <cstdio>
#include <algorithm>
using std::min;

/*------------------------------IO------------------------------*/

namespace IO_number{
	int read(){
		int x =0; char c =getchar(); bool f =0;
		while(c < '0' || c > '9') (c == '-') ? f =1, c =getchar() : c =getchar();
		while(c >= '0' && c <= '9') x =(x<<1)+(x<<3)+(48^c), c =getchar();
		return (f) ? -x : x;
	}
	
	void write(const int &x){
		if(x/10)
			write(x/10);
		putchar('0'+x%10);
	}
}
using namespace IO_number;

/*------------------------------Graph------------------------------*/

const int MAXN =1e6+20;

int first[MAXN<<1], tote;
struct edge{
	int to, nxt;
}e[MAXN<<1];

inline void addedge(const int &u, const int &v){
	++tote, e[tote].to =v, e[tote].nxt =first[u], first[u] =tote;
}

/*------------------------------Tarjan------------------------------*/

int scc_id[MAXN<<1], Scc_id;

int dfn[MAXN<<1], low[MAXN<<1], Dfn;
int stk[MAXN<<1], stk_top;
bool instk[MAXN<<1];

void tarjan(const int &u){
	low[u] =dfn[u] =++Dfn;
	stk[stk_top++] =u;
	instk[u] =1;
	for(int l =first[u]; l; l =e[l].nxt){
		if(!dfn[e[l].to]){
			tarjan(e[l].to);
			low[u] =min(low[u], low[e[l].to]);
		}
		else if(instk[e[l].to])
			low[u] =min(low[u], dfn[e[l].to]);
	}
	if(low[u] == dfn[u]){
		++Scc_id;
		while(stk[stk_top] != u){
			scc_id[stk[stk_top-1]] =Scc_id;
			instk[stk[stk_top-1]] =0;
			--stk_top;
		}
	}
}

/*------------------------------Main------------------------------*/

int main(){
	int n =read(), m =read();
	for(int t =0; t < m; ++t){
		int i =read(), a =read(), j =read(), b =read();
		/* [1, n] -> false, [n+1, 2n] -> true */
		// x_i, x_j 均不满足不能同时成立 //
		addedge(i+(a^1)*n, j+b*n);
		addedge(j+(b^1)*n, i+a*n);
	}
	
	for(int i =1; i <= 2*n; ++i){
		if(!dfn[i])
			tarjan(i);
		if(i <= n && scc_id[i] == scc_id[i+n])
			return puts("IMPOSSIBLE") && 0;
	}
	puts("POSSIBLE");
	for(int i =1; i <= n; ++i)
		write((scc_id[i+n] < scc_id[i])), putchar(' ');
}
~~~

就先到这吧