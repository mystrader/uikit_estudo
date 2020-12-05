# UIKIT-Seed

## Desenvolvendo no Projeto Raiz

Caso deseje desenvolver no projeto raiz para que os projetos originários sejam também afetados, é recomendado fazer o link (do npm) da biblioteca do uikit.

### Como fazer o link:

1 - Faça o clone do repositório da biblioteca e faça o build com watch
```sh
git clone https://git.cnj.jus.br/joao.carmo/uikit.git
cd uikit
npm install
ng build uikit --watch
```

2 - Faça o link da biblioteca _**(em outro shell)**_
```sh
cd dist/uikit #importante fazer de dentro deste diretório
npm link
```

3 - No diretório deste projeto (uikit-seed), faça o link com o `@cnj/uikit`
```sh
npm link @cnj/uikit
```

4 - Pode fazer o serve para testar a biblioteca
```sh
ng serve
```
