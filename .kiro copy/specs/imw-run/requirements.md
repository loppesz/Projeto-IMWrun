# Requirements Document

## Introduction

O **IMW Run** é uma plataforma web de corrida e caminhada desenvolvida por uma igreja, com o objetivo de promover saúde, comunhão, atividade física e evangelismo. O sistema organiza uma jornada anual de 12 corridas, cada uma com 5 km válidos dentro de um percurso oficial. Participantes se inscrevem, acompanham seu progresso, desbloqueiam conquistas e competem em um ranking comunitário. Administradores gerenciam corridas, percursos, inscrições e validações. A experiência é mobile-first, visualmente esportiva e com identidade cristã sutil.

---

## Glossary

- **Participante**: Pessoa inscrita em ao menos uma corrida do IMW Run.
- **Corrida**: Evento de corrida ou caminhada de 5 km oficialmente organizado pela igreja. Há 12 corridas por ano.
- **Percurso**: Trajeto oficial desenhado pelo administrador no mapa, composto por uma sequência de coordenadas geográficas com ponto inicial e ponto final definidos.
- **Distância_Válida**: Distância percorrida pelo participante enquanto sua posição GPS está dentro do buffer de tolerância do percurso oficial.
- **Conquista**: Badge ou medalha digital desbloqueada pelo participante ao concluir uma corrida ou atingir uma meta específica.
- **Ranking**: Lista ordenada de participantes por critérios como corridas concluídas e quilômetros acumulados.
- **Admin**: Usuário com acesso à área administrativa, capaz de gerenciar corridas, percursos, inscrições e rankings.
- **GPS_Tracker**: Componente do sistema responsável por capturar a posição GPS do participante via navegador durante a corrida.
- **Buffer_Percurso**: Área de tolerância ao redor do percurso oficial (em metros) dentro da qual a distância percorrida é considerada válida.
- **Sequência**: Número de corridas consecutivas concluídas pelo participante sem interrupção.
- **Google_Sheets_Integration**: Componente responsável por sincronizar dados de inscrição com uma planilha Google Sheets via API.
- **Sessão**: Estado autenticado de um participante ou administrador no sistema.
- **Sistema**: A plataforma web IMW Run como um todo.

---

## Requirements

---

### Requirement 1: Página Inicial e Apresentação do Evento

**User Story:** Como visitante, quero ver informações claras sobre a próxima corrida ao acessar o site, para que eu possa me inscrever ou visualizar o percurso rapidamente.

#### Acceptance Criteria

1. THE Sistema SHALL exibir um slogan fixo com o texto "Corra. Supere seus limites. Faça parte da missão." na página inicial.
2. WHEN houver ao menos uma corrida cadastrada com status "Disponível" ou "Em andamento", THE Sistema SHALL exibir a data, horário, local e distância da próxima corrida na página inicial.
3. WHEN não houver nenhuma corrida com status "Disponível" ou "Em andamento" cadastrada, THE Sistema SHALL exibir uma mensagem indicando que nenhuma corrida está disponível no momento, sem exibir os botões "Inscreva-se" ou "Ver percurso".
4. WHEN a próxima corrida estiver disponível, THE Sistema SHALL exibir um botão "Inscreva-se" que redireciona para o formulário de inscrição.
5. WHEN a próxima corrida estiver disponível e possuir um percurso cadastrado, THE Sistema SHALL exibir um botão "Ver percurso" que redireciona para a página do mapa do percurso daquela corrida.
6. THE Sistema SHALL exibir a seção "Sua Jornada" representando as 12 corridas do ano como uma sequência visual de conquistas.
7. WHILE o participante não estiver autenticado, THE Sistema SHALL exibir todas as 12 corridas como bloqueadas (ícone de cadeado fechado) na seção "Sua Jornada".
8. WHEN o participante estiver autenticado e tiver concluído a corrida N (onde N < 12), THE Sistema SHALL exibir a corrida N com estado "concluída" e a corrida N+1 com estado "desbloqueada" na seção "Sua Jornada".
9. WHEN uma conquista for desbloqueada, THE Sistema SHALL exibir uma animação de desbloqueio de medalha com duração mínima de 1 segundo e máxima de 3 segundos antes de atualizar permanentemente o estado visual da corrida.

---

### Requirement 2: Inscrição de Participante

