# EduBlog Mobile - Aplicativo de Gestão de Conteúdo Educacional

Aplicativo móvel desenvolvido com **React Native** e **Expo (SDK 52)** como parte do **Tech Challenge - Fase 04** da Pós-Graduação FIAP (Full Stack Development / Mobile). O aplicativo consome a API RESTful do backend (`educational-posts-backend`), permitindo a visualização pública de postagens, leitura completa, gestão de publicações e administração de docentes e alunos com controle de acesso baseado em papéis (RBAC).

---

## 📱 Funcionalidades Implementadas

### 1. Feed e Leitura de Postagens (Acesso Público)
- **Feed Principal com Busca Instantânea (Req. 1):** Listagem de todas as postagens publicadas com campo de busca em tempo real por palavras-chave (no título ou conteúdo), busca debounced e feedback de carregamento (*Pull to Refresh* suportado).
- **Leitura Completa da Postagem (Req. 2):** Tela dedicada exibindo título, autor, data formatada em padrão brasileiro e corpo completo do texto. Acesso direto a ações contextuais de edição/exclusão caso o usuário seja o autor ou administrador.

### 2. Gestão de Postagens (Docentes e Administradores)
- **Criação de Postagem (Req. 3):** Formulário completo com validação de campos obrigatórios (`título` e `conteúdo`), acessível apenas a docentes e administradores autenticados.
- **Edição de Postagem (Req. 4):** Edição com dados pré-carregados da postagem existente e atualização instantânea via API.
- **Painel Administrativo de Postagens (Req. 9):** Tabela/lista de controle com ações diretas para visualização, edição e exclusão com diálogo de confirmação.
  - *Regra de Negócio RBAC:* Professores visualizam e gerenciam apenas suas próprias postagens. Administradores visualizam e gerenciam todas as postagens do sistema.

### 3. Gestão de Usuários (Docentes e Alunos)
> **Observação de Arquitetura & Segurança:** Por decisão de projeto, **apenas o Administrador** tem permissão para cadastrar, editar e excluir novos usuários (docentes e discentes). Os professores têm acesso concedido para visualizar, pesquisar e paginar as listas de docentes e alunos, porém os botões de ação e os endpoints de cadastro/edição/exclusão são protegidos e restritos exclusivamente ao administrador.

- **Gestão de Docentes (Req. 5, 6 e 7):**
  - Listagem paginada de professores (`GET /users?role=professor`) com filtro dinâmico por nome ou e-mail (acessível por docentes e administradores).
  - Cadastro de novo professor (`POST /users`), edição (`PUT /users/:id`) e exclusão segura (exclusivo para administradores).
- **Gestão de Alunos (Req. 8):**
  - Listagem paginada de alunos (`GET /users?role=aluno`) com busca em tempo real (acessível por docentes e administradores).
  - Cadastro de novos discentes (`POST /users`), edição cadastral e exclusão segura (exclusivo para administradores).

### 4. Autenticação e Sessão (Req. 10)
- **Login Seguro via JWT:** Autenticação de credenciais com armazenamento persistente de token no `@react-native-async-storage/async-storage`.
- **Atalhos Rápidos de Demonstração:** Botões na tela de login para preenchimento imediato de credenciais de teste para diferentes perfis (`Aluno`, `Professor 1`, `Professor 2` e `Administrador`).
- **Navegação Dinâmica por Perfil:** As abas inferiores e permissões na interface se adaptam em tempo real dependendo do nível de acesso do usuário logado.

---

## 🛠️ Tecnologias Utilizadas

