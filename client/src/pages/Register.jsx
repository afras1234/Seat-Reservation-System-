import React, {useState} from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form,setForm] = useState({ name:'', email:'', password:'' });
  const [msg,setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/auth/register', form);
      setMsg('Registered - redirecting to login...');
      setTimeout(()=>nav('/login'),1200);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl mb-4">Register</h2>
        {msg && <div className="mb-3 text-red-600">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <input className="w-full p-2 border rounded" placeholder="Office email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
          <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
          <button className="w-full btn btn-blue">Create account</button>
        </form>
      </div>
    </div>
  );
}