**User Story:** Como visitante, quero me inscrever em uma corrida preenchendo um formulário simples, para que eu possa participar oficialmente do evento.

#### Acceptance Criteria

1. THE Sistema SHALL apresentar um formulário de inscrição com os campos: Nome completo (2 a 100 caracteres), Telefone (10 a 11 dígitos numéricos) e Idade (número inteiro entre 1 e 120).
2. THE Sistema SHALL apresentar um checkbox de aceite de participação como campo obrigatório no formulário de inscrição.
3. WHEN o participante submeter o formulário com todos os campos válidos e o checkbox marcado, THE Sistema SHALL gerar automaticamente um número de participante único no formato numérico com 4 dígitos (ex: #0042).
4. WHEN o participante submeter o formulário com todos os campos válidos e o checkbox marcado, THE Sistema SHALL registrar: nome, telefone, idade, número de participante gerado, data e hora de inscrição, e identificador da corrida associada.
5. IF o participante submeter o formulário com algum campo obrigatório vazio ou inválido, THEN THE Sistema SHALL exibir uma mensagem de erro por campo, identificando o nome do campo e a regra violada, sem submeter o formulário.
6. IF o número de telefone informado já estiver cadastrado para a mesma corrida, THEN THE Sistema SHALL exibir uma mensagem informando que o telefone já está inscrito naquela corrida.
7. WHEN a inscrição for concluída com sucesso, THE Sistema SHALL exibir o número de participante gerado.
8. IF o número de participantes cadastrados no sistema atingir 9.999, THEN THE Sistema SHALL exibir uma mensagem informando que as inscrições estão encerradas e não permitir novas inscrições.

---

### Requirement 3: Integração com Google Sheets

**User Story:** Como administrador, quero que as inscrições sejam automaticamente sincronizadas com uma planilha Google Sheets, para que eu possa acompanhar os participantes externamente.

#### Acceptance Criteria

1. WHEN uma nova inscrição for registrada com sucesso, THE Google_Sheets_Integration SHALL inserir uma nova linha na planilha correspondente à corrida com os dados: Número, Nome, Telefone, Idade e Data de inscrição.
2. THE Google_Sheets_Integration SHALL organizar os dados de inscrições em abas separadas por corrida dentro da planilha, nomeando cada aba com o nome da corrida correspondente.
3. IF a sincronização com o Google Sheets falhar, THEN THE Sistema SHALL registrar o erro internamente e retentar a sincronização automaticamente no máximo 3 vezes, com intervalo mínimo de 30 segundos entre as tentativas.
4. THE Sistema SHALL concluir a inscrição do participante independentemente do resultado da sincronização com o Google Sheets.
5. IF todas as tentativas de sincronização falharem, THEN THE Sistema SHALL enfileirar o registro para reprocessamento posterior e notificar o administrador sobre a pendência de sincronização.

---

### Requirement 4: Calendário das 12 Corridas

**User Story:** Como participante, quero visualizar todas as 12 corridas do ano em um calendário, para que eu possa me planejar e acompanhar meu progresso anual.

#### Acceptance Criteria

1. THE Sistema SHALL exibir uma página "Calendário IMW Run" com um card individual para cada uma das 12 corridas do ano.
2. THE Sistema SHALL exibir em cada card: número sequencial da corrida, nome, data, horário, local, distância e status.
3. THE Sistema SHALL atribuir o status inicial das corridas da seguinte forma: corrida 1 com status "Disponível" e corridas 2 a 12 com status "Bloqueada". O status de cada corrida pode ser um dos seguintes valores: "Bloqueada", "Disponível", "Em andamento" ou "Concluída".
4. WHEN o participante estiver autenticado e concluir a corrida N (onde N < 12), THE Sistema SHALL atualizar o status da corrida N para "Concluída" e o status da corrida N+1 de "Bloqueada" para "Disponível". WHEN o participante concluir a corrida 12, THE Sistema SHALL atualizar apenas o status da corrida 12 para "Concluída".
5. WHEN o participante concluir todas as 12 corridas, THE Sistema SHALL desbloquear a conquista "IMW RUN 12/12" e exibir uma animação de conclusão com duração mínima de 2 segundos.
6. THE Sistema SHALL exibir a conquista "IMW RUN 12/12" como bloqueada para participantes que não tenham concluído as 12 corridas.

---

### Requirement 5: Mapa do Percurso

**User Story:** Como participante, quero visualizar o percurso oficial da corrida em um mapa interativo, para que eu possa me familiarizar com o trajeto antes do evento.

#### Acceptance Criteria

1. WHEN o participante acessar a página de mapa de uma corrida, THE Sistema SHALL exibir o percurso oficial utilizando Mapbox ou OpenStreetMap com Leaflet.
2. THE Sistema SHALL renderizar o percurso no mapa como uma polilinha contínua conectando todos os pontos definidos pelo administrador, com marcadores visualmente distintos (cores ou ícones diferentes) para ponto inicial e ponto final.
3. WHEN o administrador acessar a área de criação de percurso, THE Sistema SHALL exibir um mapa interativo onde o administrador pode clicar para adicionar pontos sequenciais ao trajeto.
4. WHEN o administrador salvar um percurso, THE Sistema SHALL persistir a sequência ordenada de até 500 coordenadas geográficas, o ponto inicial, o ponto final e o identificador da corrida associada.
5. IF o administrador tentar salvar um percurso com menos de 3 pontos totais (início, ao menos 1 ponto intermediário e fim), THEN THE Sistema SHALL exibir uma mensagem de erro e impedir o salvamento.
6. WHEN um percurso for salvo pelo administrador, THE Sistema SHALL exibir esse percurso para os participantes com a mesma sequência e ordem de coordenadas definidas pelo administrador.
7. WHEN o participante acessar a página de mapa de uma corrida sem percurso cadastrado, THE Sistema SHALL exibir uma mensagem informando que o percurso ainda não foi definido.

---

### Requirement 6: Rastreamento GPS durante a Corrida

**User Story:** Como participante, quero iniciar minha corrida pelo site e ter minha distância rastreada por GPS, para que apenas os quilômetros percorridos dentro do percurso oficial sejam contabilizados.

#### Acceptance Criteria

1. WHEN o participante autenticado acessar a página de uma corrida ativa (dentro da janela de horário agendado pelo administrador), THE Sistema SHALL exibir um botão "Iniciar Corrida".
2. WHEN o participante acionar "Iniciar Corrida", THE GPS_Tracker SHALL solicitar permissão de acesso à localização do dispositivo.
3. IF o participante negar a permissão de localização, THEN THE Sistema SHALL exibir uma mensagem explicando que o GPS é necessário para rastrear a corrida e manter o botão "Iniciar Corrida" disponível.
4. WHEN a permissão de localização for concedida E a corrida for iniciada, THE GPS_Tracker SHALL capturar a posição do participante em intervalos máximos de 5 segundos durante toda a corrida.
5. WHILE a corrida estiver em andamento, THE GPS_Tracker SHALL comparar cada nova posição capturada com o trajeto oficial utilizando o Buffer_Percurso de 30 metros.
6. WHILE a corrida estiver em andamento e a posição do participante estiver dentro do Buffer_Percurso, THE Sistema SHALL acumular a distância calculada entre a posição atual e a posição anterior na Distância_Válida.
7. WHILE a corrida estiver em andamento e a posição do participante estiver fora do Buffer_Percurso, THE Sistema SHALL não acumular distância na Distância_Válida.
8. WHILE a corrida estiver em andamento, THE Sistema SHALL atualizar a exibição ao participante a cada 5 segundos com: Distância_Válida acumulada, tempo decorrido e posição atual no mapa com o percurso.
9. IF a variação entre duas posições GPS consecutivas for superior a 50 metros em um intervalo de 5 segundos, THEN THE GPS_Tracker SHALL descartar a posição inconsistente sem acumular distância, para evitar saltos artificiais de GPS.
10. IF o GPS_Tracker perder o sinal de localização por até 60 segundos, THEN THE Sistema SHALL exibir um aviso de perda de sinal e pausar o acúmulo de Distância_Válida sem encerrar a corrida.
11. IF o GPS_Tracker não recuperar o sinal de localização após 60 segundos de perda contínua, THEN THE Sistema SHALL oferecer ao participante a opção de encerrar a corrida com a Distância_Válida acumulada até o momento.
12. WHEN o participante acionar o botão "Encerrar Corrida" durante uma sessão de rastreamento ativa, THE Sistema SHALL encerrar o GPS_Tracker, parar o acúmulo de Distância_Válida e registrar o encerramento manual.
13. WHEN a corrida for encerrada (automaticamente ou manualmente), THE Sistema SHALL enviar ao servidor a sequência completa de coordenadas GPS capturadas e o tempo total para cálculo definitivo da Distância_Válida.

---

### Requirement 7: Finalização Automática da Corrida

**User Story:** Como participante, quero que minha corrida seja encerrada automaticamente ao completar 5 km válidos, para que eu receba um resumo do meu desempenho.

#### Acceptance Criteria

1. WHEN a Distância_Válida acumulada do participante atingir 5.000 metros, THE Sistema SHALL encerrar a corrida automaticamente.
2. WHEN a corrida for encerrada, THE Sistema SHALL exibir uma tela de conclusão com: tempo total decorrido (medido do início ao encerramento da sessão), Distância_Válida registrada, ritmo médio calculado como (tempo total em minutos ÷ Distância_Válida em km), data de realização e nome do percurso.
3. WHEN a corrida for encerrada com 5.000 metros válidos atingidos, THE Sistema SHALL registrar a corrida como concluída no perfil do participante.
4. WHEN a corrida for encerrada, THE Sistema SHALL confirmar ao participante que os dados foram salvos, incluindo: identificador do participante, identificador da corrida, tempo total, Distância_Válida, ritmo médio e data/hora de conclusão em UTC.
5. IF ocorrer uma falha de persistência ao tentar salvar o resultado da corrida, THEN THE Sistema SHALL exibir uma mensagem de erro ao participante indicando que o resultado não foi salvo e orientar o participante a entrar em contato com o administrador.
6. IF o participante percorrer uma distância total maior que 5.000 metros mas a Distância_Válida não atingir 5.000 metros, THEN THE Sistema SHALL registrar apenas a Distância_Válida efetivamente acumulada, não marcar a corrida como concluída e indicar na tela de conclusão que a distância mínima não foi atingida.
7. WHEN o participante acionar o botão "Encerrar Corrida" manualmente antes de atingir 5.000 metros válidos, THE Sistema SHALL encerrar a sessão de rastreamento e exibir a tela de conclusão (conforme definido no critério 2) com a Distância_Válida acumulada até o momento, sem marcar a corrida como concluída e indicando que a distância mínima não foi atingida.

---

### Requirement 8: Ranking de Participantes

**User Story:** Como participante, quero visualizar um ranking público dos participantes, para que eu possa acompanhar meu desempenho em relação à comunidade.

#### Acceptance Criteria

1. THE Sistema SHALL exibir uma página de Ranking com as colunas: Posição, Nome do participante, Corridas concluídas e Km acumulados.
2. THE Sistema SHALL ordenar o Ranking primariamente por número de corridas concluídas em ordem decrescente, secundariamente por quilômetros acumulados em ordem decrescente e terciariamente por ordem alfabética do nome do participante.
3. THE Sistema SHALL disponibilizar filtros mutuamente exclusivos no Ranking para: classificação geral, masculino, feminino, e faixas etárias (18–29, 30–39, 40–49, 50–59, 60+), além de filtro por corrida específica.
4. THE Sistema SHALL exibir no Ranking apenas nome do participante, posição, corridas concluídas e km acumulados, sem exibir telefone, e-mail, CPF, endereço ou qualquer outro dado de identificação pessoal.
5. WHEN um participante concluir uma corrida, THE Sistema SHALL atualizar todos os modos de visualização do Ranking em até 60 segundos após o registro da conclusão.
6. WHEN o filtro "corrida específica" for selecionado, THE Sistema SHALL exibir apenas as corridas que possuam ao menos uma conclusão registrada, ordenadas por data em ordem decrescente.

---

### Requirement 9: Perfil do Participante

**User Story:** Como participante autenticado, quero visualizar meu perfil com meu progresso, para que eu possa acompanhar minhas conquistas e minha evolução na jornada.

#### Acceptance Criteria

1. THE Sistema SHALL exibir na página de perfil do participante: nome, número de corridas concluídas no formato "X/12", distância total acumulada em quilômetros com 1 casa decimal, conquistas desbloqueadas e Sequência atual no formato "X corridas consecutivas".
2. THE Sistema SHALL exibir visualmente as 12 corridas do ano no perfil com os seguintes estados distintos, cada um acompanhado de rótulo textual: concluída (✅ "Concluída"), desbloqueada (🔓 "Disponível") e bloqueada (🔒 "Bloqueada").
3. THE Sistema SHALL exibir uma barra de progresso no perfil indicando o percentual inteiro (0 a 100) de corridas concluídas em relação às 12 corridas do ano.
4. WHEN o participante desbloquear uma nova conquista, THE Sistema SHALL exibir a conquista na seção de conquistas do perfil com nome e descrição.
5. THE Sistema SHALL exibir apenas o perfil do próprio participante autenticado, sem permitir que um participante acesse o perfil de outro participante pelo mesmo mecanismo de autenticação.
6. IF um participante autenticado tentar acessar o perfil de outro participante via URL direta, THEN THE Sistema SHALL retornar uma resposta de acesso negado e redirecionar o participante para seu próprio perfil.

---

### Requirement 10: Autenticação de Participantes

**User Story:** Como participante, quero me autenticar no sistema usando meu telefone e um código de verificação, para que eu possa acessar meu perfil e registrar minhas corridas com segurança.

#### Acceptance Criteria

1. THE Sistema SHALL oferecer autenticação via número de telefone com código de verificação numérico de 6 dígitos, permitindo ao participante escolher o canal de entrega entre SMS ou WhatsApp.
2. WHEN o participante informar um número de telefone cadastrado no sistema, THE Sistema SHALL enviar um código de verificação de 6 dígitos com validade de 10 minutos a partir do momento do envio.
3. WHEN o participante informar o código de verificação correto dentro do prazo de validade, THE Sistema SHALL iniciar uma Sessão autenticada com duração de 30 dias a partir da última requisição autenticada.
4. IF o participante informar um código de verificação incorreto, THEN THE Sistema SHALL exibir uma mensagem "código inválido" e permitir nova tentativa até o limite de 3 tentativas por código enviado.
5. IF o participante exceder 3 tentativas incorretas para o mesmo código, THEN THE Sistema SHALL invalidar o código e solicitar que o participante solicite um novo código.
6. IF o participante solicitar um novo código antes de expirar o prazo do código anterior, THEN THE Sistema SHALL invalidar o código anterior e gerar um novo código de verificação.
7. WHEN a Sessão do participante expirar por ausência de requisições autenticadas por 30 dias consecutivos, THE Sistema SHALL redirecionar o participante para a tela de autenticação.
8. IF o participante informar um número de telefone não cadastrado no sistema, THEN THE Sistema SHALL exibir uma mensagem informando que o número não está registrado e não enviar nenhum código.
9. IF o participante solicitar mais de 5 códigos de verificação em uma janela de 60 minutos para o mesmo número de telefone, THEN THE Sistema SHALL bloquear novos envios para aquele número durante o período restante da janela e exibir uma mensagem informando o bloqueio temporário.

---

### Requirement 11: Área Administrativa

**User Story:** Como administrador, quero acessar uma área protegida para gerenciar todos os aspectos do IMW Run, para que eu possa manter o sistema atualizado e os participantes organizados.

#### Acceptance Criteria

1. THE Sistema SHALL proteger a área administrativa com autenticação por credenciais de email e senha exclusivas para administradores.
2. IF um usuário não autenticado tentar acessar qualquer rota da área administrativa, THEN THE Sistema SHALL redirecionar o usuário para a página de login administrativo.
3. THE Sistema SHALL disponibilizar na área administrativa as operações de criar, editar e excluir corridas, incluindo os campos: nome, data, horário, local e distância.
4. THE Sistema SHALL disponibilizar na área administrativa a funcionalidade de criar e editar percursos no mapa associados a cada corrida.
5. THE Sistema SHALL disponibilizar na área administrativa a visualização da lista completa de inscritos por corrida, incluindo: número, nome, telefone, idade e data de inscrição.
6. THE Sistema SHALL disponibilizar na área administrativa a exportação da lista de inscritos por corrida em formato CSV.
7. THE Sistema SHALL disponibilizar na área administrativa a funcionalidade de liberar ou bloquear corridas individualmente, alterando o status da corrida entre "Disponível" e "Bloqueada".
8. THE Sistema SHALL exibir na área administrativa um dashboard com as seguintes estatísticas: total de participantes inscritos, total de corridas concluídas, total de km registrados e número de participantes ativos por corrida.
9. WHEN o administrador tentar excluir uma corrida que possua inscritos ou resultados registrados, THE Sistema SHALL exibir uma confirmação listando a quantidade de inscritos e resultados que serão afetados antes de prosseguir com a exclusão.

---

### Requirement 12: Design Mobile-First e Navegação

**User Story:** Como participante, quero navegar pelo sistema com facilidade tanto no celular quanto no computador, para que eu tenha uma experiência fluida em qualquer dispositivo.

#### Acceptance Criteria

1. THE Sistema SHALL ser responsivo de forma que todos os textos, botões e imagens sejam legíveis e utilizáveis nas resoluções de 320px a 2560px de largura, sem sobreposição de elementos ou rolagem horizontal involuntária.
2. THE Sistema SHALL exibir uma barra de navegação inferior em dispositivos com largura de tela menor que 768px, contendo os itens: Início, Corridas, Ranking, Percurso e Perfil, cada item com indicador visual de estado ativo. A barra de navegação inferior SHALL ser ocultada em dispositivos com largura de tela maior ou igual a 768px.
3. THE Sistema SHALL exibir um menu lateral ou superior em dispositivos com largura de tela maior ou igual a 768px com os mesmos itens de navegação da barra inferior.
4. THE Sistema SHALL seguir os princípios de acessibilidade WCAG 2.1 nível AA, incluindo contraste mínimo de 4.5:1 para texto normal, navegação por teclado e área mínima de toque de 44×44px para elementos interativos em dispositivos móveis.
5. THE Sistema SHALL utilizar ícones das categorias corrida, medalha e conquista como elementos visuais principais da identidade visual em todas as páginas.

---

### Requirement 13: Anti-Manipulação e Validação de GPS

**User Story:** Como administrador, quero que o sistema valide os dados de GPS registrados para evitar fraudes, para que o ranking reflita resultados legítimos.

#### Acceptance Criteria

1. WHEN a corrida for encerrada, THE Sistema SHALL registrar no banco de dados a sequência completa de coordenadas GPS capturadas durante a sessão para auditoria posterior.
2. WHEN a corrida for encerrada, THE Sistema SHALL rejeitar o resultado se a velocidade média calculada entre quaisquer dois pontos GPS consecutivos for superior a 25 km/h, classificando o registro como dado inconsistente.
3. WHEN a corrida for encerrada, THE Sistema SHALL calcular a Distância_Válida exclusivamente no servidor utilizando as coordenadas GPS recebidas do cliente, sem aceitar valor de Distância_Válida enviado diretamente pelo cliente.
4. IF a sequência de coordenadas GPS registrada for identificada como inconsistente (por violação do limite de velocidade do critério 2 ou por falha na validação do servidor), THEN THE Sistema SHALL marcar o resultado como "pendente de revisão", preservar as coordenadas registradas para auditoria e notificar o administrador.
5. WHEN uma sessão de corrida for iniciada, THE Sistema SHALL registrar o identificador de dispositivo e o user-agent do navegador para fins de auditoria.
6. IF a sessão de corrida registrar menos de 10 pontos GPS capturados, THEN THE Sistema SHALL rejeitar o resultado como insuficiente para validação e não marcar a corrida como concluída.

---

### Requirement 14: Modularidade e Extensibilidade

**User Story:** Como administrador, quero que o sistema seja construído de forma modular, para que novas funcionalidades possam ser adicionadas no futuro sem grandes reestruturações.

#### Acceptance Criteria

1. THE Sistema SHALL ser construído de forma que o frontend (Next.js) se comunique com o backend exclusivamente via API REST, e o backend se comunique com o banco de dados exclusivamente por meio da camada de acesso a dados, sem acesso direto ao banco pelo frontend.
2. THE Sistema SHALL expor uma API REST documentada no formato OpenAPI 3.0, onde cada endpoint possui definidos: método HTTP, caminho, esquema de requisição, esquema de resposta e requisito de autenticação.
3. THE Sistema SHALL estruturar o banco de dados de forma que novas entidades (equipes, patrocinadores, medalhas físicas, integrações com dispositivos esportivos) possam ser adicionadas por meio de novas tabelas que referenciam as tabelas existentes por chave estrangeira, sem remoção ou renomeação de colunas ou tabelas existentes.
