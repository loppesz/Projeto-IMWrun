'use client';

import { useState } from 'react';

import { BottomNav } from '@/components/BottomNav';

type Step = 'phone' | 'code' | 'success';
type Channel = 'sms' | 'whatsapp';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      setError('Telefone inválido. Use 10 ou 11 dígitos.');
      return;
    }
    setLoading(true);
    // Mock: simula envio
    setTimeout(() => {
      setLoading(false);
      setStep('code');
    }, 1200);
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos.');
      return;
    }
    setLoading(true);
    // Mock: qualquer código funciona
    setTimeout(() => {
      setLoading(false);
      if (code === '000000') {
        setError('Código inválido. Tente novamente.');
      } else {
        setStep('success');
      }
    }, 1000);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-light px-4 pb-20 md:pb-0">
        <div className="w-full max-w-sm">
          {/* Logo / título */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-3xl shadow-lg">
              🏃
            </div>
            <h1 className="text-2xl font-extrabold text-brand-dark">IMW Run</h1>
            <p className="mt-1 text-sm text-gray-500">Entre com seu número de telefone</p>
          </div>

          {/* Step 1: Telefone */}
          {step === 'phone' && (
            <form onSubmit={handleRequestOtp} className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-bold text-brand-dark">Qual é seu telefone?</h2>

              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="phone">
                Telefone (com DDD)
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="11 99999-8888"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-lg tracking-wider focus:border-brand-primary focus:outline-none"
                maxLength={15}
              />

              <p className="mb-2 text-sm font-medium text-gray-700">Receber código via:</p>
              <div className="mb-4 flex gap-3">
                {(['whatsapp', 'sms'] as Channel[]).map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
                      channel === ch
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {ch === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS'}
                  </button>
                ))}
              </div>

              {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Enviando...' : `Enviar código por ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`}
              </button>
            </form>
          )}

          {/* Step 2: Código */}
          {step === 'code' && (
            <form onSubmit={handleVerifyOtp} className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-1 text-lg font-bold text-brand-dark">Digite o código</h2>
              <p className="mb-5 text-sm text-gray-500">
                Enviamos um código para <strong>{phone}</strong> via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}.
                Válido por 10 minutos.
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] focus:border-brand-primary focus:outline-none"
              />

              {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setCode(''); setError(''); }}
                className="mt-3 w-full text-center text-sm text-gray-500 hover:text-brand-primary"
              >
                ← Usar outro número
              </button>
            </form>
          )}

          {/* Step 3: Sucesso */}
          {step === 'success' && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
                ✅
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Bem-vindo!</h2>
              <p className="mt-2 text-sm text-gray-500">Login realizado com sucesso.</p>
              <a
                href="/profile"
                className="mt-5 flex min-h-[44px] items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700"
              >
                Ver meu perfil →
              </a>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
