"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id:number; name:string; category:string; price:number; color:string; desc:string };
type Cart = Record<number, number>;

const colorOptions = [
  {name:"Ink Black",value:"#171717",className:"black"},
  {name:"Gallery Cream",value:"#e8dfcf",className:"cream"},
  {name:"Electric Lime",value:"#b8ff28",className:"lime"},
  {name:"Hot Magenta",value:"#ff2d8d",className:"pink"},
];

const products: Product[] = [
  {id:1,name:"Loop Tray",category:"Desk",price:24,color:"pink",desc:"A sculptural catch-all for keys, clips and everyday bits."},
  {id:2,name:"Cable Grid",category:"Desk",price:18,color:"lime",desc:"Snap-in cable control that keeps every cord in reach."},
  {id:3,name:"Stack Vault",category:"Storage",price:32,color:"black",desc:"Lidded, stackable storage with a satisfyingly clean fit."},
  {id:4,name:"Tool Tower",category:"Desk",price:28,color:"cream",desc:"A ribbed vertical caddy for pens, tools and brushes."},
  {id:5,name:"Pocket Dock",category:"Accessories",price:16,color:"lime",desc:"A compact landing zone for small daily essentials."},
  {id:6,name:"Gallery Desk Kit",category:"Kits",price:74,color:"pink",desc:"Six coordinated pieces. The full desk reset in one box."},
];

const money = (n:number) => `$${n.toFixed(2)}`;

