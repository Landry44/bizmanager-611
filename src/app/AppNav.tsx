"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";

const links=[["/dashboard","Vue d'ensemble","basic"],["/products","Produits & stock","basic"],["/sales","Ventes / caisse","basic"],["/customers","Clients","basic"],["/purchases","Achats","basic"],["/suppliers","Fournisseurs","basic"],["/finance","Finance & paie","basic"],["/documents","Documents","advanced"],["/reports","Rapports avancés","advanced"],["/subscription","Mon abonnement","basic"],["/settings","Paramètres","basic"]];

export default function AppNav(){
  const path=usePathname();
  const [superadmin,setSuperadmin]=useState(false);
  const [plan,setPlan]=useState("FREE");
  const [open,setOpen]=useState(false);
  const [unread,setUnread]=useState(0);
  const [deferredPrompt,setDeferredPrompt]=useState<any>(null);

  useEffect(()=>{
    setOpen(false);
    fetch('/api/me').then(r=>r.ok?r.json():null).then(async d=>{
      setSuperadmin(!!d?.user?.isSuperAdmin);
      const cid=d?.user?.companies?.[0]?.id;
      if(cid){
        const sr=await fetch(`/api/companies/${cid}/subscription`);
        if(sr.ok){const x=await sr.json();setPlan(x.subscription?.plan||"FREE")}
      }
    }).catch(()=>{});
    fetch('/api/notifications').then(r=>r.ok?r.json():null).then(d=>setUnread(d?.unread||0)).catch(()=>{});
  },[path]);

  // Enregistrement du Service Worker
  useEffect(()=>{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
  },[]);

  // Capture de l'événement d'installation
  useEffect(()=>{
    const handler=(e:any)=>{e.preventDefault();setDeferredPrompt(e)};
    window.addEventListener('beforeinstallprompt',handler);
    return ()=>window.removeEventListener('beforeinstallprompt',handler);
  },[]);

  async function handleInstall(){
    if(!deferredPrompt){
      alert("Pour installer, ouvrez le menu de votre navigateur (⋮) et choisissez 'Ajouter à l'écran d'accueil'.");
      return;
    }
    deferredPrompt.prompt();
    const {outcome}=await deferredPrompt.userChoice;
    if(outcome==='accepted'){setDeferredPrompt(null)}
  }

  if(path==="/"||path==="/login"||path==="/register")return null;

  return (
    <header className="bm-mobile-nav" style={{background:'#0f172a',color:'white',padding:'12px 18px',boxShadow:'0 3px 15px #0f172a22'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <Link href="/dashboard" style={{color:'white',fontWeight:900,fontSize:20,textDecoration:'none',whiteSpace:'nowrap'}}>❤️ BizManager <span style={{fontSize:10,color:'#93c5fd',fontWeight:600}}>PRO</span></Link>
        <button className="bm-nav-toggle" aria-label="Ouvrir le menu" onClick={()=>setOpen(v=>!v)}>{open?"✕":"☰"}</button>
      </div>
      <nav className={`bm-nav-menu${open?" open":""}`} style={{display:'flex',gap:5,flexWrap:'wrap',alignItems:'center',marginTop:open?10:0}}>
        {links.map(([href,label])=><Link key={href} href={href} style={{color:'white',textDecoration:'none',fontSize:13,padding:'9px 11px',borderRadius:8,background:path.startsWith(href)?"#2563eb":"#ffffff12"}}>{label}</Link>)}
        {superadmin&&<Link href="/superadmin" style={{color:'#7c3aed',textDecoration:'none',fontSize:13,padding:'9px 11px',borderRadius:8,background:path.startsWith('/superadmin')?'#2563eb':'#ffffff12'}}>Superadmin</Link>}
        <Link href="/notifications" style={{color:'white',textDecoration:'none',fontSize:13,padding:'9px 11px',borderRadius:8,background:path.startsWith('/notifications')?'#2563eb':'#ffffff12'}}>Notifications{unread>0&&<span style={{marginLeft:5,background:'#ef4444',borderRadius:999,padding:'2px 6px',fontSize:10}}>{unread}</span>}</Link>
        <button onClick={handleInstall} style={{background:'#22c55e',color:'white',border:'none',borderRadius:8,padding:'9px 12px',cursor:'pointer',fontSize:13,fontWeight:'bold'}}>↓ Installer</button>
        <button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});window.location.href='/login'}} style={{background:'#ffffff12',color:'white',border:'1px solid #ffffff30',borderRadius:8,padding:'9px 12px',cursor:'pointer',fontSize:13}}>Déconnexion</button>
      </nav>
    </header>
  );
}
