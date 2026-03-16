# Google Search Console နဲ့ Sitemap လုပ်နည်း (အခမဲ့)

## ၁. Sitemap (ပရိုဂျက်မှာ ထည့်ပြီးသား)

- `public/sitemap.xml` ထည့်ထားပြီးပါပြီ။
- `npm run deploy` လုပ်တိုင်း ဒီ file က build ထဲ ပါသွားပြီး လိုင်းမှာ ဒီလို ရမယ်:  
  **https://satpaingoo.github.io/portfolio/sitemap.xml**

---

## ၂. Google Search Console ဘယ်လို လုပ်မလဲ

### Step 1: Search Console ဝင်ပါ
1. Browser မှာ သွားပါ: **https://search.google.com/search-console**
2. သင့် **Google account** နဲ့ sign in လုပ်ပါ။

### Step 2: Property (Site) ထည့်ပါ
1. **"Add property"** (သို့) **"Property ထည့်မယ်"** ကို နှိပ်ပါ။
2. **URL prefix** ကို ရွေးပါ။
3. အောက်က URL ကို ရိုက်ထည့်ပါ:
   ```
   https://satpaingoo.github.io/portfolio/
   ```
4. **Continue** နှိပ်ပါ။

### Step 3: ပိုင်ဆိုင်မှု Verify လုပ်ပါ
Google က verify နည်း မျိုးစုံ ပေးပါတယ်။ **HTML tag** နည်းက လွယ်ပါတယ်။

- **HTML tag** ရွေးပါ။  
- သူပေးတဲ့ meta tag ကို copy ကူးပါ။  
  ဥပမာ:  
  `<meta name="google-site-verification" content="xxxxxxxxxxxx" />`
- ဒီ project မှာ `index.html` ထဲက `<head>...</head>` ကြား ထည့်ပါ။  
  ပြီးရင် **Save** ပြီး ပြန် deploy လုပ်ပါ (`npm run deploy`)။
- Search Console မှာ **Verify** နှိပ်ပါ။  
  မအောင်ရင် မိနစ်အနည်းငယ် စောင့်ပြီး ထပ်ကြိုးစားပါ။

(သို့) **HTML file upload** နည်း သုံးမယ်ဆိုရင်:  
- Google ပေးတဲ့ file name (ဥပမာ `google123abc.html`) နဲ့ file တစ်ဖိုင် ဖန်တီးပြီး အတွင်းမှာ သူပေးတဲ့ content ထည့်ပါ။  
- ဒီ file ကို `public/` ထဲ ထည့်ပါ (ဒါဆို deploy လုပ်ရင် site root မှာ ရမယ်)။  
- Deploy ပြီး **Verify** နှိပ်ပါ။

### Step 4: Sitemap Submit လုပ်ပါ
1. ဘယ်ဘက် menu က **"Sitemaps"** ကို နှိပ်ပါ။
2. **"Add a new sitemap"** မှာ အောက်က URL ကို ရိုက်ထည့်ပါ:
   ```
   https://satpaingoo.github.io/portfolio/sitemap.xml
   ```
   (သို့) path သက်သက်ရိုက်မယ်ဆိုရင်: `sitemap.xml`
3. **Submit** နှိပ်ပါ။  
- စက္ကန့်အနည်းငယ်/မိနစ်အနည်းငယ် ကြာရင် status မှာ "Success" (သို့) "Discovered" လိုမျိုး ပေါ်လာမယ်။

### Step 5: URL Inspect နဲ့ Index တိုက်ရိုက် တောင်းချင်ရင် (Optional)
- ဘယ်ဘက် **URL Inspection** မှာ ထည့်ပါ:  
  `https://satpaingoo.github.io/portfolio/`
- **Request indexing** ရှိရင် နှိပ်ပါ။  
  ဒါက index ပိုမြန်အောင် လုပ်ပေးတာပါ (အခမဲ့)။

---

## အတိုချုပ်

| လုပ်ချက် | ဘယ်မှာ / ဘယ်လို |
|-----------|---------------------|
| Sitemap | ပရိုဂျက်မှာ `public/sitemap.xml` ထည့်ပြီးပြီ။ Deploy လုပ်ရင် အလိုအလျောက် ပါမယ်။ |
| Search Console | https://search.google.com/search-console → Add property → URL ထည့် |
| Verify | HTML tag ကို `index.html` ထဲ ထည့် → Save → Deploy → Verify နှိပ် |
| Sitemap submit | Sitemaps → Add sitemap → `sitemap.xml` (သို့) full URL ထည့် → Submit |

ဒီအတိုင်း လုပ်ရင် ပိုက်ဆံ မကုန်ပါဘူး။