export default function Home() {
  const [cart,setCart] = useState<Cart>({});
  const [drawer,setDrawer] = useState(false);
  const [menu,setMenu] = useState(false);
  const [category,setCategory] = useState("All");
  const [query,setQuery] = useState("");
  const [notice,setNotice] = useState("");
  const [selectedProduct,setSelectedProduct] = useState<Product|null>(null);
  const [selectedColor,setSelectedColor] = useState(colorOptions[0]);
  const [detailQty,setDetailQty] = useState(1);
  const [cartColors,setCartColors] = useState<Record<number,string>>({});
  useEffect(()=>{ try { setCart(JSON.parse(localStorage.getItem("smokhive-cart")||"{}")); } catch {} },[]);
  useEffect(()=>{ localStorage.setItem("smokhive-cart",JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ try { setCartColors(JSON.parse(localStorage.getItem("smokhive-colors")||"{}")); } catch {} },[]);
  useEffect(()=>{ localStorage.setItem("smokhive-colors",JSON.stringify(cartColors)); },[cartColors]);
  useEffect(()=>{
    if(!selectedProduct) return;
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape") setSelectedProduct(null)};
    document.addEventListener("keydown",close);
    document.body.classList.add("modal-open");
    return ()=>{document.removeEventListener("keydown",close);document.body.classList.remove("modal-open")};
  },[selectedProduct]);
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  const subtotal = products.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
  const filtered = useMemo(()=>products.filter(p=>(category==="All"||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[category,query]);
  const add=(id:number)=>{setCart(c=>({...c,[id]:(c[id]||0)+1}));setNotice("Added to cart");setTimeout(()=>setNotice(""),1400)};
  const viewProduct=(product:Product)=>{setSelectedProduct(product);setSelectedColor(colorOptions.find(c=>c.className===product.color)||colorOptions[0]);setDetailQty(1)};
  const addConfigured=()=>{if(!selectedProduct)return;setCart(c=>({...c,[selectedProduct.id]:(c[selectedProduct.id]||0)+detailQty}));setCartColors(c=>({...c,[selectedProduct.id]:selectedColor.name}));setSelectedProduct(null);setNotice(`${detailQty} × ${selectedProduct.name} added`);setDrawer(true);setTimeout(()=>setNotice(""),1400)};
  const qty=(id:number,n:number)=>setCart(c=>{const next={...c}; if(n<=0) delete next[id]; else next[id]=n; return next});
  return <main>
    <div className="ticker">FREE SHIPPING $50+ <span>•</span> PRINTED TO ORDER <span>•</span> 30-DAY RETURNS</div>
    <header>
      <a className="logo" href="#top">SMOK<span>HIVE</span></a>
      <nav className={menu?"open":""}><a href="#shop" onClick={()=>setMenu(false)}>Shop</a><a href="#story" onClick={()=>setMenu(false)}>Our process</a><a href="#reviews" onClick={()=>setMenu(false)}>Reviews</a><a href="#faq" onClick={()=>setMenu(false)}>FAQ</a></nav>
      <div className="header-actions"><button className="icon-btn" aria-label="Search" onClick={()=>document.getElementById("search")?.focus()}>⌕</button><button className="cart-btn" onClick={()=>setDrawer(true)} aria-label={`Cart with ${count} items`}>BAG <b>{count}</b></button><button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?"×":"☰"}</button></div>
    </header>

    <section className="hero" id="top">
      <div className="spray spray-one">✦</div><div className="spray spray-two">////</div>
      <div className="hero-copy"><p className="eyebrow">MAKE SPACE. KEEP STYLE.</p><h1>ORGANIZE<br/><i>OUT</i> LOUD.</h1><p className="dek">3D-printed organizers made for desks that refuse to blend in. Designed in small batches. Built for daily use.</p><div className="hero-actions"><a className="primary" href="#shop">SHOP THE DROP →</a><button className="text-btn" onClick={()=>add(6)}>ADD THE FULL KIT</button></div><div className="rating">★★★★★ <span>4.9 · 2,400+ organized spaces</span></div></div>
      <div className="hero-art"><img src="/smokhive-hero.jpg" alt="Colorful 3D-printed desk organizers on concrete plinths"/><div className="price-tag"><span>GALLERY DESK KIT<br/><small>6 PIECES</small></span><b>$74</b></div></div>
    </section>
    <section className="trust"><div>▣ <b>MADE TO ORDER</b></div><div>▱ <b>DURABLE PLA+</b></div><div>↻ <b>30-DAY RETURNS</b></div></section>

    <section className="shop" id="shop"><div className="section-head"><div><p className="kicker">THE DAILY EDIT.</p><h2>FUNCTION, WITH A LOUDER VOICE.</h2></div><p>Small-batch pieces that bring order without draining the personality from your space.</p></div>
      <div className="tools"><div className="filters">{["All","Desk","Storage","Accessories","Kits"].map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><input id="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH PIECES" aria-label="Search products"/></div>
      <div className="grid">{filtered.map((p,i)=><article className="product" key={p.id} onClick={()=>viewProduct(p)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")viewProduct(p)}} tabIndex={0} role="button" aria-label={`View details for ${p.name}`}><div className={`product-art ${p.color}`}><span className="number">0{i+1}</span><div className="shape"><span></span><span></span><span></span></div><button className="quick" onClick={e=>{e.stopPropagation();add(p.id)}} aria-label={`Quick add ${p.name}`}>+</button><span className="view-hint">VIEW DETAILS ↗</span></div><div className="product-copy"><div><p>{p.category}</p><h3>{p.name}</h3></div><b>{money(p.price)}</b></div><p className="product-desc">{p.desc}</p><button className="add" onClick={e=>{e.stopPropagation();viewProduct(p)}}>VIEW ITEM <span>→</span></button></article>)}</div>
      {!filtered.length&&<p className="empty">No pieces found. Try another search.</p>}
    </section>

    <section className="story" id="story"><div className="story-poster"><span>NO.</span><strong>MASS<br/>BORING.</strong><i>JUST GOOD DESIGN.</i></div><div><p className="eyebrow pink-label">PRINTED WITH PURPOSE</p><h2>ONE LAYER<br/>AT A TIME.</h2><p>Every SmokHive piece is printed to order in durable plant-based PLA+. That means less waste, small-batch quality control, and a finish with real texture.</p><ul><li><b>01</b> Designed for real routines</li><li><b>02</b> Printed in small batches</li><li><b>03</b> Packed without plastic fluff</li></ul></div></section>
    <section className="reviews" id="reviews"><p className="kicker">HEARD ON THE STREET.</p><div className="review-grid"><blockquote>“The cable grid fixed the mess and looks like a tiny art object.”<cite>— Maya R. ★★★★★</cite></blockquote><blockquote>“Feels sturdy, fits perfectly, and the pink is even better in person.”<cite>— Jordan K. ★★★★★</cite></blockquote><blockquote>“Finally, desk storage that doesn’t look like office supply storage.”<cite>— Alex T. ★★★★★</cite></blockquote></div></section>
    <section className="faq" id="faq"><h2>THE FINE PRINT.</h2>{[["How long does printing take?","Most pieces are made and dispatched within 2–4 business days."],["What material do you use?","Durable PLA+, a plant-based plastic chosen for crisp detail and everyday strength."],["Can I return an item?","Yes. Unused items can be returned within 30 days of delivery."],["Will colors match exactly?","Small shade variations can happen between material batches—part of small-batch production."]].map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section>
    <footer><div className="logo">SMOKHIVE</div><p>Objects for organized chaos.</p><div><a href="#shop">Shop</a><a href="#story">Process</a><a href="#faq">Help</a></div><small>© 2026 SmokHive. Demo storefront.</small></footer>

    <div className={drawer?"overlay show":"overlay"} onClick={()=>setDrawer(false)}></div>
    <aside className={drawer?"cart open":"cart"} aria-hidden={!drawer}><div className="cart-head"><div><p>YOUR BAG</p><h2>{count} {count===1?"PIECE":"PIECES"}</h2></div><button onClick={()=>setDrawer(false)} aria-label="Close cart">×</button></div>
      <div className="cart-items">{count===0?<div className="cart-empty"><span>□</span><h3>Your bag is empty.</h3><p>Start with a piece that makes space.</p><button onClick={()=>{setDrawer(false);location.hash="shop"}}>SHOP THE DROP</button></div>:products.filter(p=>cart[p.id]).map(p=><div className="cart-line" key={p.id}><div className={`mini ${colorOptions.find(c=>c.name===cartColors[p.id])?.className||p.color}`}></div><div><h3>{p.name}</h3><p>{cartColors[p.id]||"Standard color"} · {money(p.price)}</p><div className="quantity"><button onClick={()=>qty(p.id,cart[p.id]-1)}>−</button><span>{cart[p.id]}</span><button onClick={()=>qty(p.id,cart[p.id]+1)}>+</button></div></div><button className="remove" onClick={()=>qty(p.id,0)}>×</button></div>)}</div>
      {count>0&&<div className="cart-foot"><div><span>SUBTOTAL</span><b>{money(subtotal)}</b></div><p>{subtotal>=50?"✓ You unlocked free shipping.":`${money(50-subtotal)} away from free shipping.`}</p><button onClick={()=>alert("Demo checkout ready to connect to your payment provider.")}>CHECKOUT →</button><small>Taxes calculated at checkout.</small></div>}
    </aside>
    {selectedProduct&&<div className="detail-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedProduct(null)}}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="detail-close" onClick={()=>setSelectedProduct(null)} aria-label="Close product details">×</button><div className={`detail-art ${selectedColor.className}`}><span className="detail-sticker">MADE TO ORDER</span><div className="detail-shape"><span></span><span></span><span></span></div><small>VISIBLE LAYER TEXTURE · PLA+</small></div><div className="detail-info"><p className="detail-category">{selectedProduct.category} / SMALL BATCH</p><h2 id="detail-title">{selectedProduct.name}</h2><div className="detail-price"><strong>{money(selectedProduct.price)}</strong><span>★★★★★ 4.9</span></div><p>{selectedProduct.desc} Printed to order with durable PLA+ and finished with the distinctive layer texture that makes every piece feel designed, not mass-produced.</p><div className="detail-points"><span>✓ Durable PLA+</span><span>✓ Ships in 2–4 days</span><span>✓ 30-day returns</span></div><fieldset><legend>COLOR — <b>{selectedColor.name}</b></legend><div className="swatches">{colorOptions.map(color=><button key={color.name} className={selectedColor.name===color.name?"selected":""} style={{background:color.value}} onClick={()=>setSelectedColor(color)} aria-label={`Choose ${color.name}`} aria-pressed={selectedColor.name===color.name}></button>)}</div></fieldset><div className="detail-buy"><div className="detail-qty"><button onClick={()=>setDetailQty(q=>Math.max(1,q-1))} aria-label="Decrease quantity">−</button><span>{detailQty}</span><button onClick={()=>setDetailQty(q=>q+1)} aria-label="Increase quantity">+</button></div><button className="detail-add" onClick={addConfigured}>ADD TO BAG · {money(selectedProduct.price*detailQty)} →</button></div><small className="detail-note">Free shipping on orders over $50.</small></div></section></div>}
    {notice&&<div className="toast">✓ {notice}</div>}
  </main>
}
