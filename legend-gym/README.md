# Legend Gym — Site

Redesign do site da **Legend Gym** (Faro · Olhão · Lisboa): uma página única e imersiva, com transições entre secções, hero com sobreposição de texto e imagem, animações de texto e efeitos de perspetiva ao fazer scroll.

## Secções

1. **Hero**: texto atrás e à frente da imagem (sobreposição); a imagem expande até ocupar o ecrã ao fazer scroll
2. **Marquee**: faixas inclinadas que aceleram com a velocidade do scroll
3. **Filosofia**: o texto "acende" palavra a palavra
4. **O espaço**: scroll horizontal com cartões em perspetiva 3D
5. **Recovery Zone**: revelação circular da imagem
6. **Números**: grelha que se endireita em perspetiva, com contadores
7. **Mensalidades**: cartões que viram em 3D
8. **Clubes**: lista com pré-visualização de imagem que segue o cursor, mais o horário
9. **App**: telemóvel em 3D animado pelo scroll
10. **Quem somos**: imagens sobrepostas em parallax
11. **CTA e rodapé**: janela que se abre em ecrã inteiro e wordmark gigante

O fundo da página muda entre preto, papel e amarelo à medida que cada secção entra.

## Tecnologia

- HTML, CSS e JavaScript puros, sem build
- [GSAP](https://gsap.com/) + ScrollTrigger: animações ligadas ao scroll
- [Lenis](https://github.com/darkroomengineering/lenis): smooth scroll
- Fontes: Big Shoulders Display + Inter Tight (Google Fonts)

As bibliotecas estão incluídas em `assets/js/vendor/`, por isso o site não depende de CDNs.
Se o utilizador tiver ativado "reduzir movimento" no sistema, o site respeita essa preferência (`prefers-reduced-motion`).

## Estrutura

```
index.html
assets/
  css/style.css
  js/main.js
  js/vendor/  gsap.min.js · ScrollTrigger.min.js · lenis.min.js
  img/        fotos (jpg otimizadas)
```

## Correr localmente

Abre o `index.html` no navegador ou serve a pasta:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Publicar no GitHub Pages

1. Cria um repositório novo e envia estes ficheiros:
   ```bash
   git init
   git add .
   git commit -m "Site Legend Gym"
   git branch -M main
   git remote add origin https://github.com/<utilizador>/<repo>.git
   git push -u origin main
   ```
2. No GitHub, vai a **Settings → Pages**. Em *Source* escolhe **Deploy from a branch**, depois **main** / **root**.
3. O site fica disponível em `https://<utilizador>.github.io/<repo>/`.

## Antes de pôr em produção

- [ ] Confirmar os preços (Weekend 30€, Classic 35€, Black 40€ para o Algarve; Lisboa tem preçário próprio)
- [ ] Adicionar as moradas dos clubes e os links para cada um
- [ ] Ligar os botões "Adere já" à página de inscrição real
- [ ] Substituir o link do Google Play (atualmente é uma pesquisa) pelo link direto da app
- [ ] Preencher os links legais no rodapé (Proteção de Dados, Cookies, Termos, RAL)
- [ ] Trocar as fotos do Unsplash por fotos reais dos clubes (`hero`, `p1–p3`, `f2`, `f4`, `f6`, `c2`, `c3`, `fam`, `cta`)

## Créditos das imagens

- Fotos dos ficheiros `f1`, `f3`, `f5`, `rz` e `c1`: Legend Gym (belegend.pt)
- Restantes fotos: [Unsplash](https://unsplash.com/license)
