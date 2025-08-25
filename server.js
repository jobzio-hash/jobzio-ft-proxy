
// JOBZIO — Proxy France Travail (Offres d'emploi) avec CORS
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // autorise toutes origines par défaut

const AUTH_URL = process.env.AUTH_URL || 'https://api.emploi-store.fr/partenaire/oauth2/access_token?realm=/partenaire';
const API_BASE = process.env.API_BASE || 'https://api.emploi-store.fr/partenaire/offresdemploi/v2';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPE = process.env.SCOPE || 'api_offresdemploiv2';

let token = null;
let tokenExpiry = 0;

async function getToken(){
  const now = Date.now();
  if(token && now < tokenExpiry - 60000) return token;
  const body = new URLSearchParams();
  body.append('grant_type','client_credentials');
  body.append('client_id', CLIENT_ID);
  body.append('client_secret', CLIENT_SECRET);
  body.append('scope', SCOPE);
  const res = await fetch(AUTH_URL, { method:'POST', body, headers:{'Content-Type':'application/x-www-form-urlencoded'} });
  if(!res.ok){ const txt = await res.text(); throw new Error('Auth failed '+res.status+' '+txt); }
  const js = await res.json();
  token = js.access_token;
  tokenExpiry = Date.now() + (js.expires_in || 3600)*1000;
  return token;
}

app.get('/health', (req,res)=>res.json({ok:true}));

app.get('/api/offres/search', async (req, res) => {
  try{
    const t = await getToken();
    const url = new URL(API_BASE + '/offres/search');
    for(const [k,v] of Object.entries(req.query)) url.searchParams.set(k,v);
    const r = await fetch(url, { headers: { 'Authorization': 'Bearer '+t, 'Accept':'application/json' } });
    const txt = await r.text();
    res.status(r.status).type('application/json').send(txt);
  }catch(e){
    res.status(500).json({error: String(e)});
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>console.log('Proxy FT running on '+PORT));
