import { Router } from 'express';

import { queryOne } from '../database/db';

export const authRouter = Router();

/**
 * Login simples para participante — usa número de participante como identificador.
 * Em produção pode adicionar OTP, mas para uso interno (admin registra resultados)
 * isso é suficiente para o participante ver seu perfil e cronômetro.
 */

// POST /api/auth/participant — login pelo número de participante
authRouter.post('/participant', async (req, res, next) => {
  try {
    const { participantNumber, phone } = req.body as { participantNumber: string; phone: string };

    if (!participantNumber || !phone)
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Número e telefone obrigatórios' });

    const digits = phone.replace(/\D/g, '');
    const participant = await queryOne<any>(
      `SELECT id, name, participant_number, phone FROM participants
       WHERE participant_number = $1 AND phone = $2`,
      [participantNumber.padStart(4, '0'), digits]
    );

    if (!participant)
      return res.status(401).json({ code: 'NOT_FOUND', message: 'Número ou telefone incorreto' });

    // Retorna dados do participante — frontend salva no localStorage
    res.json({
      id: participant.id,
      name: participant.name,
      participantNumber: participant.participant_number,
    });
  } catch (err) {
    next(err);
  }
});
