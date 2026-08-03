# Diurno

Aplicativo de organização de hábitos e tarefas com sugestões de IA e persistência no Firebase.

## Configuração Firebase Auth + Firestore

O projeto está configurado para usar o Firebase para autenticação e armazenamento de dados em tempo real. O Firebase já foi provisionado, e a configuração está no arquivo `firebase-applet-config.json` que a plataforma Google AI Studio preenche automaticamente.

### Passos manuais necessários no Firebase Console:

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Selecione o projeto criado para este app.
3. No menu lateral, acesse **Build > Authentication**.
4. Vá na aba **Sign-in method** e adicione/ative os seguintes provedores:
   - **E-mail/senha**
   - **Google** (importante preencher o e-mail de suporte para ativar)
5. Para o Firestore, as regras de segurança (*firestore.rules*) e o banco de dados já foram provisionados via script de infraestrutura do AI Studio. 
6. As tarefas e preferências dos usuários serão salvas respectivamente nas coleções `/tasks` e `/users`.

## Configuração de IA (Gemini)

Para que o chat e os insights com Inteligência Artificial funcionem corretamente:

1. Renomeie (ou crie) o arquivo `.env.example` para `.env`
2. Adicione sua chave da API do Google Gemini:

```env
GEMINI_API_KEY=sua-chave-aqui
```

**ATENÇÃO**: Nunca commite o arquivo `.env` com sua chave real no repositório.
