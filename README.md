# Site | Dr. Jander Toledo Ferreira

Landing page do Dr. Jander Toledo Ferreira, MÉDICO, CRM-MG 19.515, Cirurgia Geral (RQE 48.711) e Cirurgia do Aparelho Digestivo, em Belo Horizonte.

**Situação atual: versão de revisão.** O site está bloqueado para o Google (noindex) e mostra o botão "Pendências para publicação". Serve para o Dr. Jander visualizar e sugerir ajustes antes da publicação definitiva.

Projeto MedDigital.

---

## Estrutura

```
site-dr-jander-toledo/
├── index.html               Página inicial (todo o conteúdo)
├── 404.html                 Página de endereço não encontrado
├── vercel.json              Configuração da Vercel (cabeçalhos e cache)
├── robots.txt               Bloqueio de indexação na fase de revisão
├── site.webmanifest         Nome, cores e ícones do site
├── .gitignore
└── assets/
    ├── css/estilo.css       Estilos (cores, tipografia, layout)
    ├── js/principal.js      Comportamento: WhatsApp, menu, painéis, mapa
    ├── js/mapa-dados.js     Ruas, hospitais e consultórios do mapa (OpenStreetMap)
    ├── img/logo/            Logotipos em SVG (todas as versões)
    ├── img/icones/          Favicon e ícones de atalho
    ├── img/og-imagem.png    Imagem exibida ao compartilhar o link
    └── vendor/leaflet/      Biblioteca do mapa interativo (licença BSD)
```

É um site estático: não precisa de instalação, compilação nem banco de dados.

---

## 1. Colocar no GitHub

### Opção A: pelo navegador (sem programação)

1. Acesse https://github.com e entre na conta.
2. Clique em **New repository**.
3. Nome sugerido: `site-dr-jander-toledo`. Marque **Private**. Não marque nenhuma opção de README.
4. Clique em **Create repository**.
5. Na tela seguinte, clique em **uploading an existing file**.
6. Arraste **o conteúdo** da pasta `site-dr-jander-toledo` (os arquivos e a pasta `assets`, não a pasta em si).
7. Em "Commit changes", escreva `Versão de revisão do site` e clique em **Commit changes**.

Observação: o arquivo `.gitignore` começa com ponto e pode ficar oculto no Windows ou no Mac. Ele é opcional.

### Opção B: pelo terminal (Git instalado)

```bash
cd site-dr-jander-toledo
git init
git add .
git commit -m "Versão de revisão do site"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/site-dr-jander-toledo.git
git push -u origin main
```

---

## 2. Publicar na Vercel

1. Acesse https://vercel.com e entre com a conta do GitHub.
2. Clique em **Add New... > Project**.
3. Na lista, escolha o repositório `site-dr-jander-toledo` e clique em **Import**.
4. Configuração:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** deixar vazio
   - **Output Directory:** deixar vazio
5. Clique em **Deploy**.
6. Em cerca de 1 minuto a Vercel gera um endereço como `site-dr-jander-toledo.vercel.app`. É esse link que vai para o Dr. Jander.

A partir daí, toda alteração enviada ao GitHub é publicada automaticamente na Vercel.

**Dica para a revisão:** em **Settings > Deployment Protection** dá para exigir senha ou login da Vercel para abrir o site (recurso de planos pagos). No plano gratuito, o link fica acessível para quem o tiver, mas não aparece no Google.

---

## 3. Ajustes rápidos

| O que | Onde | Como |
|---|---|---|
| Número do WhatsApp | `assets/js/principal.js` | Preencher `var WHATSAPP = "";` com DDI e DDD, só números. Ex.: `"5531999999999"`. Vale para todos os botões. |
| Telefone | `index.html` | Substituir `[TELEFONE]` (inclusive nos links `tel:[TELEFONE]`, sem espaços nem traços: `tel:+553132414277`). |
| E-mail, convênios, horários, hospitais | `index.html` | Procurar os marcadores entre colchetes, como `[E-MAIL]`, `[CONVÊNIOS DESTE LOCAL]` e `[HORÁRIOS]`, e substituir pelo texto final. |
| RQE de Cirurgia do Aparelho Digestivo | `index.html` | Procurar `A CONFIRMAR` (6 ocorrências) e trocar o bloco `<span class="pendente">...</span>` pelo número do RQE. |
| Retrato e foto no consultório | `index.html` | Salvar as fotos em `assets/img/` e trocar cada bloco `<div class="vazio">...</div>` por `<img src="assets/img/NOME.jpg" alt="...">`. Fotos verticais 4:5, mínimo 1200 x 1500 px, em JPG ou WebP com até 300 KB. |
| Botão de pendências | `assets/js/principal.js` | `var REVISAO = true;` mostra o botão. Trocar para `false` na publicação. |

---

## 4. Checklist para a publicação definitiva

**Conteúdo e conformidade (Resolução CFM nº 2.336/2023)**
- [ ] RQE de Cirurgia do Aparelho Digestivo registrado no CRM-MG e inserido. Sem ele, a especialidade sai do site.
- [ ] Ano e instituição da residência em Cirurgia do Aparelho Digestivo.
- [ ] Sociedades médicas com vigência confirmada (CBC, SOBRACIL, SBCBM).
- [ ] Cursos: se algum for pós-graduação lato sensu, incluir o termo NÃO ESPECIALISTA.
- [ ] Textos dos painéis de condições e orientações validados pelo Dr. Jander.
- [ ] Hospitais onde opera: somente vínculos atuais, sem logotipos.
- [ ] Nenhum superlativo, promessa de resultado, depoimento, antes e depois ou número de avaliações.

**Dados de contato e locais**
- [ ] WhatsApp, telefone e e-mail.
- [ ] Convênios e horários de cada consultório.
- [ ] Posição dos pinos no mapa conferida (`assets/js/mapa-dados.js`, campo `consultorios`).

**Técnico**
- [ ] `var REVISAO = false;` em `assets/js/principal.js`.
- [ ] Remover `<meta name="robots" content="noindex, nofollow">` do `index.html`.
- [ ] Remover o cabeçalho `X-Robots-Tag` do `vercel.json`.
- [ ] Liberar o `robots.txt` (instruções dentro do arquivo).
- [ ] Ativar a linha `canonical` no `index.html` com o domínio final.
- [ ] Trocar `og:image` por endereço completo: `https://www.drjandertoledo.com.br/assets/img/og-imagem.png`.
- [ ] Conectar o domínio (seção 5).
- [ ] Instalar Google Tag Manager ou GA4. Os cliques em WhatsApp, telefone, agendamento, mapa e Doctoralia já são enviados ao `dataLayer` com o evento `clique_site`.
- [ ] Atualizar o aviso de privacidade (LGPD) se houver ferramentas de medição.

---

## 5. Domínio próprio (drjandertoledo.com.br)

1. Registrar o domínio em https://registro.br (verificar disponibilidade).
2. Na Vercel: **Settings > Domains > Add** e digitar `drjandertoledo.com.br` e `www.drjandertoledo.com.br`.
3. A Vercel mostra os registros DNS. No Registro.br, em **DNS > Editar zona**, criar:
   - Tipo `A`, nome em branco (`@`), valor indicado pela Vercel.
   - Tipo `CNAME`, nome `www`, valor indicado pela Vercel.
4. A propagação leva de minutos a algumas horas. O certificado HTTPS é emitido automaticamente.

---

## Créditos técnicos

- Mapa: dados © colaboradores do OpenStreetMap (licença ODbL), exibidos com Leaflet 1.9.4 (licença BSD-2).
- Fontes: Lora e Inter, via Google Fonts (licença SIL Open Font).
