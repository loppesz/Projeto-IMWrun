'use client';

import { useState } from 'react';

import Link from 'next/link';

import { BottomNav } from '@/components/BottomNav';

const MOCK_RACE = {
  id: '3',
  number: 3,
  name: 'IMW Run #03',
  date: '12 de Abril de 2025',
  time: '07:00',
  location: 'Asa Sul, Brasília/DF',
  distance: '5 km',
  hasRoute: false,
};

export default function RaceRegistrationPage() {
  const race = MOCK_RACE;

  const [form, setForm] = useState({ name: '', phone: '', age: '', accepted: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [participantNumber, setParticipantNumber] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 100)
      e.name = 'Nome deve ter entre 2 e 100 caracteres.';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11)
      e.phone = 'Telefone deve ter 10 ou 11 dígitos.';
    const age = parseInt(form.age);
    if (isNaN(age) || age < 1 || age > 120)
      e.age = 'Idade deve ser entre 1 e 120.';
    if (!form.accepted)
      e.accepted = 'Você precisa aceitar os termos para participar.';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Mock: simula geração de número
    setTimeout(() => {
      setLoading(false);
      setParticipantNumber('0042');
      setSubmitted(true);
    }, 1200);
  }

  return (
    <>
      <main className="min-h-screen bg-brand-light pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-brand-primary px-6 py-10 text-white">
          <div className="mx-auto max-w-2xl">
            <Link href="/calendar" className="mb-3 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white">
              ← Voltar ao calendário
            </Link>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">Inscrição</p>
            <h1 className="mt-1 text-3xl font-extrabold">{race.name}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-200">
              <span>📅 {race.date}</span>
              <span>🕐 {race.time}</span>
              <span>📍 {race.location}</span>
              <span>📏 {race.distance}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-sm px-4 py-8">
          {submitted ? (
            /* Sucesso */
            <div className="rounded-2xl bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                🎉
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Inscrição confirmada!</h2>
              <p className="mt-2 text-sm text-gray-500">Seu número de participante é:</p>
              <div className="my-4 inline-block rounded-2xl bg-brand-primary px-8 py-4">
                <p className="text-4xl font-extrabold tracking-widest text-white">#{participantNumber}</p>
              </div>
              <p className="text-sm text-gray-500">Guarde este número. Você precisará dele no dia da corrida.</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700"
                >
                  Fazer login com meu telefone
                </Link>
                <Link href="/" className="text-sm text-gray-500 hover:text-brand-primary">
                  Voltar ao início
                </Link>
              </div>
            </div>
          ) : (
            /* Formulário */
            <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 text-lg font-bold text-brand-dark">Preencha seus dados</h2>

              {/* Nome */}
              <div className="mb-4">
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome completo *
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: João da Silva"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-brand-primary'}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Telefone */}
              <div className="mb-4">
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Telefone (com DDD) *
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="11 99999-8888"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-brand-primary'}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Idade */}
              <div className="mb-4">
                <label htmlFor="age" className="mb-1 block text-sm font-medium text-gray-700">
                  Idade *
                </label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                  placeholder="Ex: 30"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${errors.age ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-brand-primary'}`}
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>

              {/* Aceite */}
              <div className="mb-5">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${errors.accepted ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <input
                    type="checkbox"
                    checked={form.accepted}
                    onChange={e => setForm(f => ({ ...f, accepted: e.target.checked }))}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-brand-primary"
                  />
                  <span className="text-sm text-gray-600">
                    Declaro que estou em condições físicas para participar e aceito os termos de participação do IMW Run.
                  </span>
                </label>
                {errors.accepted && <p className="mt-1 text-xs text-red-600">{errors.accepted}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-primary font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Inscrevendo...' : 'Confirmar inscrição'}
              </button>
            </form>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
