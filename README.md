# Chat-Original
Chat criado em React-Native com Api Spring Boot 

## Passo a Passo de como rodar o programa
 1. Passo: Verificar se o MongoDB, Java e React está instalado na maquina.  
 2. Passo: Abrir o pasta BackEnd em um Idea para Rodar o Java(Exemplo: Eclipse, Intellij).  
 3. Passo: Rodar o Main.java.  
 4. Passo: Rodar o React-Nativo(Exemplo: Visual Studio Code).    
 5. Passo: abrir o terminal e colocar o código:  
    - Criar um projeto (se ainda não existir)
      npx create-expo-app@latest chat-frontend --template blank
    - Substituir o App.js pelo código deste repositório
    - npm install (se necessário).
    - npx expo install react-dom react-native-web @expo/metro-runtime (se necessário)
    - npm expo start.  

## EndPoints:

http://localhost:8090/projeto/api/v1/chat