- **React Native 0.76.7** & **Expo SDK 52**
- **React 18.3.1**
- **React Navigation v6** (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
- **Axios** com interceptors para injeção automática de Bearer Token JWT
- **AsyncStorage** para persistência de sessão e configurações de rede
- **Expo Vector Icons** (Ionicons) para ícones nativos e consistência visual
- **React Native Safe Area Context** e **Screens** para suporte adaptativo a entalhes (notches) e barras de navegação em iOS e Android

---

## 📂 Estrutura do Projeto

```text
educational-posts-mobile/
├── App.js                     # Ponto de entrada: Providers e navegação raiz
├── app.json                   # Configurações do Expo
├── babel.config.js            # Configuração do compilador Babel
├── package.json               # Dependências e scripts do projeto
└── src/
    ├── context/
    │   └── AuthContext.js     # Contexto global de autenticação e sessão
    ├── navigation/
    │   └── AppNavigator.js    # Bottom Tabs e Stack Navigators por fluxo
    ├── screens/
    │   ├── HomeScreen.js           # Feed público com busca por palavra-chave
    │   ├── PostDetailScreen.js     # Visualização completa de uma postagem
    │   ├── LoginScreen.js          # Autenticação com atalhos de teste
    │   ├── AdminPostsScreen.js     # Gestão de postagens (RBAC)
    │   ├── CreatePostScreen.js     # Formulário de criação de postagem
    │   ├── EditPostScreen.js       # Formulário de edição de postagem
    │   ├── TeachersListScreen.js   # Listagem paginada de docentes
    │   ├── CreateTeacherScreen.js  # Cadastro de novo docente
    │   ├── EditTeacherScreen.js    # Edição cadastral de docente
    │   ├── StudentsListScreen.js   # Listagem paginada de alunos
    │   ├── CreateStudentScreen.js  # Cadastro de novo aluno
    │   ├── EditStudentScreen.js    # Edição cadastral de aluno
    │   └── ProfileScreen.js        # Perfil, Logout e Configuração de IP da API
    ├── services/
    │   └── api.js             # Instância Axios, interceptors e detecção de IP
    └── styles/
        └── theme.js           # Tokens visuais (cores, tipografia, espaçamentos)
```

---

## 🚀 Como Executar o Projeto

Você pode executar o projeto de duas formas: **via Docker** (mais simples e reproduzível) ou **localmente com Node/Expo**.

---

## 🐳 Executando com Docker (Recomendado para Avaliação)

O aplicativo conta com uma configuração completa em Docker utilizando build *multi-stage*:
- **Estágio 1 (Builder):** Utiliza Node.js para compilar e exportar os assets web do React Native Expo com o Metro Bundler.
- **Estágio 2 (Produção):** Imagem leve `nginx:alpine` servindo os arquivos estáticos otimizados na porta `8081` com roteamento SPA.

### 1. Build e Inicialização do Container
Na raiz do diretório `educational-posts-mobile`:
```bash
docker compose up -d --build
```

Após o término do build, acesse o aplicativo no navegador em:
👉 **`http://localhost:8081`**

> **Dica sobre a API:** Por padrão, o `docker-compose.yml` aponta para `http://localhost:3000`. Se desejar alterar o endereço do backend, você pode passar a variável no comando de build ou editar o `docker-compose.yml`:
> ```bash
> docker compose build --build-arg EXPO_PUBLIC_API_URL=http://outro-ip:3000
> ```

### 2. Visualização dos Logs e Parada
- Para visualizar os logs do Nginx / acesso:
  ```bash
  docker compose logs -f
  ```
- Para parar o container:
  ```bash
  docker compose down
  ```

---

## ⚙️ Executando Localmente com Node / Expo

### Pré-requisitos
1. **Node.js** instalado (versão 18 ou superior).
2. O backend (`educational-posts-backend`) em execução na porta `3000`.
3. Aplicativo **Expo Go** instalado no smartphone **ou** emulador Android Studio / Simulador iOS configurado na máquina.

### 1. Inicializando o Backend
No diretório do repositório backend:
```bash
npm install
npm run seed     # Alimenta o banco com usuários e postagens de teste
npm start        # Inicia a API REST na porta 3000
```

### 2. Configurando o Ambiente e Inicializando o Mobile
No diretório `educational-posts-mobile`:
```bash
# Instalar as dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Iniciar o servidor de desenvolvimento Expo
npm start
# ou: npx expo start
```

> **Nota sobre a URL da API:** A conexão com o servidor é configurada via variável de ambiente `EXPO_PUBLIC_API_URL` (no arquivo `.env` ou prefixando o comando de inicialização):
> - **Navegador Web / iOS:** `EXPO_PUBLIC_API_URL=http://localhost:3000`
> - **Emulador Android Studio:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
> - **Dispositivo Físico (Expo Go):** `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000` (substitua pelo IP da sua máquina na rede local)

### 3. Conectando o Celular ou Emulador

- **Navegador Web:** Pressione `w` no terminal do Expo.
- **Emulador Android Studio:** Pressione `a` no terminal do Expo.
- **Simulador iOS:** Pressione `i` no terminal do Expo.
- **Dispositivo Físico (Expo Go via QR Code):**
  1. Conecte o smartphone na mesma rede Wi-Fi do computador.
  2. Defina no arquivo `.env` o seu IP local (ex: `EXPO_PUBLIC_API_URL=http://192.168.0.117:3000`).
  3. Abra o app Expo Go e aponte a câmera para o QR Code exibido no terminal.

---

## 🔑 Credenciais de Demonstração (Seed)

Para testar todas as funcionalidades e regras de negócio com facilidade, utilize os atalhos da tela de login ou os dados abaixo:

| Papel | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@test.com` | `password123` | Acesso total: todos os posts, gestão completa de docentes e alunos |
| **Professor 1** | `teacher1@test.com` | `password123` | Cria posts, visualiza e edita apenas seus próprios posts, visualiza docentes e alunos |
| **Professor 2** | `teacher2@test.com` | `password123` | Cria posts, visualiza e edita apenas seus próprios posts (isolamento do Prof 1) |
| **Aluno** | `student@test.com` | `password123` | Leitura de posts, perfil de estudante |
| **Convidado (Público)**| *Sem Login* | *N/A* | Feed de notícias e leitura completa de qualquer post |

---

## 📝 Relato de Experiências e Desafios Enfrentados pela Equipe

### 1. Separação de Arquitetura e Repositórios
A decisão de manter o aplicativo mobile em um repositório isolado (`educational-posts-mobile`) desacoplado do backend (`educational-posts-backend`) seguiu as melhores práticas de engenharia de software corporativo. Isso garante ciclos de vida e versionamentos independentes para as plataformas, além de permitir pipelines de integração contínua (CI/CD) específicas para mobile e API.

### 2. Transição Web para Mobile (React vs. React Native)
Diferente da interface web, o desenvolvimento para dispositivos móveis exigiu o uso estrito de componentes nativos (`View`, `Text`, `FlatList`, `KeyboardAvoidingView`, `SafeAreaView`) e a adaptação do modelo de layout Flexbox padrão do React Native (onde `flexDirection` é `column` por padrão). Para garantir alta fluidez e evitar quedas de taxa de quadros (*FPS drops*), foi priorizado o uso de `FlatList` com `keyExtractor` e `renderItem` memoizados, em vez de `ScrollView` com mapeamento manual de arrays.

### 3. Resolução de Rede e Configuração por Variável de Ambiente
Um dos desafios ao testar aplicativos React Native contra um backend local é a resolução de portas:
- Emuladores Android mapeiam o localhost do host pelo endereço especial `10.0.2.2:3000`.
- Aparelhos físicos via Expo Go não alcançam `localhost`, necessitando do endereço IP privado da máquina na rede local (ex: `192.168.x.x:3000`).
Para mitigar riscos de segurança e evitar brechas decorrentes de configurações manuais na interface por usuários finais, a URL do backend foi padronizada para ser injetada em tempo de inicialização via variável de ambiente `EXPO_PUBLIC_API_URL` (definida no arquivo `.env` ou no comando de inicialização `npm start`).

### 4. Controle de Acesso Baseado em Papéis (RBAC) e Experiência do Usuário
A especificação exigiu isolamento de permissões:
- Usuários anônimos e alunos têm permissão de leitura sobre as postagens.
- Professores podem gerenciar suas postagens, mas não têm permissão de alterar ou excluir postagens de outros docentes no painel administrativo.
- **Decisão de Gestão de Usuários:** Por decisão de projeto para prevenir privilégios indevidos, a criação, edição e exclusão de qualquer usuário (docentes e alunos) é atribuição estrita do **Administrador**. Os professores possuem visão de consulta para acompanhar o corpo docente e os estudantes da instituição, mas não podem efetuar mutações cadastrais.
- Administradores possuem visão holística sobre todas as publicações e o controle total de cadastros.
A interface móvel reflete isso de maneira limpa por meio de renderização condicional nas abas de navegação (`BottomTabNavigator`) e controle de botões de ação nas telas de listagem.
