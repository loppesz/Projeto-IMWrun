/**
 * Resultados de corridas
 * O admin registra o tempo de cada participante manualmente ou via cronômetro do site.
 * Não há GPS tracking — o tempo é cronometrado no site e confirmado pela bancada.
 */
import { Router } from 'express';

const router = Router();

// POST /api/results — registrar resultado de um participante
// (chamado pelo admin ou pelo sistema de cronômetro)
router.post('/', (_req, res) => {
  res.json({ message: 'Em implementação' });
});

// GET /api/results/:raceId — resultados de uma corrida
router.get('/:raceId', (_req, res) => {
  res.json({ message: 'Em implementação' });
});

export default router;
