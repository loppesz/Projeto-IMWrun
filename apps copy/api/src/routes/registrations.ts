import { Router } from 'express';

import { query, queryOne } from '../database/db';

export const registrationsRouter = Router();

// POST /api/registrations — inscrever participante
registrationsRouter.post('/', async (req, res, next) => {
  try {
    const { name, phone, age, gender, raceId, groupId } = req.body as {
      name: string; phone: string; age: number;
      gender?: string; raceId: string; groupId?: string;
    };

    // Validações básicas
    if (!name?.trim() || name.trim().length < 2)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Nome inválido (mínimo 2 caracteres)' });

    const digits = phone?.replace(/\D/g, '');
    if (!digits || digits.length < 10 || digits.length > 11)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Telefone inválido (10 ou 11 dígitos)' });

    if (!age || age < 1 || age > 120)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Idade inválida (1-120)' });

    if (!raceId)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Corrida não informada' });

    // Verifica se corrida existe e está disponível
    const race = await queryOne(`SELECT id, status FROM races WHERE id = $1`, [raceId]);
    if (!race) return res.status(404).json({ code: 'NOT_FOUND', message: 'Corrida não encontrada' });
    if ((race as any).status === 'locked' || (race as any).status === 'finished')
      return res.status(400).json({ code: 'RACE_UNAVAILABLE', message: 'Corrida não está disponível para inscrição' });

    // Verifica ou cria participante pelo telefone
    let participant = await queryOne<any>(
      `SELECT id, participant_number FROM participants WHERE phone = $1`, [digits]
    );

    if (!participant) {
      // Gera próximo número de participante
      const lastRow = await queryOne<any>(
        `SELECT participant_number FROM participants ORDER BY participant_number DESC LIMIT 1`
      );
      const lastNum = lastRow ? parseInt(lastRow.participant_number) : 0;
      const nextNum = String(lastNum + 1).padStart(4, '0');

      participant = await queryOne<any>(
        `INSERT INTO participants (name, phone, age, gender, participant_number)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, participant_number`,
        [name.trim(), digits, age, gender ?? null, nextNum]
      );
    }

    // Verifica duplicata nessa corrida
    const existing = await queryOne(
      `SELECT id FROM registrations WHERE participant_id = $1 AND race_id = $2`,
      [participant!.id, raceId]
    );
    if (existing)
      return res.status(409).json({ code: 'PHONE_DUPLICATE', message: 'Este telefone já está inscrito nesta corrida' });

    // Registra inscrição
    await query(
      `INSERT INTO registrations (participant_id, race_id, group_id)
       VALUES ($1, $2, $3)`,
      [participant!.id, raceId, groupId ?? null]
    );

    res.status(201).json({
      participantNumber: (participant as any).participant_number,
      message: 'Inscrição realizada com sucesso',
    });
  } catch (err) {
    next(err);
  }
});
