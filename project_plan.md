# LibrasVox Pro - Plataforma Acadêmica de Libras

## 1. Descrição do Projeto
LibrasVox Pro é uma plataforma educacional acadêmica e completa para aprendizado de Libras (Língua Brasileira de Sinais). Tom formal e universitário, com módulos estruturados, gramática, exercícios, glossário, certificados e referências bibliográficas. Integra IA Gemini para assistência personalizada. Público-alvo: estudantes, educadores, intérpretes em formação e pesquisadores.

## 2. Estrutura de Páginas
- `/` — Home — Landing page acadêmica com apresentação da plataforma
- `/cursos` — Módulos de Curso (Básico, Intermediário, Avançado)
- `/cursos/:nivel/:moduloId` — Aula individual dentro de um módulo
- `/gramatica` — Gramática da Libras (estrutura, expressões faciais, classificadores)
- `/exercicios` — Exercícios práticos com feedback imediato
- `/dictionary` — Glossário Acadêmico de Sinais (50+ sinais)
- `/alphabet` — Datilologia Interativa (alfabeto manual A-Z)
- `/assistant` — Assistente IA (Gemini) com 4 modos especializados
- `/recognition` — Reconhecimento de Sinais via câmera
- `/progress` — Perfil do Aluno com histórico detalhado e certificados
- `/referencias` — Referências Bibliográficas e Materiais de Estudo
- `/planos` — Planos e Preços

## 3. Funcionalidades Principais
- [x] Home page com hero, features, depoimentos e CTA
- [x] Navbar responsiva
- [x] Dicionário com 50+ sinais, busca, filtros
- [x] Datilologia interativa com Canvas
- [x] Assistente IA Gemini (4 modos)
- [x] Reconhecimento de sinais via câmera
- [x] Sistema de progresso (localStorage)
- [ ] Página de Cursos com módulos estruturados por nível
- [ ] Página de Gramática da Libras (acadêmica)
- [ ] Página de Exercícios com feedback
- [ ] Página de Referências Bibliográficas
- [ ] Certificados de conclusão (PDF/visual)
- [ ] Navbar atualizada com novas rotas acadêmicas

## 4. Modelo de Dados (localStorage)
```json
{
  "learnedSigns": ["oi", "obrigado"],
  "favoriteSigns": ["oi"],
  "streak": 5,
  "totalPracticeTime": 120,
  "lastSession": "2026-04-01",
  "completedModules": ["basico-1", "basico-2"],
  "completedExercises": ["ex-001"],
  "certificates": ["basico"]
}
```

## 5. Plano de Integrações
- **Supabase**: Não necessário — progresso salvo em localStorage
- **Google Gemini AI**: Assistente IA (todos os modos gratuitos)
- **Web Speech API**: TTS nativo
- **MediaDevices API**: Câmera para reconhecimento

## 6. Informações do Criador
- **Criador**: Fernando Mário da Silva Martins
- **Contato**: librasvox@gmail.com
- **Missão**: Democratizar o aprendizado de Libras no Brasil, tornando a plataforma 100% gratuita e acessível a todos.

## 7. Plano de Desenvolvimento

### Phase 1–6: Concluídas ✅
Home, Dicionário, Datilologia, Assistente IA, Reconhecimento, Progresso

### Phase 7: Plataforma Acadêmica (Em andamento)
- Página /cursos com módulos por nível
- Página /gramatica com conteúdo acadêmico
- Página /exercicios com quiz interativo
- Página /referencias com bibliografia
- Navbar atualizada
- Home com tom acadêmico
